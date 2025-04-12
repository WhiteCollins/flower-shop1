const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const { setupDriver, tearDown } = require('../setup');
const InventoryPage = require('../page-objects/inventory-page');
const StatsPage = require('../page-objects/stats-page');

/**
 * Pruebas para HU-07: Ver estadísticas del inventario
 */
describe('HU-07: Ver estadísticas del inventario', function() {
  // Aumentar timeout para pruebas de interfaz
  this.timeout(30000);
  
  let driver;
  let inventoryPage;
  let statsPage;
  
  before(async function() {
    driver = await setupDriver();
    inventoryPage = new InventoryPage(driver);
    statsPage = new StatsPage(driver);
  });
  
  after(async function() {
    await tearDown(driver);
  });
  
  it('debería navegar a la página de estadísticas', async function() {
    // Navegar a la página principal
    await inventoryPage.navigate();
    
    // Navegar a la página de estadísticas
    await inventoryPage.navigateToStats();
    
    // Verificar que estamos en la página de estadísticas
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/stats', 'La URL debería contener /stats');
  });
  
  it('debería mostrar estadísticas generales del inventario', async function() {
    // Navegar directamente a la página de estadísticas
    await statsPage.navigate();
    
    // Verificar que se muestra el valor total del inventario
    const totalValue = await statsPage.getTotalValue();
    expect(totalValue).to.be.a('number', 'El valor total debería ser un número');
    
    // Verificar que se muestra el total de items
    const totalItems = await statsPage.getTotalItems();
    expect(totalItems).to.be.a('number', 'El total de items debería ser un número');
    
    // Verificar que se muestran las gráficas
    const chartsPresent = await statsPage.chartsArePresent();
    expect(chartsPresent).to.be.true, 'Las gráficas deberían estar presentes';
  });
});
