import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestExecution } from 'database';
import { TestExecutionsController } from './test-executions.controller.js';
import { TestExecutionsService } from './test-executions.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TestExecution])],
  controllers: [TestExecutionsController],
  providers: [TestExecutionsService],
})
export class TestExecutionsModule {}
