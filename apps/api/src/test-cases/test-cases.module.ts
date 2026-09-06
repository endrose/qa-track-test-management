import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from 'database';
import { TestCasesController } from './test-cases.controller.js';
import { TestCasesService } from './test-cases.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TestCase])],
  controllers: [TestCasesController],
  providers: [TestCasesService],
})
export class TestCasesModule {}
