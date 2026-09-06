import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationRun } from 'database';

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(AutomationRun)
    private automationRepository: Repository<AutomationRun>,
  ) {}

  findAll() {
    return this.automationRepository.find();
  }

  async findOne(id: string) {
    const run = await this.automationRepository.findOne({ where: { id } });
    if (!run) throw new NotFoundException('AutomationRun not found');
    return run;
  }

  create(data: Partial<AutomationRun>) {
    const run = this.automationRepository.create(data);
    return this.automationRepository.save(run);
  }

  async update(id: string, data: Partial<AutomationRun>) {
    const run = await this.findOne(id);
    this.automationRepository.merge(run, data);
    return this.automationRepository.save(run);
  }

  async remove(id: string) {
    const run = await this.findOne(id);
    return this.automationRepository.remove(run);
  }
}
