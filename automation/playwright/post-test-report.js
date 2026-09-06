/**
 * post-test-report.js
 * Script to read playwright test-results.json and post results to QA Track API.
 * Run this after: npx playwright test
 * Usage: node post-test-report.js
 */

const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, 'test-results.json');
const API_BASE = 'http://localhost:3000/api';

async function postResults() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.error('❌ test-results.json not found. Run `npx playwright test` first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(RESULTS_FILE, 'utf-8');
  const results = JSON.parse(raw);
  const stats = results.stats;

  const passed = stats.expected;
  const failed = stats.unexpected;
  const skipped = stats.skipped;
  const total = passed + failed + skipped;
  const durationMs = Math.round(stats.duration);

  console.log(`\n📊 QA Practice Test Results`);
  console.log(`   Total:   ${total}`);
  console.log(`   Passed:  ${passed}`);
  console.log(`   Failed:  ${failed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Duration: ${(durationMs / 1000).toFixed(1)}s`);

  // 1. Post an AutomationRun record
  try {
    const runRes = await fetch(`${API_BASE}/automation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suiteName: `QA Practice - Playwright Suite (${new Date().toLocaleDateString()})`,
        framework: 'playwright',
        status: failed === 0 ? 'passed' : 'failed',
        passed,
        failed,
        skipped,
        duration: durationMs,
        log: `Ran ${total} tests in ${(durationMs / 1000).toFixed(1)}s. Passed: ${passed}, Failed: ${failed}.`
      }),
    });

    if (runRes.ok) {
      const run = await runRes.json();
      console.log(`\n✅ Automation run saved to DB (ID: ${run.id})`);
    } else {
      console.error('❌ Failed to save automation run:', await runRes.text());
    }
  } catch (err) {
    console.error('❌ API request failed:', err.message);
  }

  // 2. Post a Report snapshot
  try {
    const reportRes = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Playwright Report - QA Practice (${new Date().toLocaleString()})`
      }),
    });

    if (reportRes.ok) {
      const report = await reportRes.json();
      console.log(`✅ Report snapshot saved to DB (ID: ${report.id})`);
    } else {
      console.error('❌ Failed to save report:', await reportRes.text());
    }
  } catch (err) {
    console.error('❌ Report API request failed:', err.message);
  }

  console.log('\n🎉 Done! Open QA Track dashboard to see live results.');
}

postResults();
