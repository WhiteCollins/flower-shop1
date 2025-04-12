/**
 * Script para generar reportes automáticos a partir de los resultados de Mocha
 */
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const marge = require('mochawesome-report-generator');
const merge = require('mochawesome-merge');

// Configuración
const config = {
  reportDir: path.join(__dirname, '..', 'reports'),
  screenshotsDir: path.join(__dirname, '..', 'screenshots'),
  reportTitle: 'Flower Shop - Reporte de Pruebas Automatizadas',
  timestamp: new Date().toISOString().replace(/[:.]/g, '-')
};

// Asegurar que existen los directorios
fs.ensureDirSync(config.reportDir);
fs.ensureDirSync(config.screenshotsDir);

/**
 * Función principal para generar el reporte
 */
async function generateReport() {
  console.log('📊 Generando reporte automatizado...');
  
  try {
    // Verificar si hay archivos JSON de reporte
    const jsonFiles = fs.readdirSync(config.reportDir).filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.error('❌ No se encontraron archivos JSON de reporte para combinar');
      return;
    }
    
    console.log(`🔍 Encontrados ${jsonFiles.length} archivos JSON de reporte`);
    
    // Combinar reportes JSON
    const mergedReport = await merge({
      files: jsonFiles.map(file => path.join(config.reportDir, file)),
      reportDir: config.reportDir
    });
    
    // Generar reporte HTML
    const reportConfig = {
      reportDir: config.reportDir,
      reportFilename: `flower-shop-report-${config.timestamp}`,
      reportTitle: config.reportTitle,
      reportPageTitle: 'Flower Shop Test Results',
      charts: true,
      overwrite: false,
      timestamp: true,
      inline: true,
      code: false,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: true,
      displayDuration: true,
      autoOpen: false
    };
    
    const reportFile = await marge.create(reportConfig, mergedReport);
    console.log(`✅ Reporte HTML generado: ${reportFile[0]}`);
    
    // Intentar añadir capturas de pantalla al reporte
    try {
      attachScreenshots(reportFile[0]);
    } catch (screenshotError) {
      console.warn('⚠️ No se pudieron adjuntar capturas de pantalla:', screenshotError.message);
    }
    
    // Abrir el reporte si no estamos en un entorno CI
    if (!process.env.CI) {
      console.log('🔍 Abriendo reporte en el navegador...');
      openReport(reportFile[0]);
    }
    
    return reportFile[0];
  } catch (error) {
    console.error('❌ Error al generar reporte:', error);
    throw error;
  }
}

/**
 * Añade capturas de pantalla al reporte HTML
 */
function attachScreenshots(reportFilePath) {
  const reportDir = path.dirname(reportFilePath);
  const screenshots = fs.readdirSync(config.screenshotsDir).filter(file => 
    file.endsWith('.png') || file.endsWith('.jpg')
  );
  
  if (screenshots.length === 0) {
    console.log('⚠️ No se encontraron capturas de pantalla para adjuntar');
    return;
  }
  
  console.log(`🖼️ Adjuntando ${screenshots.length} capturas de pantalla al reporte...`);
  
  // Copiar capturas a la carpeta del reporte
  const assetsDir = path.join(reportDir, 'assets');
  fs.ensureDirSync(assetsDir);
  
  screenshots.forEach(screenshot => {
    fs.copyFileSync(
      path.join(config.screenshotsDir, screenshot),
      path.join(assetsDir, screenshot)
    );
  });
  
  console.log('✅ Capturas de pantalla adjuntadas correctamente');
}

/**
 * Abre el reporte HTML en el navegador predeterminado
 */
function openReport(reportPath) {
  const command = process.platform === 'win32' ? 'start' : 
                 process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  exec(`${command} "${reportPath}"`);
}

// Si el script se ejecuta directamente, generar el reporte
if (require.main === module) {
  generateReport()
    .then(() => console.log('✨ Proceso completado exitosamente'))
    .catch(err => {
      console.error('❌ Error en el proceso:', err);
      process.exit(1);
    });
}

module.exports = {
  generateReport
};
