const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const { setupDriver, tearDown } = require('../setup');
const InventoryPage = require('../page-objects/inventory-page');
const FlowerFormPage = require('../page-objects/flower-form-page');

/**
 * Pruebas para HU-04: Añadir nueva flor
 */
describe('HU-04: Añadir nueva flor', function() {
  // Aumentar timeout para pruebas de interfaz
  this.timeout(60000);
  
  let driver;
  let inventoryPage;
  let flowerFormPage;
  
  before(async function() {
    driver = await setupDriver();
    inventoryPage = new InventoryPage(driver);
    flowerFormPage = new FlowerFormPage(driver);
  });
  
  after(async function() {
    await tearDown(driver);
  });
  
  it('debería navegar al formulario de añadir flor', async function() {
    // Navegar a la página principal
    await inventoryPage.navigate();
    
    // Hacer clic en el botón de añadir flor
    await inventoryPage.navigateToAddFlower();
    
    // Verificar que estamos en la página de formulario
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/add', 'La URL debería contener /add');
  });
  
  it('debería añadir una nueva flor correctamente', async function() {
    // Datos de prueba
    const testFlower = {
      name: 'Flor de Prueba Automatizada',
      price: 9.99,
      quantity: 25,
      category: 'roses', // Asegurarse que esta categoría existe en el sistema
      description: 'Esta es una flor creada mediante prueba automatizada'
    };
    
    // Navegar directamente al formulario de añadir
    await flowerFormPage.navigateToAdd();
    
    // Rellenar el formulario
    await flowerFormPage.fillForm(testFlower);
    
    // Enviar el formulario
    await flowerFormPage.submitForm();
    
    // Verificar que hemos vuelto a la página principal
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.not.include('/add', 'Debería redirigir fuera de /add después de guardar');
    
    // Buscar la flor recién creada
    await inventoryPage.searchBy(testFlower.name);
    
    // Esperar a que se actualice la página después de la búsqueda
    await driver.sleep(1000);
    
    // Verificar que se encuentra en los resultados
    const flowerCards = await inventoryPage.getFlowerCards();
    let flowerFound = false;
    
    for (const card of flowerCards) {
      const cardText = await card.getText();
      if (cardText.includes(testFlower.name)) {
        flowerFound = true;
        break;
      }
    }
    
    expect(flowerFound).to.be.true, 'La flor recién creada debería encontrarse en el inventario';
  });
});
