import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';

@Module({
  providers: [EpisodeService],
  controllers: [EpisodeController],
  exports:[EpisodeService]
})
export class EpisodeModule {}
