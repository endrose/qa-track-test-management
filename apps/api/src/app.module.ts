import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Project, Requirement, TestExecution, AutomationRun, Bug, TestCase, TestReport, User],
        synchronize: true, 
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', '..', 'automation', 'playwright', 'allure-report'),
      serveRoot: '/allure',
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
