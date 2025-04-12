const { By, until } = require('selenium-webdriver');

/**
 * Objeto de página para la vista de estadísticas
 */
class StatsPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'http://localhost:3000/stats';
    
    // Selectores
    this.pageTitle = By.css('h1');
    this.totalValueCard = By.css('[data-testid="total-value-card"]');
    this.totalItemsCard = By.css('[data-testid="total-items-card"]');
    this.flowerTypesCard = By.css('[data-testid="flower-types-card"]');
    this.categoryChart = By.css('[data-testid="category-chart"]');
    this.inventoryValueChart = By.css('[data-testid="inventory-value-chart"]');
  }

  /**
   * Navegar a la página de estadísticas
   */
  async navigate() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(this.pageTitle), 10000);
  }

  /**
   * Obtener el valor total del inventario
   */
  async getTotalValue() {
    const valueCard = await this.driver.findElement(this.totalValueCard);
    const text = await valueCard.getText();
    // Extraer el número del texto (suponiendo formato "$X.XX")
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Obtener el total de items en inventario
   */
  async getTotalItems() {
    const itemsCard = await this.driver.findElement(this.totalItemsCard);
    const text = await itemsCard.getText();
    // Extraer el número del texto
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  /**
   * Verificar si las gráficas están presentes
   */
  async chartsArePresent() {
    const categoryChartElements = await this.driver.findElements(this.categoryChart);
    const valueChartElements = await this.driver.findElements(this.inventoryValueChart);
    
    return categoryChartElements.length > 0 && valueChartElements.length > 0;
  }
}

module.exports = StatsPage;
