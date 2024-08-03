import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { characterDto } from './Dto/characterDto';
import { UpdateCharacterDto } from './Dto/updateCharacterDto';

@Controller('character')
export class CharacterController {
    constructor(private characterService: CharacterService){}

    @Post('create')
    create_character(@Body() dto: characterDto){
        return this.characterService.create_character(dto)
    }

    @Patch('update/:id')
    update_character(@Param('id') characterId: string, @Body() dto: UpdateCharacterDto){
        return this.characterService.update_character(dto, Number(characterId))
    }

    @Patch('change_status/:id') //Suspend or Activate characters
    change_status(@Param('id') characterId: string, @Body() status: string){
        return this.characterService.change_status(Number(characterId), status)
    }

    @Get('get_all/:page')
    get_all_characters(@Param('page') page: number){
        return this.characterService.get_all_characters(Number(page))
    }

    @Get('get_by_status/:page')
    get_characters_by_status(@Param('page') page: number, @Body() status: string){
        return this.characterService.get_by_status(status, Number(page))
    }

    @Get('get_by_category/:page')
    get_characters_by_category(@Param('page') page: number, @Body() category: string){
        return this.characterService.get_by_category(category, Number(page))
    }
}
