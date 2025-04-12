const path = require('path');

/**
 * Configuración global para los tests
 */
module.exports = {
  // URL base para las pruebas
  baseUrl: 'http://localhost:3000',
  
  // Tiempo de espera predeterminado (en ms)
  defaultTimeout: 15000,
  
  // Configuración de capturas de pantalla
  screenshots: {
    // Directorio donde se guardarán las capturas
    dir: path.join(__dirname, '..', 'screenshots'),
    // Tomar capturas automáticamente en caso de error
    takeOnError: true,
    // Tomar capturas en cada paso (útil para depuración)
    takeOnStep: true
  },
  
  // Configuración específica del navegador
  browser: {
    // Ruta al ejecutable de Chrome
    chromePath: 'C:\\Users\\Eric\\Desktop\\chrome-win64\\chrome.exe',
    // Modo headless (false para mostrar el navegador)
    headless: false,
    // Argumentos adicionales para Chrome
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ]
  },
  
  // Configuración para los reportes
  reports: {
    dir: path.join(__dirname, '..', 'reports'),
    filename: 'flower-shop-test-report'
  },
  
  // Selectores comunes para la aplicación
  selectors: {
    flowerCard: '[data-testid="flower-card"]',
    categoryTab: '[data-testid="category-tab"]',
    searchInput: '[data-testid="search-input"]',
    deleteButton: '[data-testid="delete-button"]',
    addFlowerButton: '[data-testid="add-flower-button"]',
    statsLink: '[data-testid="stats-link"]',
    toastMessage: '[data-testid="toast-message"]',
    // Selectores específicos para la página de estadísticas
    totalValueCard: '[data-testid="total-value-card"]',
    totalItemsCard: '[data-testid="total-items-card"]',
    flowerTypesCard: '[data-testid="flower-types-card"]',
    categoryChart: '[data-testid="category-chart"]',
    inventoryValueChart: '[data-testid="inventory-value-chart"]'
  }
};
