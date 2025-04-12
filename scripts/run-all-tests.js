/**
 * Script para ejecutar todos los tests en secuencia
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Lista de tests en orden de ejecución
const tests = ['hu01', 'hu02', 'hu04', 'hu06', 'hu07'];

// Resultados
const results = {
  passed: [],
  failed: []
};

// Directorios para reportes y capturas
const reportsDir = path.join(__dirname, '..', 'tests', 'reports');
const screenshotsDir = path.join(__dirname, '..', 'tests', 'screenshots');

// Asegurar que existen los directorios
fs.ensureDirSync(reportsDir);
fs.ensureDirSync(screenshotsDir);

// Hora de inicio global
const startTime = new Date();

console.log(`
🚀 Iniciando ejecución de todos los tests (${tests.length} tests)
⏱️  Hora de inicio: ${startTime.toLocaleTimeString()}
`);

/**
 * Ejecuta los tests en secuencia
 */
async function runTests() {
  for (const testId of tests) {
    const testStartTime = new Date();
    
    console.log(`\n📋 Ejecutando test ${testId} (${tests.indexOf(testId) + 1}/${tests.length})`);
    
    try {
      // Ejecutar el test individual
      const code = await runSingleTest(testId);
      
      const testEndTime = new Date();
      const duration = ((testEndTime - testStartTime) / 1000).toFixed(2);
      
      if (code === 0) {
        console.log(`✅ Test ${testId} pasó (${duration}s)`);
        results.passed.push(testId);
      } else {
        console.log(`❌ Test ${testId} falló con código ${code} (${duration}s)`);
        results.failed.push(testId);
      }
    } catch (error) {
      console.error(`⚠️ Error al ejecutar test ${testId}: ${error.message}`);
      results.failed.push(testId);
    }
  }
  
  // Mostrar resumen
  const endTime = new Date();
  const totalDuration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`
\n📊 RESUMEN DE EJECUCIÓN
======================
⏱️  Tiempo total: ${totalDuration} segundos
✅ Tests pasados: ${results.passed.length} (${results.passed.join(', ') || 'ninguno'})
❌ Tests fallidos: ${results.failed.length} (${results.failed.join(', ') || 'ninguno'})
======================
`);

  // Salir con código de error si algún test falló
  if (results.failed.length > 0) {
    process.exit(1);
  }
}

/**
 * Ejecuta un test individual y retorna su código de salida
 */
function runSingleTest(testId) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, 'run-single-test.js');
    
    const testProcess = spawn('node', [scriptPath, testId], {
      stdio: 'inherit',
      shell: true
    });
    
    testProcess.on('close', (code) => {
      resolve(code);
    });
  });
}

// Ejecutar los tests
runTests().catch(error => {
  console.error(`\n❌ Error en la ejecución: ${error.message}`);
  process.exit(1);
});
