const { By, until } = require('selenium-webdriver');
const config = require('../config/test-config');

/**
 * Clase de ayuda para interactuar con páginas de la aplicación
 */
class PageHelper {
  constructor(driver) {
    this.driver = driver;
    this.config = config;
  }

  /**
   * Navega a una URL específica
   */
  async navigate(url) {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;
    await this.driver.get(fullUrl);
    return this;
  }

  /**
   * Espera a que un elemento sea visible
   */
  async waitForElement(locator, timeout = this.config.defaultTimeout) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  /**
   * Encuentra un elemento por selector CSS
   */
  async findElement(css) {
    return await this.driver.findElement(By.css(css));
  }

  /**
   * Encuentra múltiples elementos por selector CSS
   */
  async findElements(css) {
    return await this.driver.findElements(By.css(css));
  }

  /**
   * Hace clic en un elemento
   */
  async click(locator) {
    const element = typeof locator === 'string' 
      ? await this.findElement(locator) 
      : locator;
    await element.click();
    return this;
  }

  /**
   * Escribe texto en un elemento
   */
  async type(locator, text) {
    const element = typeof locator === 'string' 
      ? await this.findElement(locator) 
      : locator;
    await element.clear();
    await element.sendKeys(text);
    return this;
  }

  /**
   * Toma una captura de pantalla
   */
  async takeScreenshot(name) {
    if (this.driver.takeScreenshot) {
      return await this.driver.takeScreenshot(name);
    }
    return null;
  }

  /**
   * Obtiene el texto de un elemento
   */
  async getText(locator) {
    const element = typeof locator === 'string' 
      ? await this.findElement(locator) 
      : locator;
    return await element.getText();
  }

  /**
   * Espera un tiempo específico (usar con precaución)
   */
  async pause(milliseconds) {
    await this.driver.sleep(milliseconds);
    return this;
  }
}

module.exports = PageHelper;
