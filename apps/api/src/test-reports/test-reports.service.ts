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
