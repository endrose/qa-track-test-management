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
    return this.testReportsRepository.find({ relations: ['project'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const report = await this.testReportsRepository.findOne({ where: { id }, relations: ['project'] });
    if (!report) throw new NotFoundException('TestReport not found');
    return report;
  }

  create(data: Partial<TestReport>) {
    const report = this.testReportsRepository.create(data);
    return this.testReportsRepository.save(report);
  }

  async generateReport(name: string, projectId?: string) {
    let query = `
      SELECT 
        SUM(passed) as total_passed, 
        SUM(failed) as total_failed 
      FROM automation_runs
    `;
    let params: any[] = [];

    if (projectId) {
      query += ` WHERE "projectId" = $1`;
      params.push(projectId);
    }

    const runs = await this.testReportsRepository.manager.query(query, params);

    const passed = parseInt(runs[0]?.total_passed || '0', 10);
    const failed = parseInt(runs[0]?.total_failed || '0', 10);
    const summary = `Generated snapshot for ${passed + failed} automation tests.`;

    const reportData: Partial<TestReport> = {
      name,
      summary,
      passed,
      failed,
      skipped: 0
    };

    if (projectId) {
      (reportData as any).project = { id: projectId };
    }

    const report = this.testReportsRepository.create(reportData);
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
