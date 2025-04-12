const { By, until } = require('selenium-webdriver');
const BasePage = require('./base-page');
const config = require('../config/test-config');
const fs = require('fs-extra');
const path = require('path');

// Asegurar que existe el directorio de capturas
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
fs.ensureDirSync(screenshotsDir);

/**
 * Objeto de página para la vista de inventario
 */
class InventoryPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = `${config.baseUrl}/`;
    
    // Selectores
    this.selectors = {
      flowerCards: '[data-testid="flower-card"], .card, .overflow-hidden',
      categoryTabs: '[data-testid="category-tab"]',
      searchInput: '[data-testid="search-input"]',
      deleteButtons: '[data-testid="delete-button"]',
      addFlowerButton: '[data-testid="add-flower-button"]',
      statsLink: '[data-testid="stats-link"]',
      toastMessage: '[data-testid="toast-message"]',
      lowStockIndicator: '[data-testid="low-stock-indicator"]',
    };
  }

  /**
   * Navegar a la página de inventario
   */
  async navigate() {
    console.log('Navegando a la página de inventario...');
    await super.navigate();
    try {
      await this.waitForElement(By.css(this.selectors.flowerCards));
      console.log('✅ Página de inventario cargada correctamente.');
      await this.captureScreenshot('inventory-page-loaded');
      return this;
    } catch (error) {
      console.error('❌ Error al cargar la página de inventario:', error.message);
      throw error;
    }
  }

  /**
   * Obtener todas las tarjetas de flores
   */
  async getFlowerCards() {
    console.log('Obteniendo tarjetas de flores...');
    try {
      const cards = await this.findElements(this.selectors.flowerCards);
      console.log(`✅ Se encontraron ${cards.length} tarjetas de flores.`);
      return cards;
    } catch (error) {
      console.error('❌ Error al obtener tarjetas de flores:', error.message);
      return [];
    }
  }

  /**
   * Filtrar por categoría
   */
  async filterByCategory(categoryName) {
    console.log(`Filtrando por categoría: ${categoryName}...`);
    try {
      const tabs = await this.findElements(this.selectors.categoryTabs);
      for (const tab of tabs) {
        const text = await tab.getText();
        if (text.toLowerCase().includes(categoryName.toLowerCase())) {
          await tab.click();
          console.log(`✅ Categoría "${categoryName}" seleccionada.`);
          await this.captureScreenshot(`filter-by-${categoryName}`);
          // Esperar a que la UI se actualice
          await this.pause(500);
          break;
        }
      }
      return this;
    } catch (error) {
      console.error(`❌ Error al filtrar por categoría "${categoryName}":`, error.message);
      throw error;
    }
  }

  /**
   * Buscar por término
   */
  async searchBy(term) {
    console.log(`Buscando por término: "${term}"...`);
    try {
      const searchBox = await this.findElement(this.selectors.searchInput);
      await searchBox.clear();
      await searchBox.sendKeys(term);
      await this.captureScreenshot(`search-for-${term}`);
      // Esperar a que los resultados se actualicen
      await this.pause(1000);
      return this;
    } catch (error) {
      console.error(`❌ Error al buscar por término "${term}":`, error.message);
      throw error;
    }
  }

  /**
   * Eliminar una flor por nombre
   */
  async deleteFlowerByName(flowerName) {
    console.log(`Eliminando flor: ${flowerName}...`);
    try {
      // Primero buscar la flor
      await this.searchBy(flowerName);
      
      // Encontrar todos los cards
      const cards = await this.findElements(this.selectors.flowerCards);
      
      for (const card of cards) {
        const cardText = await card.getText();
        if (cardText.includes(flowerName)) {
          await this.captureScreenshot(`before-delete-${flowerName}`);
          
          // Encontrar el botón de eliminar dentro de esta tarjeta
          const deleteBtn = await card.findElement(By.css('[data-testid="delete-button"]'));
          await deleteBtn.click();
          
          // Confirmar la eliminación - buscar el botón de confirmación
          await this.pause(500);
          const confirmBtn = await this.driver.findElement(By.css('[data-testid="confirm-delete"]'));
          if (confirmBtn) {
            await confirmBtn.click();
          }
          
          // Esperar a que aparezca el toast
          await this.waitForElement(By.css(this.selectors.toastMessage), 5000);
          await this.captureScreenshot(`after-delete-${flowerName}`);
          break;
        }
      }
      return this;
    } catch (error) {
      console.error(`❌ Error al eliminar flor "${flowerName}":`, error.message);
      throw error;
    }
  }

  /**
   * Verificar si existen flores con bajo stock
   */
  async hasLowStockFlowers() {
    console.log('Verificando flores con bajo stock...');
    const indicators = await this.findElements(this.selectors.lowStockIndicator);
    return indicators.length > 0;
  }

  /**
   * Navegar a estadísticas
   */
  async navigateToStats() {
    console.log('Navegando a estadísticas...');
    try {
      const statsLinkElement = await this.findElement(this.selectors.statsLink);
      await statsLinkElement.click();
      
      // Usar el método de captura seguro
      await this.captureScreenshot('navigate-to-stats');
      
      // Esperar a que la página de estadísticas cargue
      await this.pause(1000);
      return this;
    } catch (error) {
      console.error('❌ Error al navegar a estadísticas:', error.message);
      throw error;
    }
  }
  
  /**
   * Navegar a añadir flor
   */
  async navigateToAddFlower() {
    console.log('Navegando a añadir flor...');
    try {
      const addButton = await this.findElement(this.selectors.addFlowerButton);
      await addButton.click();
      console.log('✅ Botón de añadir flor pulsado.');
      // Esperar a que el formulario cargue
      await this.pause(1000);
      return this;
    } catch (error) {
      console.error('❌ Error al navegar a añadir flor:', error.message);
      throw error;
    }
  }

  /**
   * Método para tomar capturas de pantalla de manera segura
   */
  async captureScreenshot(name) {
    try {
      if (!this.driver) {
        console.warn('⚠️ Driver no disponible para captura');
        return null;
      }
      
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const fileName = `${name}_${timestamp}.png`;
      const filePath = path.join(screenshotsDir, fileName);
      
      const screenshot = await this.driver.takeScreenshot();
      if (!screenshot) {
        console.warn('⚠️ La captura de pantalla devolvió null');
        return null;
      }
      
      await fs.writeFile(filePath, screenshot, 'base64');
      console.log(`📸 Captura guardada: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('❌ Error al tomar captura de pantalla:', error.message);
      return null;
    }
  }
}

module.exports = InventoryPage;
