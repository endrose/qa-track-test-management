import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationRun } from 'database';
import { AutomationController } from './automation.controller.js';
import { AutomationService } from './automation.service.js';
import { TestCasesModule } from '../test-cases/test-cases.module.js';
import { BugsModule } from '../bugs/bugs.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutomationRun]),
    TestCasesModule,
    BugsModule,
  ],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
