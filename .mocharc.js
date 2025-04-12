/**
 * Configuración global para Mocha
 */
const config = require('./tests/config/mocha-config');

module.exports = {
  // Timeout extendido para pruebas con Selenium
  timeout: config.timeout || 60000,
  
  // Opciones del reporter
  reporter: config.reporter || 'mochawesome',
  'reporter-option': config['reporter-option'] || [
    'reportDir=tests/reports',
    'reportFilename=report',
    'overwrite=false'
  ],
  
  // Reintentar tests fallidos
  retries: config.retries || 1,
  
  // Umbral para considerar un test como "lento"
  slow: config.slow || 5000,
  
  // Mostrar información detallada
  verbose: true,
  
  // Colores en la consola
  color: true,
  
  // Archivos a incluir en las pruebas
  spec: ['tests/test-cases/**/*.test.js'],
  
  // Archivos a cargar antes de las pruebas
  require: ['tests/setup.js']
};
