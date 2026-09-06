import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationRun } from 'database';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(AutomationRun)
    private automationRepository: Repository<AutomationRun>,
  ) {}

  findAll() {
    return this.automationRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const run = await this.automationRepository.findOne({ where: { id } });
    if (!run) throw new NotFoundException('AutomationRun not found');
    return run;
  }

  async create(data: Partial<AutomationRun>) {
    const run = this.automationRepository.create(data);
    const savedRun = await this.automationRepository.save(run);
    
    // Only fire execution if no results were provided externally
    const hasExternalResults = data.passed !== undefined || data.failed !== undefined;
    if (!hasExternalResults) {
      this.executeRun(savedRun.id, savedRun.framework || 'Playwright').catch(console.error);
    }
    
    return savedRun;
  }

  async executeRun(id: string, framework: string) {
    let logOutput = '';
    let passed = 0;
    let failed = 0;
    let status = 'Failed';

    try {
      const workspacePath = framework === 'Cypress' ? 'cypress' : 'playwright';
      const cwd = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
      
      const { stdout, stderr } = await execAsync('npm run test', { cwd });
      logOutput = stdout + '\n' + stderr;
      status = 'Passed';
      
      // Try to parse JSON report
      try {
        const resultsFile = framework === 'Cypress' 
          ? path.join(cwd, 'test-results.json')
          : path.join(cwd, 'test-results.json');
          
        const resultsData = await fs.readFile(resultsFile, 'utf-8');
        const results = JSON.parse(resultsData);
        
        if (framework === 'Cypress') {
          passed = results.stats?.passes || 1;
          failed = results.stats?.failures || 0;
        } else {
          // Playwright simple parsing
          passed = results.suites?.length || 1;
          failed = results.errors?.length || 0;
        }
      } catch (e) {
        // Fallback if parsing fails
        passed = status === 'Passed' ? 1 : 0;
      }
    } catch (error: any) {
      logOutput = (error.stdout || '') + '\n' + (error.stderr || '') + '\n' + error.message;
      status = 'Failed';
      failed = 1;
    }

    await this.update(id, { status, log: logOutput, passed, failed });
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
