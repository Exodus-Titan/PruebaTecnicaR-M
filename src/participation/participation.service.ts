import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Character } from '@prisma/client';
import { isNumber } from 'class-validator';
import { CharacterService } from 'src/character/character.service';
import { UpdateCharacterDto } from 'src/character/Dto/updateCharacterDto';
import { UpdateEpisodeDto } from 'src/episode/Dto/updateEpisodeDto';
import { EpisodeService } from 'src/episode/episode.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParticipationService {
    constructor(private db: PrismaService, private characterService: CharacterService, private episodeService: EpisodeService, private configService: ConfigService){}

    async episode_check(episodeId: number){
        try{
            const episode = await this.db.episode.findUnique({where: {id: episodeId}})
            if (!episodeId || !episode){
                throw new HttpException('Invalid episode', HttpStatus.FORBIDDEN)
            }
        }catch(error){
            throw error
        }
    }

    characters_not_empty(characters: Character[]){
        if (!characters || characters.length === 0 || characters === null)
            throw new HttpException('There are no characters', HttpStatus.NOT_FOUND)
    }

    async get_characters_by_episode(episodeId: number, page: number){
        try{
            let nextPage;
            this.episode_check(episodeId)
            const charactersList = await this.db.character.findMany({where: {episodesIds: {has: episodeId}}})
            const characters = await this.db.character.findMany({where: {episodesIds: {has: episodeId}}, skip: (page -1) * 5, take: 5 })
            this.characters_not_empty(characters)
            const totalCharacters = charactersList.length
            const totalPages = Math.ceil(totalCharacters / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'participation/characters_by_episode/' + page
            }
            return {
                data: characters,
                meta: {
                    totalItems: totalCharacters,
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

    async get_characters_by_episode_and_character_status(episodeId: number, status: string, page: number){
        try{
            let nextPage;
            this.episode_check(episodeId)
            const statusId = (await this.db.status.findFirst({where: {AND: [{status: status}, {type: 'Character'}]}})).statusId
            const characterList = await this.db.character.findMany({where: { AND: [{episodesIds: {has: episodeId}}, {statusId: statusId}]}})
            const characters = await this.db.character.findMany({where: { AND: [{episodesIds: {has: episodeId}}, {statusId: statusId}]}, skip: (page -1) * 5, take: 5 })
            this.characters_not_empty(characters)
            const totalCharacters = characterList.length
            const totalPages = Math.ceil(totalCharacters / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'participation/characters_by_episode_and_character_status/' + page
            }
            return {
                data: characters,
                meta: {
                    totalItems: totalCharacters,
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

    async get_characters_by_episode_and_episode_status(episodeId: number, status: string, page: number){
        try{
            let nextPage;
            this.episode_check(episodeId)
            const statusId = (await this.db.status.findFirst({where: {AND: [{status: status}, {type: 'Episode'}]}})).statusId
            if(!statusId)
                throw new HttpException('Status not found', HttpStatus.NOT_FOUND)
            const characterList = (await this.db.character.findMany({where: {episodesIds: {has: episodeId}}}))
            const characters = (await this.db.episode.findFirst({where:{AND: [{id:episodeId}, {statusId: statusId}]}, skip: (page -1) * 5, take: 5 })).charactersIds
            const totalCharacters = characterList.length
            const totalPages = Math.ceil(totalCharacters / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'participation/characters_by_season_and_episode_status/' + page
            }
            return {
                data: characters,
                meta: {
                    totalItems: totalCharacters,
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

    async check_season(seasonString: string){
        try{
            const season = await this.db.episodeCategory.findFirst({where: {subcategory: seasonString}})
            if (!seasonString || !season){
                throw new HttpException('Invalid season', HttpStatus.FORBIDDEN)
            }
        }catch(error){
            throw error
        }
    }

    async get_characters_by_season_and_character_status(season: string, status: string){
        try{
            this.check_season(season)
            let characters = []
            const seasonObject = (await this.db.episodeCategory.findFirst({where: {subcategory: season}}))
            if (!seasonObject)
                throw new HttpException('Season not found', HttpStatus.NOT_FOUND)
            const statusId = (await this.db.status.findFirst({where: {AND: [{status: status}, {type: 'Character'}]}})).statusId
            if(!statusId)
                throw new HttpException('Status not found', HttpStatus.NOT_FOUND)
            const episodes = await this.db.episode.findMany({where: {categoryId: seasonObject.epCategoryId}})
            for( const episode of episodes){
                for( const characterId of episode.charactersIds){
                    characters.push(await this.db.character.findFirst({where:{AND:[{id: characterId}, {statusId: statusId}]}}))
                }
            }
            this.characters_not_empty(characters)
            return characters
        }catch(error){
            throw error
        }
    }

    async get_characters_by_season_and_episode_status(season: string, status: string){
        try{
            this.check_season(season)
            let characters =[]
            const seasonObject = (await this.db.episodeCategory.findFirst({where: {subcategory: season}}))
            if (!seasonObject)
                throw new HttpException('Season not found', HttpStatus.NOT_FOUND)
            const statusId = (await this.db.status.findFirst({where: {AND: [{status: status}, {type: 'Episode'}]}})).statusId
            if(!statusId)
                throw new HttpException('Status not found', HttpStatus.NOT_FOUND)
            const episodes = await this.db.episode.findMany({where: {AND: [{categoryId: seasonObject.epCategoryId}, {statusId: statusId}]}})
            for( const episode of episodes){
                for( const characterId of episode.charactersIds){
                    characters.push(await this.db.character.findFirst({where:{id: characterId}}))
                }
            }
            this.characters_not_empty(characters)
            return characters
        }catch(error){
            throw error
        }
    }

    async delete_character_from_episode(characterId: number, episodeId: number){
        try{

        const character = (await this.db.character.findUnique({where: {id: characterId}}))
        const episode = (await this.db.episode.findUnique({where: {id: episodeId}}))

        if (!character)
            throw new HttpException('Invalid character', HttpStatus.FORBIDDEN)
        else if (!episode)
            throw new HttpException('Invalid episode', HttpStatus.FORBIDDEN)

        const characterDto = new UpdateCharacterDto();
        characterDto.name = character.name
        characterDto.species = (await this.db.characterCategory.findFirst({where: {charCategoryId: character.categoryId}})).subcategory,
        characterDto.origin = character.origin  
        characterDto.location = character.location
        characterDto.gender = character.gender
        characterDto.state = character.state
        characterDto.episodes = character.episodesIds.filter(id => id !== episodeId)
        

        const episodeDto = new UpdateEpisodeDto()
        episodeDto.name = episode.name,
        episodeDto.air_date = episode.air_date,
        episodeDto.episode = episode.episode,
        episodeDto.duration = episode.duration,
        episodeDto.characters = episode.charactersIds.filter(id => id !== characterId)
        
        console.log(characterDto)
        this.characterService.update_character(characterDto, characterId)
        this.episodeService.update_episode(episodeDto, episodeId)

        return 'Character deleted from episode'


        }catch(error){
            throw error
        }

    }
}
