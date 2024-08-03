import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CharacterModule } from './character/character.module';
import { EpisodeModule } from './episode/episode.module';
import { ParticipationModule } from './participation/participation.module';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [PrismaModule, CharacterModule, EpisodeModule, ParticipationModule, ConfigModule.forRoot({isGlobal: true}), ProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
