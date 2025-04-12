/**
 * Script para asegurar que existen los directorios necesarios para las pruebas
 */
const fs = require('fs-extra');
const path = require('path');

// Directorios que deben existir
const directories = [
  'tests/reports',
  'tests/screenshots',
  'tests/reports/hu01',
  'tests/reports/hu02',
  'tests/reports/hu04',
  'tests/reports/hu06',
  'tests/reports/hu07'
];

console.log('🔧 Verificando directorios para pruebas...');

// Crear cada directorio si no existe
directories.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`📁 Creando directorio: ${dir}`);
    fs.ensureDirSync(fullPath);
  } else {
    console.log(`✅ El directorio ya existe: ${dir}`);
  }
});

console.log('✨ Todos los directorios están listos');
