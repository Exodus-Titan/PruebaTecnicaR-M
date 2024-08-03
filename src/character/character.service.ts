import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { characterDto } from './Dto/characterDto';
import { UpdateCharacterDto } from './Dto/updateCharacterDto';
import { Character, CharacterCategory, status } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';


@Injectable()
export class CharacterService {
    constructor(private db: PrismaService, private configService: ConfigService){}

    categorysection(species: string){
        if (species === 'Human'){
            return 'Human'
        }else{
            return 'Alien'
        }
    }

    async duplicate_check(characterId: number, characterName: string, characterSpecies: CharacterCategory, isCreating: boolean){
        try{
            const character = await this.db.character.findFirst({where: {id: characterId}})
            if (!characterSpecies)
                throw new HttpException('Invalid species', HttpStatus.FORBIDDEN)
            else if (character && isCreating) //Si se llama desde la funcion de crear si el personaje ya existe dara un error
                throw new HttpException('The character already exists', HttpStatus.CONFLICT)
            else if (!character && !isCreating) //Si se llama desde la funcion de actualizar si el personaje no existe dara un error
                throw new HttpException('The character doesnt exist', HttpStatus.NOT_FOUND)
            const characterNameExists = await this.db.character.findFirst({where: {AND: [{name: characterName}, {categoryId: characterSpecies.charCategoryId}]}})
            if ( characterNameExists && (characterNameExists.id !== characterId))
                throw new HttpException('The character name already exists in that species', HttpStatus.CONFLICT)

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


    async create_character(Dto: characterDto){
        try{
            const category = await this.db.characterCategory.findFirst({where: {subcategory: this.categorysection(Dto.species)}})

            const posible_error = this.duplicate_check(Dto.id, Dto.name, category, true);
            if((await posible_error).bool)
                throw new HttpException((await posible_error).message, (await posible_error).status)
            
            const character =  this.db.character.create({
                data: {
                    id: Dto.id,
                    name: Dto.name,
                    statusId: (await this.db.status.findFirst({where: {AND: [ {status: 'Active'} ,{type:'Character'}]}})).statusId,
                    categoryId: category.charCategoryId,
                    origin: Dto.origin,
                    location: Dto.location,
                    gender: Dto.gender,
                    state: Dto.state,
                    episodesIds: Dto.episodes
                }
        })

            return character

        }catch(error){
            if (error instanceof HttpException && error.message === 'The character name already exists in that species')
                return 'Duplicated Character Skiped'
            throw error
        }
    }

    async update_character(Dto: UpdateCharacterDto, id: number){
        try{
            const category = await this.db.characterCategory.findFirst({where: {subcategory: this.categorysection(Dto.species)}})

            const posible_error = this.duplicate_check(id, Dto.name, category, false);
            if((await posible_error).bool){
                throw new HttpException((await posible_error).message, (await posible_error).status)
            }

            const character = await this.db.character.update({
                where:{
                    id:id,
                },
                data:{ 
                    name: Dto.name,
                    categoryId: (await this.db.characterCategory.findFirst({where: {subcategory: this.categorysection(Dto.species)}})).charCategoryId,
                    origin: Dto.origin,
                    location: Dto.location,
                    gender: Dto.gender,
                    state: Dto.state,
                    episodesIds: Dto.episodes
                }
            })

            return character
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
            const newStatus = await this.db.status.findFirst({where: { AND: [{status: statusString}, {type: 'Character'}]}})
            if (!newStatus || newStatus === null)
                throw new HttpException('The status doesnt exist', HttpStatus.NOT_FOUND)
            let character = await this.db.character.findFirst({where: {id:id}})
            if (!character)
                throw new HttpException('The character doesnt exist', HttpStatus.NOT_FOUND)
            else if (!this.check_status_change(character.statusId, newStatus)){
                return new HttpException('The character is already ' + statusString, HttpStatus.FORBIDDEN)}

            
            character = await this.db.character.update({
                where:{
                    id:id,
                },
                data:{
                    statusId: (await this.db.status.findFirst({where: { AND: [{status: statusString}, {type: 'Character'}]} })).statusId,
                }
            })
            
            return character
        }catch(error){
            throw error
        }
    }

    
    are_characters(characters: Character[]){
        try{
        if (!characters || characters.length === 0 || characters === null)
            throw new HttpException('There are no characters', HttpStatus.NOT_FOUND)
        return {bool: false}
        }catch(error){
            return {
                message: error.message,
                status: error.getStatus(),
                bool: true
            }
        }
    }

    async get_all_characters(page: number){
        try{
            let nextPage;
            const characterList = await this.db.character.findMany()
            const characters = await this.db.character.findMany({
                skip: (page -1) * 5,
                take: 5
            })
            const posible_error = this.are_characters(characters)
            if (posible_error.bool)
                throw new HttpException(posible_error.message, posible_error.status)
            const totalCharacters = characterList.length
            const totalPages = Math.ceil(totalCharacters / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'character/get_all/' + page
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

    async get_by_status(statusToSearch: string, page: number){
        try{
            let nextPage;
            const statusString: string = JSON.parse(JSON.stringify(statusToSearch)).status
            const status = (await this.db.status.findFirst({where: {AND: [{status: statusString}, {type: 'Character'}]}}))
            const characterList = await this.db.character.findMany({where: {statusId: status.statusId}})
            let characters = []
            if (status.type === 'Character'){
                characters = await this.db.character.findMany({where: {statusId: status.statusId}, skip: (page -1) * 5, take: 5})
            const posible_error = this.are_characters(characters)
            if (posible_error.bool)
                throw new HttpException(posible_error.message, posible_error.status)
            const totalCharacters = characterList.length
            const totalPages = Math.ceil(totalCharacters / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'character/get_by_status/' + page
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
            }else
                return new HttpException('That status is not related to a character', HttpStatus.FORBIDDEN)
        }catch(error){
            throw error
        }
    } 

    async get_by_category(categoryToSearch: string, page: number){
        try{
            let nextPage;
            const categoryString: string = JSON.parse(JSON.stringify(categoryToSearch)).category
            const category = (await this.db.characterCategory.findFirst({where: {subcategory: categoryString}}))
            console.log(category)
            if (!category || category === null)
                throw new HttpException('The category doesnt exist', HttpStatus.NOT_FOUND)
            const characterList = await this.db.character.findMany({where: {categoryId: category.charCategoryId}})
            const characters = await this.db.character.findMany({where: {categoryId: category.charCategoryId}, skip: (page -1) * 5, take: 5})
            const posible_error = this.are_characters(characters)
            if (posible_error.bool)
                throw new HttpException(posible_error.message, posible_error.status)
            const totalCharacters = characterList.length
            const totalPages = Math.ceil(totalCharacters / 5)
            if (page === totalPages)
                nextPage = 'This is the last page'
            else{
                page++
                nextPage = this.configService.get<string>('MAIN_URL') + 'character/get_by_category/' + page
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

}

