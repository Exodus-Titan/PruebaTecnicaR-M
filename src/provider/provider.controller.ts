import { Body, Controller, Get } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
    constructor(private providerService: ProviderService){}

    @Get('fill_characters_database')
    get_all_characters(@Body() urlChars: string){
        const urlCharsString: string = JSON.parse(JSON.stringify(urlChars)).urlChars
        return this.providerService.fill_characters_database(urlCharsString)
    }

    @Get('fill_episodes_database')
    get_all_episodes(@Body() urlEps: string){
        const urlEpsString: string = JSON.parse(JSON.stringify(urlEps)).urlEps
        return this.providerService.fill_episodes_database(urlEpsString)
    }
}
