import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CharacterService } from 'src/character/character.service';
import { EpisodeService } from 'src/episode/episode.service';
import { characterDto } from 'src/character/Dto/characterDto';
import { EpisodeDto } from 'src/episode/Dto/episodeDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProviderService {
    constructor(private httpService: HttpService, private characterService: CharacterService, private episodeService: EpisodeService, private db: PrismaService){}

    async get_all_characters(url:string){
        try{
            const response = await firstValueFrom(this.httpService.get(url)) //'https://rickandmortyapi.com/api/character'
            if (response.status === 500)
                throw new HttpException('Internal Server Error', 500)
            else if (response.status === 404)
                throw new HttpException('Not Found', 404)
            return response.data
        }catch(error){
            throw error
        }
    }

    async get_all_episodes(url:string){
        try{
            const response = await firstValueFrom(this.httpService.get(url)) //'https://rickandmortyapi.com/api/episode'
            if (response.status === 500)
                throw new HttpException('Internal Server Error', 500)
            else if (response.status === 404)
                throw new HttpException('Not Found', 404)
            return response.data
        }catch(error){
            throw error
        }
    }

    async fill_characters_database(urlChars: string){
        try{
            const characters = await this.get_all_characters(urlChars)

            for (const character of characters.results){
                let episodesIds = []
                for (const episode of character.episode){
                    episodesIds.push(Number(episode.substring(40)))
                }
                
            
            const charDto = new characterDto(character.id, character.name, character.species, character.origin.name, character.location.name, character.gender, character.status, episodesIds)
            this.characterService.create_character(charDto)
            }

            
            if(characters.info.next !== null)
                this.fill_characters_database(characters.info.next)
            
        }catch(error){
            throw error
        }
    }

    async fill_episodes_database(urlEps: string){
        try{
            const episodes = await this.get_all_episodes(urlEps)
            
            for (const episode of episodes.results){
                let characterIds = []
                for (const character of episode.characters){
                    if(await this.db.character.findFirst({where:{id: Number(character.substring(42))}})) 
                        characterIds.push(Number(character.substring(42)))
                }
                
                const epDto = new EpisodeDto(episode.id, episode.name, episode.air_date, episode.episode, '22 Minutes', characterIds)
                this.episodeService.create_episode(epDto)
            }

            if(episodes.info.next !== null)
                this.fill_episodes_database(episodes.info.next)
            
        }catch(error){
            throw error
        }
    }
}
