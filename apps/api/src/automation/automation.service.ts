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
    const run = await this.automationRepository.findOne({ where: { id }, relations: { project: true } });
    if (!run) return;

    let logOutput = '';
    let passed = 0;
    let failed = 0;
    let status = 'Failed';
    let command = 'npm run test';
    const workspacePath = framework === 'Cypress' ? 'cypress/cypress' : 'playwright';
    const cwd = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
    const allureResultsDir = run.project?.id ? `./allure-results/${run.project.id}` : './allure-results';

    try {
      if (run.project) {
        const testCases = await this.testCasesService.findAll();
        const projectTestCases = testCases.filter(tc => tc.project?.id === run.project.id && tc.automationType === 'script' && tc.automationScript);
        
        if (projectTestCases.length > 0) {
          const scripts = Array.from(new Set(projectTestCases.map(tc => tc.automationScript)));
          if (framework === 'Playwright') {
            command = `npx playwright test ${scripts.join(' ')}`;
          } else if (framework === 'Cypress') {
            const specList = scripts.map(s => `cypress/e2e/${s}`).join(',');
            command = `npx cypress run --spec "${specList}"`;
          }
        } else {
          await this.update(id, { status: 'Failed', log: 'No automated test scripts found for this project.', passed: 0, failed: 0 });
          return;
        }
      }

      const env = { ...process.env, ALLURE_RESULTS_DIR: allureResultsDir };
      const { stdout, stderr } = await execAsync(command, { cwd, env });
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
        const allureReportDir = run.project?.id ? `./allure-report/${run.project.id}` : './allure-report';
        await execAsync(`npx allure generate ${allureResultsDir} -o ${allureReportDir} --clean`, { cwd });
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

  async scanUrl(url: string) {
    try {
      const scriptPath = path.resolve(process.cwd(), '../../automation/playwright/scripts/scanner.mjs');
      const cwd = path.resolve(process.cwd(), '../../automation/playwright');
      const { stdout } = await execAsync(`node ${scriptPath} "${url}"`, { cwd });
      
      const selectors = JSON.parse(stdout.trim());
      return selectors;
    } catch (e) {
      console.error('Scan URL failed:', e);
      return [];
    }
  }

  async getScripts(framework: string = 'playwright') {
    try {
      const workspacePath = framework === 'cypress' ? 'cypress/cypress/e2e' : 'playwright/tests';
      const testsDir = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
      const files = await fs.readdir(testsDir);
      return files.filter(f => f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.cy.ts') || f.endsWith('.cy.js'));
    } catch (e) {
      console.error('Failed to read scripts:', e);
      return [];
    }
  }

  async getScriptContent(filename: string, framework: string = 'playwright') {
    try {
      const workspacePath = framework === 'cypress' ? 'cypress/cypress/e2e' : 'playwright/tests';
      const testsDir = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
      const filePath = path.join(testsDir, filename);
      if (!filePath.startsWith(testsDir)) throw new Error('Invalid path');
      
      const content = await fs.readFile(filePath, 'utf-8');
      return { filename, content };
    } catch (e) {
      console.error('Failed to read script content:', e);
      throw new Error('Failed to read file');
    }
  }

  async updateScript(filename: string, content: string, framework: string = 'playwright') {
    try {
      const workspacePath = framework === 'cypress' ? 'cypress/cypress/e2e' : 'playwright/tests';
      const testsDir = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
      const filePath = path.join(testsDir, filename);
      if (!filePath.startsWith(testsDir)) throw new Error('Invalid path');
      
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (e) {
      console.error('Failed to update script:', e);
      throw new Error('Failed to update file');
    }
  }

  async deleteScript(filename: string, framework: string = 'playwright') {
    try {
      const workspacePath = framework === 'cypress' ? 'cypress/cypress/e2e' : 'playwright/tests';
      const testsDir = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
      const filePath = path.join(testsDir, filename);
      
      if (!filePath.startsWith(testsDir)) throw new Error('Invalid path');
      
      await fs.unlink(filePath);
      return { success: true };
    } catch (e) {
      console.error('Failed to delete script:', e);
      throw new Error('Failed to delete file');
    }
  }

  async generateScript(body: { title: string; projectName: string; steps: any[]; framework?: string; gherkin?: string }): Promise<{ filename: string; code: string }> {
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      
    const framework = body.framework || 'playwright';
    const filename = framework === 'cypress' ? `${slug}.cy.ts` : `${slug}.spec.ts`;

    const lines: string[] = [];

    if (body.gherkin) {
      // Gherkin mode
      const gherkinLines = body.gherkin.split('\n').map(l => l.trim()).filter(l => l);
      for (const line of gherkinLines) {
        if (line.startsWith('Feature:') || line.startsWith('Scenario:')) continue; // handled in suite/test description below
        
        if (line.match(/^(Given|When|Then|And|But)\b/i)) {
          if (framework === 'cypress') {
            lines.push(`    cy.log(${JSON.stringify(line)});`);
            lines.push(`    // TODO: implement step`);
          } else {
            lines.push(`    await test.step(${JSON.stringify(line)}, async () => {`);
            lines.push(`      // TODO: implement step`);
            lines.push(`    });`);
          }
          lines.push('');
        }
      }
    } else {
      // No-Code builder mode
      const selectorStr = (step: any): string => {
        let { selectorType, selector } = step;
        if (selectorType !== 'locator' && (selector.startsWith('[') || selector.startsWith('#') || selector.startsWith('.'))) {
          selectorType = 'locator';
        }
        
        if (framework === 'cypress') {
          if (selectorType === 'text') return `cy.contains(${JSON.stringify(selector)})`;
          return `cy.get(${JSON.stringify(selector)})`;
        } else {
          if (selectorType === 'text') return `page.getByText(${JSON.stringify(selector)})`;
          if (selectorType === 'label') return `page.getByLabel(${JSON.stringify(selector)})`;
          if (selectorType === 'placeholder') return `page.getByPlaceholder(${JSON.stringify(selector)})`;
          if (selectorType === 'testid') return `page.getByTestId(${JSON.stringify(selector)})`;
          if (selectorType === 'role') return `page.getByRole(${JSON.stringify(selector)})`;
          return `page.locator(${JSON.stringify(selector)})`;
        }
      };

      for (const step of body.steps) {
      const loc = selectorStr(step);
      
      if (framework === 'cypress') {
        switch (step.action) {
          case 'navigate':
            lines.push(`    // Navigate to URL`);
            lines.push(`    cy.visit(${JSON.stringify(step.url)});`);
            break;
          case 'click':
            lines.push(`    // Click element`);
            lines.push(`    ${loc}.click();`);
            break;
          case 'fill':
            lines.push(`    // Fill "${step.selector}" with value`);
            lines.push(`    ${loc}.type(${JSON.stringify(step.value || '')});`);
            break;
          case 'select':
            lines.push(`    // Select option in dropdown`);
            lines.push(`    ${loc}.select(${JSON.stringify(step.value || '')});`);
            break;
          case 'check':
            lines.push(`    // Check checkbox`);
            lines.push(`    ${loc}.check();`);
            break;
          case 'uncheck':
            lines.push(`    // Uncheck checkbox`);
            lines.push(`    ${loc}.uncheck();`);
            break;
          case 'hover':
            lines.push(`    // Hover over element`);
            lines.push(`    ${loc}.trigger('mouseover');`);
            break;
          case 'press_key':
            lines.push(`    // Press key`);
            lines.push(`    cy.focused().type('{${step.key || 'enter'}}');`);
            break;
          case 'wait':
            lines.push(`    // Wait ${step.ms || 1000}ms`);
            lines.push(`    cy.wait(${step.ms || 1000});`);
            break;
          case 'screenshot':
            lines.push(`    // Take screenshot`);
            lines.push(`    cy.screenshot(${JSON.stringify(step.name || 'screenshot')});`);
            break;
          case 'assert_url':
            lines.push(`    // Assert URL contains pattern`);
            lines.push(`    cy.url().should('include', ${JSON.stringify(step.pattern || '')});`);
            break;
          case 'assert_title':
            lines.push(`    // Assert page title`);
            lines.push(`    cy.title().should('eq', ${JSON.stringify(step.value || '')});`);
            break;
          case 'assert_text':
            lines.push(`    // Assert text is visible on page`);
            lines.push(`    cy.contains(${JSON.stringify(step.text || '')}).should('be.visible');`);
            break;
          case 'assert_visible':
            lines.push(`    // Assert element is visible`);
            lines.push(`    ${loc}.should('be.visible');`);
            break;
          case 'assert_not_visible':
            lines.push(`    // Assert element is not visible`);
            lines.push(`    ${loc}.should('not.be.visible');`);
            break;
          case 'assert_value':
            lines.push(`    // Assert element value`);
            lines.push(`    ${loc}.should('have.value', ${JSON.stringify(step.value || '')});`);
            break;
          case 'assert_enabled':
            lines.push(`    // Assert element is enabled`);
            lines.push(`    ${loc}.should('be.enabled');`);
            break;
          case 'assert_disabled':
            lines.push(`    // Assert element is disabled`);
            lines.push(`    ${loc}.should('be.disabled');`);
            break;
        }
      } else {
        switch (step.action) {
          case 'navigate':
            lines.push(`    // Navigate to URL`);
            lines.push(`    await page.goto(${JSON.stringify(step.url)});`);
            break;
          case 'click':
            lines.push(`    // Click element`);
            lines.push(`    await ${loc}.click();`);
            break;
          case 'fill':
            lines.push(`    // Fill "${step.selector}" with value`);
            lines.push(`    await ${loc}.fill(${JSON.stringify(step.value || '')});`);
            break;
          case 'select':
            lines.push(`    // Select option in dropdown`);
            lines.push(`    await ${loc}.selectOption(${JSON.stringify(step.value || '')});`);
            break;
          case 'check':
            lines.push(`    // Check checkbox`);
            lines.push(`    await ${loc}.check();`);
            break;
          case 'uncheck':
            lines.push(`    // Uncheck checkbox`);
            lines.push(`    await ${loc}.uncheck();`);
            break;
          case 'hover':
            lines.push(`    // Hover over element`);
            lines.push(`    await ${loc}.hover();`);
            break;
          case 'press_key':
            lines.push(`    // Press key`);
            lines.push(`    await page.keyboard.press(${JSON.stringify(step.key || 'Enter')});`);
            break;
          case 'wait':
            lines.push(`    // Wait ${step.ms || 1000}ms`);
            lines.push(`    await page.waitForTimeout(${step.ms || 1000});`);
            break;
          case 'screenshot':
            lines.push(`    // Take screenshot and attach to report`);
            lines.push(`    await test.info().attach(${JSON.stringify(step.name || 'screenshot')}, { body: await page.screenshot(), contentType: 'image/png' });`);
            break;
          case 'assert_url':
            lines.push(`    // Assert URL contains pattern`);
            lines.push(`    await expect(page).toHaveURL(/${step.pattern || ''}/);`);
            break;
          case 'assert_title':
            lines.push(`    // Assert page title`);
            lines.push(`    await expect(page).toHaveTitle(${JSON.stringify(step.value || '')});`);
            break;
          case 'assert_text':
            lines.push(`    // Assert text is visible on page`);
            lines.push(`    await expect(page.getByText(${JSON.stringify(step.text || '')})).toBeVisible();`);
            break;
          case 'assert_visible':
            lines.push(`    // Assert element is visible`);
            lines.push(`    await expect(${loc}).toBeVisible();`);
            break;
          case 'assert_not_visible':
            lines.push(`    // Assert element is not visible`);
            lines.push(`    await expect(${loc}).not.toBeVisible();`);
            break;
          case 'assert_value':
            lines.push(`    // Assert element value`);
            lines.push(`    await expect(${loc}).toHaveValue(${JSON.stringify(step.value || '')});`);
            break;
          case 'assert_enabled':
            lines.push(`    // Assert element is enabled`);
            lines.push(`    await expect(${loc}).toBeEnabled();`);
            break;
          case 'assert_disabled':
            lines.push(`    // Assert element is disabled`);
            lines.push(`    await expect(${loc}).toBeDisabled();`);
            break;
        }
      }
      lines.push('');
    }
    } // End of No-Code builder mode

    let code = '';
    if (framework === 'cypress') {
      code = [
        `describe(${JSON.stringify(body.projectName || 'Test Suite')}, () => {`,
        `  it(${JSON.stringify(body.title)}, () => {`,
        ...lines.map(l => (l === '' ? '' : l)),
        `  });`,
        `});`,
      ].join('\n');
    } else {
      code = [
        `import { test, expect } from '@playwright/test';`,
        ``,
        `test.describe(${JSON.stringify(body.projectName || 'Test Suite')}, () => {`,
        `  test(${JSON.stringify(body.title)}, async ({ page }) => {`,
        ...lines.map(l => (l === '' ? '' : l)),
        `  });`,
        `});`,
      ].join('\n');
    }

    const workspacePath = framework === 'cypress' ? 'cypress/cypress/e2e' : 'playwright/tests';
    const testsDir = path.resolve(process.cwd(), `../../automation/${workspacePath}`);
    await fs.writeFile(path.join(testsDir, filename), code, 'utf-8');

    return { filename, code };
  }

  async executeTestCase(testCaseId: string) {
    // 1. Ambil data test case
    const testCase = await this.testCasesService.findOne(testCaseId);
    
    if (testCase.automationType === 'none') {
      throw new Error('Test case is not automated');
    }

    const framework = testCase.automationTool || 'playwright';
    const workspacePath = framework === 'cypress' ? 'cypress/cypress' : 'playwright';
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
