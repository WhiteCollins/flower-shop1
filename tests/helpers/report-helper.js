const fs = require('fs-extra');
const path = require('path');
const config = require('../config/test-config');

/**
 * Utilidad para asistir en la generación de reportes
 */
class ReportHelper {
  constructor() {
    this.reportsDir = config.reports.dir;
    fs.ensureDirSync(this.reportsDir);
    
    this.reportData = {
      tests: [],
      startTime: new Date(),
      endTime: null,
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      }
    };
  }
  
  /**
   * Inicia un test
   */
  startTest(testName, suite) {
    const testData = {
      name: testName,
      suite: suite || 'Default Suite',
      startTime: new Date(),
      endTime: null,
      duration: 0,
      status: 'running',
      screenshots: [],
      steps: [],
      error: null
    };
    
    this.reportData.tests.push(testData);
    return testData;
  }
  
  /**
   * Finaliza un test
   */
  endTest(testData, status, error = null) {
    testData.endTime = new Date();
    testData.duration = testData.endTime - testData.startTime;
    testData.status = status;
    testData.error = error ? {
      message: error.message,
      stack: error.stack
    } : null;
    
    // Actualizar estadísticas
    this.reportData.summary.total++;
    if (status === 'passed') this.reportData.summary.passed++;
    else if (status === 'failed') this.reportData.summary.failed++;
    else if (status === 'skipped') this.reportData.summary.skipped++;
    
    return testData;
  }
  
  /**
   * Agrega un paso al test
   */
  addStep(testData, description, status = 'passed', screenshotPath = null) {
    const step = {
      description,
      status,
      time: new Date(),
      screenshot: screenshotPath
    };
    
    testData.steps.push(step);
    
    if (screenshotPath) {
      testData.screenshots.push({
        path: screenshotPath,
        description: description,
        time: step.time
      });
    }
    
    return step;
  }
  
  /**
   * Finaliza el reporte
   */
  finalize() {
    this.reportData.endTime = new Date();
    this.reportData.duration = this.reportData.endTime - this.reportData.startTime;
    
    const reportPath = path.join(
      this.reportsDir, 
      `custom-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    );
    
    fs.writeJsonSync(reportPath, this.reportData, { spaces: 2 });
    return this.reportData;
  }
}

module.exports = ReportHelper;
