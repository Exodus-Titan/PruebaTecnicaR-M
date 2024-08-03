import { Global, Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { HttpModule } from '@nestjs/axios';
import { ProviderController } from './provider.controller';
import { CharacterService } from 'src/character/character.service';
import { EpisodeService } from 'src/episode/episode.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Global()
@Module({
  providers: [ProviderService, CharacterService, EpisodeService, PrismaService],
  imports: [HttpModule],
  exports: [ProviderService],
  controllers: [ProviderController],
})
export class ProviderModule {}
