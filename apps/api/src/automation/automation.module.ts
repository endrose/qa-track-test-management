import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationRun, TestCase, Project } from 'database';
import { AutomationController } from './automation.controller.js';
import { AutomationService } from './automation.service.js';
import { ProjectsModule } from '../projects/projects.module.js';
import { TestCasesModule } from '../test-cases/test-cases.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { BugsModule } from '../bugs/bugs.module.js';
import { AppConfigModule } from '../app-config/app-config.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutomationRun, TestCase, Project]),
    ProjectsModule,
    TestCasesModule,
    NotificationsModule,
    BugsModule,
    AppConfigModule,
  ],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
