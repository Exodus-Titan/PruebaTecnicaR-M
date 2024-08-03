import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeDto } from './Dto/episodeDto';
import { UpdateEpisodeDto } from './Dto/updateEpisodeDto';

@Controller('episode')
export class EpisodeController {
    constructor(private episodeService: EpisodeService){}

    @Post('create')
    create_episode(@Body() dto: EpisodeDto){
        return this.episodeService.create_episode(dto)
    }

    @Patch('update/:id')
    update_episode(@Param('id') episodeId: string, @Body() dto: UpdateEpisodeDto){
        return this.episodeService.update_episode(dto, Number(episodeId))
    }

    @Patch('change_status/:id') //Suspend or Activate episodes
    change_status(@Param('id') episodeId: string, @Body() status: string){
        return this.episodeService.change_status(Number(episodeId), status)
    }

    @Get('get_all/:page')
    get_all_episodes(@Param('page') page: number){
        return this.episodeService.get_all_episodes(Number(page))
    }

    @Get('get_by_status/:page')
    get_episodes_by_status(@Param('page') page: number, @Body() status: string){
        return this.episodeService.get_by_status(status, Number(page))
    }

    @Get('get_by_category/:page')
    get_episodes_by_category(@Param('page') page: number, @Body() category: string){
        return this.episodeService.get_by_category(category, Number(page))
    }

}
