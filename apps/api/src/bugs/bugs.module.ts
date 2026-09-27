import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from 'database';
import { BugsController } from './bugs.controller.js';
import { BugsService } from './bugs.service.js';
import { AppConfigModule } from '../app-config/app-config.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Bug]), AppConfigModule],
  controllers: [BugsController],
  providers: [BugsService],
  exports: [BugsService],
})
export class BugsModule {}
