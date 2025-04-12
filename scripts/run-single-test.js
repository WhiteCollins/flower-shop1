/**
 * Script para ejecutar un test específico de la aplicación
 * 
 * Uso: node run-single-test.js <id-test> [--debug]
 * Ejemplo: node run-single-test.js hu01
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Obtener argumentos
const testId = process.argv[2];
const debugMode = process.argv.includes('--debug');

// Mapeo de IDs de test a archivos
const testMap = {
  'hu01': {
    path: 'tests/test-cases/hu01-visualizar-inventario.test.js',
    name: 'Visualizar inventario',
  },
  'hu02': {
    path: 'tests/test-cases/hu02-filtrar-por-categoria.test.js',
    name: 'Filtrar por categoría',
  },
  'hu04': {
    path: 'tests/test-cases/hu04-anadir-flor.test.js',
    name: 'Añadir flor',
  },
  'hu06': {
    path: 'tests/test-cases/hu06-eliminar-flor.test.js',
    name: 'Eliminar flor',
  },
  'hu07': {
    path: 'tests/test-cases/hu07-ver-estadisticas.test.js',
    name: 'Ver estadísticas',
  }
};

// Validar ID del test
if (!testId || !testMap[testId]) {
  console.error('❌ Error: ID de test no válido o no especificado');
  console.log('Tests disponibles:');
  Object.entries(testMap).forEach(([id, test]) => {
    console.log(`  - ${id}: ${test.name}`);
  });
  process.exit(1);
}

// Configuración de directorios
const testInfo = testMap[testId];
const reportsDir = path.join(__dirname, '..', 'tests', 'reports', testId);
const screenshotsDir = path.join(__dirname, '..', 'tests', 'screenshots');

// Asegurar que existen los directorios necesarios
fs.ensureDirSync(reportsDir);
fs.ensureDirSync(screenshotsDir);

// Generar nombre de reporte con timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
const reportFilename = `${testId}-report-${timestamp}`;

console.log(`
🧪 Ejecutando test: ${testId} - ${testInfo.name}
📁 Archivo: ${testInfo.path}
📊 Reporte: ${path.join(reportsDir, reportFilename)}.html
`);

// Configurar opciones de Mocha
const mochaOptions = [
  testInfo.path,
  '--reporter', 'mochawesome',
  '--reporter-options', `reportDir=${reportsDir},reportFilename=${reportFilename},timestamp=true,charts=true`,
  '--timeout', '60000'  // 60 segundos de timeout para tests
];

// Añadir opciones de debug si es necesario
if (debugMode) {
  mochaOptions.push('--inspect', '--debug');
  console.log('🔍 Modo debug activado');
}

// Ejecutar Mocha
const testProcess = spawn('npx', ['mocha', ...mochaOptions], {
  stdio: 'inherit',
  shell: true
});

// Manejar resultado
testProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`\n✅ Test ${testId} completado exitosamente`);
    console.log(`📊 Reporte generado en: ${path.join(reportsDir, reportFilename)}.html`);
  } else {
    console.error(`\n❌ Test ${testId} falló con código de salida ${code}`);
  }
});

// Manejar errores
testProcess.on('error', (err) => {
  console.error(`\n⚠️ Error al ejecutar el test: ${err.message}`);
});
