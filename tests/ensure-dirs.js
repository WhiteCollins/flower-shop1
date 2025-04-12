/**
 * Script que se ejecuta al inicio de las pruebas para asegurar
 * que todos los directorios necesarios existan
 */
const fs = require('fs-extra');
const path = require('path');

// Función para crear directorios necesarios
function ensureDirectories() {
  // Lista de directorios que deben existir
  const directories = [
    'tests/reports',
    'tests/screenshots',
    'tests/reports/hu01',
    'tests/reports/hu02',
    'tests/reports/hu04',
    'tests/reports/hu06',
    'tests/reports/hu07'
  ];

  // Crear cada directorio si no existe
  directories.forEach(dir => {
    const fullPath = path.resolve(dir);
    if (!fs.existsSync(fullPath)) {
      fs.ensureDirSync(fullPath);
      console.log(`📁 Directorio creado: ${dir}`);
    }
  });
}

// Ejecutar al importar
ensureDirectories();

module.exports = ensureDirectories;
