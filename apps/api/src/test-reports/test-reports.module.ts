import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestReport } from 'database';
import { TestReportsController } from './test-reports.controller.js';
import { TestReportsService } from './test-reports.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TestReport])],
  controllers: [TestReportsController],
  providers: [TestReportsService],
})
export class TestReportsModule {}
