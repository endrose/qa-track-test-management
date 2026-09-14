import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestReport, TestCase } from 'database';

@Injectable()
export class TestReportsService {
  constructor(
    @InjectRepository(TestReport)
    private testReportsRepository: Repository<TestReport>,
    @InjectRepository(TestCase)
    private testCasesRepository: Repository<TestCase>,
  ) {}

  findAll() {
    return this.testReportsRepository.find({ relations: { project: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const report = await this.testReportsRepository.findOne({ where: { id }, relations: { project: true } });
    if (!report) throw new NotFoundException('TestReport not found');
    return report;
  }

  create(data: Partial<TestReport>) {
    const report = this.testReportsRepository.create(data);
    return this.testReportsRepository.save(report);
  }

  async generateReport(name: string, projectId?: string) {
    // Get test cases (optionally filtered by project)
    const where: any = {};
    if (projectId) {
      where.project = { id: projectId };
    }

    const testCases = await this.testCasesRepository.find({
      where: Object.keys(where).length ? where : undefined,
      relations: { project: true },
    });

    // Count statuses based on test case status field
    const passed = testCases.filter(tc => tc.status === 'Passed').length;
    const failed = testCases.filter(tc => tc.status === 'Failed').length;
    const draft = testCases.filter(tc => tc.status === 'Draft').length;
    const ready = testCases.filter(tc => tc.status === 'Ready').length;
    const total = testCases.length;

    const summary = `${total} test case(s) — ${passed} Passed, ${failed} Failed, ${ready} Ready, ${draft} Draft.`;

    const reportData: Partial<TestReport> = {
      name,
      summary,
      passed,
      failed,
      skipped: ready + draft,
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
