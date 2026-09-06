import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestExecution } from 'database';

@Injectable()
export class TestExecutionsService {
  constructor(
    @InjectRepository(TestExecution)
    private testExecutionsRepository: Repository<TestExecution>,
  ) {}

  findAll() {
    return this.testExecutionsRepository.find();
  }

  async findOne(id: string) {
    const execution = await this.testExecutionsRepository.findOne({ where: { id } });
    if (!execution) throw new NotFoundException('TestExecution not found');
    return execution;
  }

  create(data: Partial<TestExecution>) {
    const execution = this.testExecutionsRepository.create(data);
    return this.testExecutionsRepository.save(execution);
  }

  async update(id: string, data: Partial<TestExecution>) {
    const execution = await this.findOne(id);
    this.testExecutionsRepository.merge(execution, data);
    return this.testExecutionsRepository.save(execution);
  }

  async remove(id: string) {
    const execution = await this.findOne(id);
    return this.testExecutionsRepository.remove(execution);
  }
}
