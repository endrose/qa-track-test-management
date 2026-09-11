import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requirement } from 'database';

@Injectable()
export class RequirementsService {
  constructor(
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>,
  ) {}

  findAll() {
    return this.requirementsRepository.find({ relations: { project: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const requirement = await this.requirementsRepository.findOne({ where: { id }, relations: { project: true } });
    if (!requirement) throw new NotFoundException('Requirement not found');
    return requirement;
  }

  create(data: Partial<Requirement>) {
    const requirement = this.requirementsRepository.create(data);
    return this.requirementsRepository.save(requirement);
  }

  async update(id: string, data: Partial<Requirement>) {
    const requirement = await this.findOne(id);
    this.requirementsRepository.merge(requirement, data);
    return this.requirementsRepository.save(requirement);
  }

  async remove(id: string) {
    const requirement = await this.findOne(id);
    return this.requirementsRepository.remove(requirement);
  }
}
