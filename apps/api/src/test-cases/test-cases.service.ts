import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestCase } from 'database';

@Injectable()
export class TestCasesService {
  constructor(
    @InjectRepository(TestCase)
    private testCasesRepository: Repository<TestCase>,
  ) {}

  findAll() {
    return this.testCasesRepository.find();
  }

  async findOne(id: string) {
    const testCase = await this.testCasesRepository.findOne({ where: { id } });
    if (!testCase) throw new NotFoundException('TestCase not found');
    return testCase;
  }

  create(data: Partial<TestCase>) {
    const testCase = this.testCasesRepository.create(data);
    return this.testCasesRepository.save(testCase);
  }

  async update(id: string, data: Partial<TestCase>) {
    const testCase = await this.findOne(id);
    this.testCasesRepository.merge(testCase, data);
    return this.testCasesRepository.save(testCase);
  }

  async remove(id: string) {
    const testCase = await this.findOne(id);
    return this.testCasesRepository.remove(testCase);
  }
}
