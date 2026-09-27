import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bug } from 'database';
import { AppConfigService } from '../app-config/app-config.service.js';

@Injectable()
export class BugsService {
  constructor(
    @InjectRepository(Bug)
    private bugsRepository: Repository<Bug>,
    private configService: AppConfigService
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

  async pushToGithub(id: string) {
    const bug = await this.findOne(id);
    const enabled = await this.configService.get('github_enabled');
    
    // Gunakan token dari config DB, jika kosong ambil dari .env
    const token = await this.configService.get('github_token') || process.env.GITHUB_QA_TRACK_TOKEN;
    const repo = await this.configService.get('github_repo');

    if (enabled !== 'true' && !process.env.GITHUB_QA_TRACK_TOKEN) {
      throw new HttpException('GitHub integration is disabled', HttpStatus.BAD_REQUEST);
    }

    if (!token || !repo) {
      throw new HttpException('GitHub token or repo not configured. Please set them in Settings -> Integrations.', HttpStatus.BAD_REQUEST);
    }

    const title = `[BUG] ${bug.title}`;
    const body = `**Severity:** ${bug.severity}\n**Status:** ${bug.status}\n\n**Description:**\n${bug.description || 'No description'}`;

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'QATrack-App'
        },
        body: JSON.stringify({ title, body, labels: ['bug'] })
      });

      if (!res.ok) {
        const errData = await res.text();
        throw new Error(`GitHub API error: ${errData}`);
      }

      const data = await res.json();
      return { success: true, url: data.html_url };
    } catch (e: any) {
      console.error(e);
      throw new HttpException(e.message || 'Failed to push to GitHub', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
