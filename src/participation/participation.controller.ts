import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { SearchDto } from './Dto/searchDto';
import { SeasonSearchDto } from './Dto/seasonSearchDto';
import { IdDto } from './Dto/idDto';

@Controller('participation')
export class ParticipationController {
    constructor(private participationService: ParticipationService){}

    @Get('characters_by_episode/:page')
    get_characters_by_episode(@Param('page') page: number, @Body() episodeId: number){
        const transcribedId: number = Number(JSON.parse(JSON.stringify(episodeId)).episodeId)
        return this.participationService.get_characters_by_episode(transcribedId, Number(page))
    }

    @Get('characters_by_episode_and_character_status/:page')
    get_characters_by_episode_and_character_status(@Param('page') page: number, @Body() searchDto: SearchDto){
        return this.participationService.get_characters_by_episode_and_character_status(searchDto.id, searchDto.status, Number(page)) //id is EpisodeID
    }

    @Get('get_characters_by_episode_and_episode_status/:page')
    get_characters_by_episode_and_episode_status(@Param('page') page: number, @Body() searchDto: SearchDto){
        return this.participationService.get_characters_by_episode_and_episode_status(searchDto.id, searchDto.status, Number(page)) //id is EpisodeID
    }

    @Get('characters_by_season_and_character_status/')
    get_characters_by_season_and_character_status(@Body() seasonSearchDto: SeasonSearchDto){
        return this.participationService.get_characters_by_season_and_character_status(seasonSearchDto.season, seasonSearchDto.status) //No lo pude paginar
    }

    @Get('get_characters_by_season_and_episode_status/')
    get_characters_by_season_and_episode_status(@Body() seasonSearchDto: SeasonSearchDto){
        return this.participationService.get_characters_by_season_and_episode_status(seasonSearchDto.season, seasonSearchDto.status) //No lo pude paginar
    }

    @Patch('delete_character_from_episode')
    delete_character_from_episode(@Body() Dto: IdDto){
        return this.participationService.delete_character_from_episode(Dto.charId, Dto.epId)
    }

}
