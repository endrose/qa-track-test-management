import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestReport, TestCase } from 'database';
import { TestReportsController } from './test-reports.controller.js';
import { TestReportsService } from './test-reports.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TestReport, TestCase])],
  controllers: [TestReportsController],
  providers: [TestReportsService],
})
export class TestReportsModule {}
