import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EpisodeDto } from './Dto/episodeDto';
import { UpdateEpisodeDto } from './Dto/updateEpisodeDto';
import { Episode, EpisodeCategory, status } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EpisodeService {
    constructor(private db: PrismaService, private configService: ConfigService){}

    seasonSwitch(season: string){
            switch(season.slice(0,3)){
                case 'S01':
                    return  'Season 1';
                case 'S02':
                    return  'Season 2';
                case 'S03':
                    return  'Season 3';
                case 'S04':
                    return  'Season 4';
                case 'S05':
                    return  'Season 5';
                default:
                        return null
                    }
            }

    async check_duplicate(episodeId: number, episodeName: string, episodeSeason: EpisodeCategory, isCreating: boolean){
        try{
            const episode = await this.db.episode.findUnique({where:{id: episodeId}})
            if (!episodeSeason)
                throw new HttpException('Invalid season', HttpStatus.FORBIDDEN)
            else if ( episode && isCreating)//Si se llama desde la funcion de crear si el episodio ya existe dara un error
                throw new HttpException('The episode already exists', HttpStatus.NOT_FOUND)
            else if ( !episode && !isCreating)//Si se llama desde la funcion de actualizar si el episodio no existe dara un error
                throw new HttpException('The episode doesnt exists', HttpStatus.NOT_FOUND)
            const nameEpisodeExists = await this.db.episode.findFirst({where: {AND: [{name: episodeName}, {categoryId: episodeSeason.epCategoryId}]}})
            if (nameEpisodeExists && nameEpisodeExists.id !== episodeId)
                throw new HttpException('The episodes name already exist in the season', HttpStatus.NOT_FOUND)
            return {bool: false}
        }catch(error){
            if (error instanceof HttpException) {
                return {
                    message: error.message,
                    status: error.getStatus(),
                    bool: true
                }
            }
        }
    }

    async create_episode(Dto: EpisodeDto){
        try{

            const season = this.seasonSwitch(Dto.episode)
            if(season === null)
                throw new HttpException('Invalid season', HttpStatus.FORBIDDEN)

            const category = (await this.db.episodeCategory.findFirst({where: {subcategory: season}}))
            const posible_error = this.check_duplicate(Dto.id, Dto.name, category, true)

            if((await posible_error).bool)
                throw new HttpException((await posible_error).message, (await posible_error).status)

            const episode =  this.db.episode.create({
                data: {
                    id: Dto.id,
                    name: Dto.name,
                    statusId: (await this.db.status.findFirst({where: {AND: [ {status: 'Active'} ,{type:'Episode'}]}})).statusId,
                    air_date: Dto.air_date,
                    episode: Dto.episode,
                    duration: Dto.duration,
                    categoryId: category.epCategoryId,
                    charactersIds: Dto.characters
                }
        })

            return episode

        }catch(error){
            if (error instanceof HttpException && error.message === 'The episodes name already exist in the season')
                return 'Duplicated Episode Skiped'
            throw error
        }
    }

    async update_episode(Dto: UpdateEpisodeDto, id: number){
        try{
            const season = this.seasonSwitch(Dto.episode)
            if(season === null)
                throw new HttpException('Invalid season', HttpStatus.FORBIDDEN)

            const category = (await this.db.episodeCategory.findFirst({where: {subcategory: season}}))
            const posible_error = this.check_duplicate(id, Dto.name, category, false)

            if((await posible_error).bool)
                throw new HttpException((await posible_error).message, (await posible_error).status)

            const episode = await this.db.episode.update({
                where: {id: id},
                data: {
                    name: Dto.name,
                    air_date: Dto.air_date,
                    episode: Dto.episode,
                    duration: Dto.duration,
                    categoryId: category.epCategoryId,
                    charactersIds: Dto.characters
                }
            })
            return episode
        }catch(error){
            throw error
        }
    }

    async check_status_change(statusIdActual: number, newStatus: status){
        if (statusIdActual === newStatus.statusId){
            return true
        }else{
            return false
        }
    }

    async change_status(id: number, status: string){
        try{
            const statusString: string = JSON.parse(JSON.stringify(status)).status
            const newStatus = await this.db.status.findFirst({where: {AND: [{status: statusString}, {type: 'Episode'}]}})
            if (!newStatus)
                throw new HttpException('The status doesnt exist', HttpStatus.NOT_FOUND)
            let episode = await this.db.episode.findFirst({where: {id:id}})
            if (!episode)
                throw new HttpException('The episode doesnt exist', HttpStatus.NOT_FOUND)
            if (!this.check_status_change(episode.statusId, newStatus))
                return new HttpException('The episode is already ' + statusString, HttpStatus.FORBIDDEN)
            episode = await this.db.episode.update({
                where:{
                    id:id,
                },
                data:{
                    statusId: (await this.db.status.findFirst({where: { AND: [{status: statusString}, {type: 'Episode'}]} })).statusId,
                }
            })

            return episode
        }catch(error){
            throw error
        }
    }

    are_episodes(episodes: Episode[]){
        try{
            if (!episodes || episodes.length === 0 || episodes === null)
                throw new HttpException('There are no episodes', HttpStatus.NOT_FOUND)
            return {bool: false}
        }catch(error){
            return {
                message: error.message,
                status: error.getStatus(),
                bool: true
            }
        }
    }

    async get_all_episodes(page: number){
        try{
            let nextPage;
            const episodeList = await this.db.episode.findMany()
            const episodes = await this.db.episode.findMany({
                skip: (page -1) * 5,
                take: 5})

            const posible_error = this.are_episodes(episodes)
            if (posible_error.bool)
                throw new HttpException(posible_error.message, posible_error.status)

            const totalEpisodes = episodeList.length
            const totalPages = Math.ceil(totalEpisodes / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'episode/get_all/' + page
            }
            return {
                data: episodes,
                meta: {
                    totalItems: totalEpisodes,
                    totalPages: totalPages,
                    currentPage: page-1,
                    perPage: 5,
                    nextPage: nextPage
                }
            }
        }catch(error){
            throw error
        }
    }

    async get_by_status(statusToSearch: string, page: number){
        try{
            let nextPage;
            const statusString: string = JSON.parse(JSON.stringify(statusToSearch)).status
            const status = (await this.db.status.findFirst({where: {AND: [{status: statusString}, {type: 'Episode'}]} }))
            if (!status || status === null)
                throw new HttpException('Status doesnt exists', HttpStatus.NOT_FOUND)
            let episodes = []
            const episodeList = await this.db.episode.findMany({where: {statusId: status.statusId}})
            if (status.type === 'Episode'){
                episodes = await this.db.episode.findMany({where: {statusId: status.statusId}, skip: (page -1) * 5, take: 5})
                const posible_error = this.are_episodes(episodes)
                if (posible_error.bool)
                    throw new HttpException(posible_error.message, posible_error.status)
    
                const totalEpisodes = episodeList.length
                const totalPages = Math.ceil(totalEpisodes / 5)
                if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'episode/get_by_status/' + page
            }
            return {
                data: episodes,
                meta: {
                    totalItems: totalEpisodes,
                    totalPages: totalPages,
                    currentPage: page-1,
                    perPage: 5,
                    nextPage: nextPage
                }
            }
            }else{
                page++
                return new HttpException('That status is not related to an episode', HttpStatus.FORBIDDEN)
            }
        }catch(error){
            throw error
        }
    } 

    async get_by_category(categoryToSearch: string, page: number){
        try{
            let nextPage;
            const categoryString: string = JSON.parse(JSON.stringify(categoryToSearch)).category
            const category = (await this.db.episodeCategory.findFirst({where: {subcategory: categoryString}}))
            console.log(categoryToSearch)
            if (!category || category === null)
                throw new HttpException('The category doesnt exist', HttpStatus.NOT_FOUND)
            const episodeList = await this.db.episode.findMany({where: {categoryId: category.epCategoryId}})
            const episodes = await this.db.episode.findMany({where: {categoryId: category.epCategoryId}, skip: (page -1) * 5, take: 5})
            const posible_error = this.are_episodes(episodes)
            if (posible_error.bool)
                throw new HttpException(posible_error.message, posible_error.status)

            const totalEpisodes = episodeList.length
            const totalPages = Math.ceil(totalEpisodes / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'episode/get_by_category/' + page
            }
            return {
                data: episodes,
                meta: {
                    totalItems: totalEpisodes,
                    totalPages: totalPages,
                    currentPage: page-1,
                    perPage: 5,
                    nextPage: nextPage
                }
            }
        }catch(error){
            throw error
        }
    } 
}
