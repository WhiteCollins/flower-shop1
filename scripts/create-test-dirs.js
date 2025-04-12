/**
 * Script para crear los directorios necesarios para las pruebas
 */
const fs = require('fs-extra');
const path = require('path');

// Directorios necesarios para las pruebas
const directories = [
  'tests',
  'tests/reports',
  'tests/screenshots',
  'tests/reports/hu01',
  'tests/reports/hu02',
  'tests/reports/hu04',
  'tests/reports/hu06',
  'tests/reports/hu07',
  'tests/test-cases'
];

console.log('📂 Preparando estructura de directorios para pruebas...');

// Crear cada directorio
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  
  // Verificar si existe, si no, crearlo
  if (!fs.existsSync(fullPath)) {
    try {
      fs.ensureDirSync(fullPath);
      console.log(`✅ Directorio creado: ${dir}`);
    } catch (error) {
      console.error(`❌ Error al crear directorio ${dir}:`, error.message);
    }
  } else {
    console.log(`ℹ️ El directorio ya existe: ${dir}`);
  }
});

// Verificar que existan los archivos de prueba
const testFiles = [
  'tests/test-cases/hu01-visualizar-inventario.test.js',
  'tests/test-cases/hu02-filtrar-por-categoria.test.js',
  'tests/test-cases/hu04-anadir-flor.test.js',
  'tests/test-cases/hu06-eliminar-flor.test.js',
  'tests/test-cases/hu07-ver-estadisticas.test.js'
];

let missingTestFiles = false;
testFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ Archivo de prueba no encontrado: ${file}`);
    missingTestFiles = true;
  }
});

if (missingTestFiles) {
  console.log('\n⚠️ Algunos archivos de prueba no existen. Debes crearlos antes de ejecutar los tests.');
} else {
  console.log('\n✅ Todos los archivos de prueba están presentes.');
}

console.log('\n✨ Preparación completada.');
