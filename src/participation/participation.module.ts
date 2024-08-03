import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { EpisodeService } from 'src/episode/episode.service';
import { CharacterService } from 'src/character/character.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ParticipationService, PrismaService, CharacterService, EpisodeService],
  controllers: [ParticipationController],
  exports:[ParticipationService]
})
export class ParticipationModule {}
