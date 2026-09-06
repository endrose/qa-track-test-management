import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationRun } from 'database';
import { AutomationController } from './automation.controller.js';
import { AutomationService } from './automation.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AutomationRun])],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
