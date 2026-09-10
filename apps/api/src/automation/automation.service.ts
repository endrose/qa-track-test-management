import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationRun } from 'database';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';
import { BugsService } from '../bugs/bugs.service.js';
import { TestCasesService } from '../test-cases/test-cases.service.js';

const execAsync = promisify(exec);

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(AutomationRun)
    private automationRepository: Repository<AutomationRun>,
    private testCasesService: TestCasesService,
    private bugsService: BugsService,
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

    // Generate Allure Report
    if (framework === 'Playwright') {
      try {
        const cwd = path.resolve(process.cwd(), '../../automation/playwright');
        await execAsync('npx allure generate ./allure-results --clean', { cwd });
      } catch (err) {
        console.error('Failed to generate allure report', err);
      }
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
  async executeTestCase(testCaseId: string) {
    // 1. Ambil data test case
    const testCase = await this.testCasesService.findOne(testCaseId);
    
    if (testCase.automationType === 'none') {
      throw new Error('Test case is not automated');
    }

    const framework = testCase.automationTool || 'playwright';
    const workspacePath = framework === 'cypress' ? 'cypress' : 'playwright';
    const cwd = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
    
    let command = 'npm run test';
    
    // Jika type adalah script, jalankan script yang spesifik
    if (testCase.automationType === 'script' && testCase.automationScript) {
      if (framework === 'playwright') {
        command = `npx playwright test ${testCase.automationScript}`;
      } else if (framework === 'cypress') {
        command = `npx cypress run --spec "cypress/e2e/${testCase.automationScript}"`;
      }
    } 
    // Jika data-driven, lemparkan config ke generic script
    else if (testCase.automationType === 'data-driven' && testCase.automationConfig) {
      if (framework === 'playwright') {
        command = `npx playwright test tests/generic-api.spec.ts`;
      }
    }

    let status = 'Failed';
    let logOutput = '';
    
    try {
      const allureResultsDir = testCase.project?.id ? `./allure-results/${testCase.project.id}` : './allure-results';
      const env = { 
        ...process.env, 
        TEST_CASE_CONFIG: JSON.stringify(testCase.automationConfig || {}),
        ALLURE_RESULTS_DIR: allureResultsDir
      };
      
      const { stdout, stderr } = await execAsync(command, { cwd, env });
      logOutput = stdout + '\n' + stderr;
      status = 'Passed';
    } catch (error: any) {
      logOutput = (error.stdout || '') + '\n' + (error.stderr || '') + '\n' + error.message;
      status = 'Failed';
      
      // Auto Bug Creation on Failure
      try {
        await this.bugsService.create({
          title: `[Auto Bug] Failed Test Case: ${testCase.title}`,
          description: `This bug was automatically generated because the automated test case failed.\n\n### Error Log\n\`\`\`\n${logOutput.substring(0, 1000)}...\n\`\`\``,
          status: 'Open',
          severity: 'Major',
          project: testCase.project,
          testCase: testCase as any,
        });
      } catch (e) {
        console.error('Failed to auto-create bug:', e);
      }
    }
    
    // Update status manual test case
    await this.testCasesService.update(testCaseId, { status });

    // Generate Allure Report and clean up project dir
    if (framework === 'playwright') {
      try {
        const allureResultsDir = testCase.project?.id ? `./allure-results/${testCase.project.id}` : './allure-results';
        const allureReportDir = testCase.project?.id ? `./allure-report/${testCase.project.id}` : './allure-report';
        await execAsync(`npx allure generate ${allureResultsDir} -o ${allureReportDir} --clean`, { cwd });
      } catch (err) {
        console.error('Failed to generate allure report', err);
      }
    }
    
    // Save the run logic (to be used by reports later)
    await this.create({
      suiteName: testCase.title,
      status,
      passed: status === 'Passed' ? 1 : 0,
      failed: status === 'Failed' ? 1 : 0,
      framework,
      log: logOutput,
      project: testCase.project,
    });

    return { status, log: logOutput };
  }
}
