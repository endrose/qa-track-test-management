import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from 'database';
import { BugsController } from './bugs.controller.js';
import { BugsService } from './bugs.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Bug])],
  controllers: [BugsController],
  providers: [BugsService],
  exports: [BugsService],
})
export class BugsModule {}
