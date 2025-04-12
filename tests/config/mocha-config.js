const path = require('path');
const fs = require('fs-extra');
const mochawesome = require('mochawesome');

// Configuración de fecha para reportes
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportDir = path.join(__dirname, '..', 'reports');
const screenshotsDir = path.join(__dirname, '..', 'screenshots');

// Asegurarse de que existen los directorios
fs.ensureDirSync(reportDir);
fs.ensureDirSync(screenshotsDir);

// Configuración para los reportes de Mocha
module.exports = {
  reporter: 'mochawesome',
  'reporter-option': [
    `reportDir=${reportDir}`,
    `reportFilename=flower-shop-report-${timestamp}`,
    'overwrite=false',
    'timestamp=true',
    'charts=true',
    'code=false',
    'inline=true',
    'json=true'
  ],
  timeout: 60000, // 60 segundos
  retries: 1,     // Reintentar tests fallidos una vez
  slow: 5000,     // Marcar tests como "lentos" si toman más de 5 segundos
  
  // Función para capturar screenshots al finalizar cada test
  reporterOptions: {
    mochawesome: {
      reportDir: reportDir,
      reportFilename: `flower-shop-report-${timestamp}`,
      quiet: false,
      overwrite: false,
      html: true,
      json: true,
      attachments: true, // Permitir adjuntar capturas
      screenshotsDir: screenshotsDir,
      timestamp: true,
      code: false,
      autoOpen: false,
      saveHtml: true,
      saveJson: true
    }
  },
  
  // Hook para ejecutarse al iniciar las pruebas
  beforeAll: async function() {
    console.log('⚡ Iniciando suite de pruebas automatizadas');
    console.log(`📁 Reportes se guardarán en: ${reportDir}`);
    console.log(`📷 Capturas se guardarán en: ${screenshotsDir}`);
  },
  
  // Hooks para ejecutarse antes y después de cada test
  beforeEach: async function() {
    console.log(`🧪 Iniciando test: ${this.currentTest.title}`);
  },
  
  afterEach: async function() {
    const test = this.currentTest;
    const state = test.state || 'unknown';
    const duration = test.duration ? `${test.duration}ms` : 'N/A';
    
    if (state === 'passed') {
      console.log(`✅ Test pasó: ${test.title} (${duration})`);
    } else if (state === 'failed') {
      console.log(`❌ Test falló: ${test.title} (${duration})`);
    } else {
      console.log(`⚠️ Test ${state}: ${test.title} (${duration})`);
    }
  },
  
  // Hook para ejecutarse al finalizar las pruebas
  afterAll: async function() {
    // Combinar reportes JSON
    try {
      const reportFiles = fs.readdirSync(reportDir)
        .filter(file => file.endsWith('.json') && !file.includes('combined'));
      
      if (reportFiles.length > 0) {
        const reports = reportFiles.map(file => {
          const filePath = path.join(reportDir, file);
          return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        });
        
        // Combinar los reportes
        const combinedReport = {
          stats: {
            suites: 0,
            tests: 0,
            passes: 0,
            pending: 0,
            failures: 0,
            start: reports[0].stats.start,
            end: reports[reports.length - 1].stats.end,
            duration: 0
          },
          results: [],
          meta: {
            mocha: {
              version: reports[0].meta.mocha.version
            },
            mochawesome: reports[0].meta.mochawesome
          }
        };
        
        reports.forEach(report => {
          combinedReport.stats.suites += report.stats.suites;
          combinedReport.stats.tests += report.stats.tests;
          combinedReport.stats.passes += report.stats.passes;
          combinedReport.stats.pending += report.stats.pending;
          combinedReport.stats.failures += report.stats.failures;
          combinedReport.stats.duration += report.stats.duration;
          
          combinedReport.results = combinedReport.results.concat(report.results);
        });
        
        // Guardar el reporte combinado
        const combinedReportPath = path.join(reportDir, `combined-report-${timestamp}.json`);
        fs.writeFileSync(combinedReportPath, JSON.stringify(combinedReport, null, 2));
        
        // Generar HTML desde el JSON combinado
        const marge = require('mochawesome-report-generator');
        await marge.create({
          reportDir: reportDir,
          reportFilename: `combined-report-${timestamp}`,
          charts: true,
          overwrite: false,
          timestamp: true,
          inline: true,
          saveJson: false
        }, combinedReport);
        
        console.log(`📊 Reporte combinado generado: ${path.join(reportDir, `combined-report-${timestamp}.html`)}`);
      }
    } catch (error) {
      console.error('❌ Error al combinar reportes:', error.message);
    }
    
    console.log('✨ Suite de pruebas completada');
  }
};
