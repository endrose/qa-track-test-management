import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestReport } from 'database';

@Injectable()
export class TestReportsService {
  constructor(
    @InjectRepository(TestReport)
    private testReportsRepository: Repository<TestReport>,
  ) {}

  findAll() {
    return this.testReportsRepository.find();
  }

  async findOne(id: string) {
    const report = await this.testReportsRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('TestReport not found');
    return report;
  }

  create(data: Partial<TestReport>) {
    const report = this.testReportsRepository.create(data);
    return this.testReportsRepository.save(report);
  }

  async generateReport(name: string) {
    // Generate a snapshot report by summing up AutomationRun metrics
    // In a real scenario, this would aggregate TestExecution and AutomationRun for a specific timeframe/project
    const runs = await this.testReportsRepository.manager.query(`
      SELECT 
        SUM(passed) as total_passed, 
        SUM(failed) as total_failed 
      FROM automation_runs
    `);

    const passed = parseInt(runs[0]?.total_passed || '0', 10);
    const failed = parseInt(runs[0]?.total_failed || '0', 10);
    const summary = `Generated snapshot for ${passed + failed} automation tests.`;

    const report = this.testReportsRepository.create({
      name,
      summary,
      passed,
      failed,
      skipped: 0
    });
    return this.testReportsRepository.save(report);
  }

  async update(id: string, data: Partial<TestReport>) {
    const report = await this.findOne(id);
    this.testReportsRepository.merge(report, data);
    return this.testReportsRepository.save(report);
  }

  async remove(id: string) {
    const report = await this.findOne(id);
    return this.testReportsRepository.remove(report);
  }
}
