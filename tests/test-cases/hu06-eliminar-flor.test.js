const { describe, it, before, after, beforeEach } = require('mocha');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const { setupDriver, tearDown } = require('../setup');
const InventoryPage = require('../page-objects/inventory-page');
const FlowerFormPage = require('../page-objects/flower-form-page');

/**
 * Pruebas para HU-06: Eliminar flores
 */
describe('HU-06: Eliminar flores', function() {
  // Aumentar timeout para pruebas de interfaz
  this.timeout(60000);
  
  let driver;
  let inventoryPage;
  let flowerFormPage;
  let testFlowerName = 'Flor para Eliminar ' + Date.now(); // Nombre único
  
  before(async function() {
    driver = await setupDriver();
    inventoryPage = new InventoryPage(driver);
    flowerFormPage = new FlowerFormPage(driver);
    
    // Crear una flor de prueba para eliminar
    await flowerFormPage.navigateToAdd();
    
    await flowerFormPage.fillForm({
      name: testFlowerName,
      price: 1.99,
      quantity: 5,
      category: 'roses', // Usar el valor correcto para la categoría
      description: 'Flor creada para probar la funcionalidad de eliminar'
    });
    
    await flowerFormPage.submitForm();
  });
  
  after(async function() {
    await tearDown(driver);
  });
  
  it('debería eliminar una flor correctamente', async function() {
    // Navegar a la página principal
    await inventoryPage.navigate();
    
    // Buscar la flor creada para la prueba
    await inventoryPage.searchBy(testFlowerName);
    
    // Verificar que la flor existe antes de eliminarla
    let flowerCards = await inventoryPage.getFlowerCards();
    let flowerExistsBefore = false;
    
    for (const card of flowerCards) {
      const cardText = await card.getText();
      if (cardText.includes(testFlowerName)) {
        flowerExistsBefore = true;
        break;
      }
    }
    
    expect(flowerExistsBefore).to.be.true, 'La flor debería existir antes de eliminarla';
    
    // Eliminar la flor
    await inventoryPage.deleteFlowerByName(testFlowerName);
    
    // Verificar que aparece una notificación
    const toastElements = await driver.findElements(By.css('[data-testid="toast-message"]'));
    expect(toastElements.length).to.be.at.least(1, 'Debería mostrar una notificación');
    
    // Buscar de nuevo para verificar que ya no está
    await inventoryPage.searchBy(testFlowerName);
    
    // Verificar que la flor ya no existe
    flowerCards = await inventoryPage.getFlowerCards();
    let flowerExistsAfter = false;
    
    for (const card of flowerCards) {
      const cardText = await card.getText();
      if (cardText.includes(testFlowerName)) {
        flowerExistsAfter = true;
        break;
      }
    }
    
    expect(flowerExistsAfter).to.be.false, 'La flor no debería existir después de eliminarla';
  });
});
