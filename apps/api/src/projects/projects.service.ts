import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'database';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  findAll() {
    return this.projectsRepository.find();
  }

  async findOne(id: string) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(data: Partial<Project>) {
    const project = this.projectsRepository.create(data);
    return this.projectsRepository.save(project);
  }

  async update(id: string, data: Partial<Project>) {
    const project = await this.findOne(id);
    this.projectsRepository.merge(project, data);
    return this.projectsRepository.save(project);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    return this.projectsRepository.remove(project);
  }
}
