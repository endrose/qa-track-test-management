import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProjectsModule } from './projects/projects.module.js';
import { RequirementsModule } from './requirements/requirements.module.js';
import { TestExecutionsModule } from './test-executions/test-executions.module.js';
import { AutomationModule } from './automation/automation.module.js';
import { BugsModule } from './bugs/bugs.module.js';
import { TestCasesModule } from './test-cases/test-cases.module.js';
import { TestReportsModule } from './test-reports/test-reports.module.js';
import { AuthModule } from './auth/auth.module.js';
import { Project, Requirement, TestExecution, AutomationRun, Bug, TestCase, TestReport, User } from 'database';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:postgres123@localhost:5432/qa-track-test-management',
      entities: [Project, Requirement, TestExecution, AutomationRun, Bug, TestCase, TestReport, User],
      synchronize: true, 
    }),
    ProjectsModule,
    RequirementsModule,
    TestExecutionsModule,
    AutomationModule,
    BugsModule,
    TestCasesModule,
    TestReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
