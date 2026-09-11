import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bug } from 'database';

@Injectable()
export class BugsService {
  constructor(
    @InjectRepository(Bug)
    private bugsRepository: Repository<Bug>,
  ) {}

  findAll() {
    return this.bugsRepository.find({ relations: { project: true, testCase: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const bug = await this.bugsRepository.findOne({ where: { id }, relations: { project: true, testCase: true } });
    if (!bug) throw new NotFoundException('Bug not found');
    return bug;
  }

  create(data: Partial<Bug>) {
    const bug = this.bugsRepository.create(data);
    return this.bugsRepository.save(bug);
  }

  async update(id: string, data: Partial<Bug>) {
    const bug = await this.findOne(id);
    this.bugsRepository.merge(bug, data);
    return this.bugsRepository.save(bug);
  }

  async remove(id: string) {
    const bug = await this.findOne(id);
    return this.bugsRepository.remove(bug);
  }
}
