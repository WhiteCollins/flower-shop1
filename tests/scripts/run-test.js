/**
 * Script para ejecutar un test específico
 * Uso: node run-test.js <test-id>
 * Ejemplo: node run-test.js hu01
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Obtener el ID del test de los argumentos
const testId = process.argv[2];

if (!testId) {
  console.error('❌ Error: No se especificó ID de test');
  console.log('Uso: node run-test.js <test-id>');
  console.log('Ejemplo: node run-test.js hu01');
  process.exit(1);
}

// Mapeo de IDs de test a rutas de archivo
const testPaths = {
  hu01: 'tests/test-cases/hu01-visualizar-inventario.test.js',
  hu02: 'tests/test-cases/hu02-filtrar-por-categoria.test.js', 
  hu04: 'tests/test-cases/hu04-anadir-flor.test.js',
  hu06: 'tests/test-cases/hu06-eliminar-flor.test.js',
  hu07: 'tests/test-cases/hu07-ver-estadisticas.test.js'
};

// Verificar si el test existe
const testPath = testPaths[testId.toLowerCase()];
if (!testPath || !fs.existsSync(testPath)) {
  console.error(`❌ Error: Test con ID '${testId}' no encontrado`);
  console.log('Tests disponibles:', Object.keys(testPaths).join(', '));
  process.exit(1);
}

// Crear carpeta para reportes específicos del test
const testReportDir = path.join('tests', 'reports', testId);
fs.ensureDirSync(testReportDir);

// Crear comando para ejecutar el test
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const reportFilename = `${testId}-report-${timestamp}`;

console.log(`🧪 Ejecutando test: ${testId}`);
console.log(`📂 Archivo: ${testPath}`);
console.log(`📊 Reporte: ${testReportDir}/${reportFilename}.html`);

// Ejecutar el test con Mocha
const mochaProcess = spawn('npx', [
  'mocha',
  testPath,
  '--reporter', 'mochawesome',
  '--reporter-options', `reportDir=${testReportDir},reportFilename=${reportFilename},timestamp=true,charts=true`
], { stdio: 'inherit' });

mochaProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`\n✅ Test ${testId} completado exitosamente`);
    console.log(`📊 Reporte generado en: ${testReportDir}/${reportFilename}.html`);
  } else {
    console.error(`\n❌ Test ${testId} falló con código de salida ${code}`);
  }
});
