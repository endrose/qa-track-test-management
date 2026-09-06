import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requirement } from 'database';
import { RequirementsController } from './requirements.controller.js';
import { RequirementsService } from './requirements.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Requirement])],
  controllers: [RequirementsController],
  providers: [RequirementsService],
})
export class RequirementsModule {}
