const { By, until } = require('selenium-webdriver');
const config = require('../config/test-config');
const fs = require('fs-extra');
const path = require('path');

// Asegurar que existe el directorio de capturas
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
fs.ensureDirSync(screenshotsDir);

/**
 * Clase base para los objetos de página
 */
class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.config = config;
    this.url = config.baseUrl;
  }

  /**
   * Navega a la página base
   */
  async navigate() {
    const fullUrl = this.url.startsWith('http') ? this.url : `${this.config.baseUrl}${this.url}`;
    console.log(`Navegando a: ${fullUrl}`);
    await this.driver.get(fullUrl);
    return this;
  }

  /**
   * Espera a que un elemento sea visible
   */
  async waitForElement(locator, timeout = 20000) {
    const locatorStr = typeof locator === 'string' ? locator : locator.toString();
    console.log(`Esperando elemento: ${locatorStr}...`);
    try {
      const element = await this.driver.wait(until.elementLocated(locator), timeout);
      console.log(`✅ Elemento encontrado: ${locatorStr}`);
      return element;
    } catch (error) {
      console.error(`❌ Timeout esperando elemento: ${locatorStr}`);
      throw error;
    }
  }

  /**
   * Encuentra un elemento por selector CSS
   */
  async findElement(css) {
    try {
      return await this.driver.findElement(By.css(css));
    } catch (error) {
      console.error(`❌ Error al encontrar elemento: ${css}`, error.message);
      throw error;
    }
  }

  /**
   * Encuentra múltiples elementos por selector CSS
   */
  async findElements(css) {
    try {
      return await this.driver.findElements(By.css(css));
    } catch (error) {
      console.error(`❌ Error al encontrar elementos: ${css}`, error.message);
      return [];
    }
  }

  /**
   * Hace clic en un elemento
   */
  async click(locator) {
    try {
      const element = typeof locator === 'string' 
        ? await this.findElement(locator) 
        : locator;
      await element.click();
      return this;
    } catch (error) {
      console.error(`❌ Error al hacer clic en elemento`, error.message);
      throw error;
    }
  }

  /**
   * Escribe texto en un elemento
   */
  async type(locator, text) {
    try {
      const element = typeof locator === 'string' 
        ? await this.findElement(locator) 
        : locator;
      await element.clear();
      await element.sendKeys(text);
      return this;
    } catch (error) {
      console.error(`❌ Error al escribir texto en elemento`, error.message);
      throw error;
    }
  }

  /**
   * Espera un tiempo específico (usar con precaución)
   */
  async pause(milliseconds) {
    await this.driver.sleep(milliseconds);
    return this;
  }

  /**
   * Obtiene el texto de un elemento
   */
  async getText(locator) {
    try {
      const element = typeof locator === 'string' 
        ? await this.findElement(locator) 
        : locator;
      return await element.getText();
    } catch (error) {
      console.error(`❌ Error al obtener texto de elemento`, error.message);
      return '';
    }
  }

  /**
   * Espera a que la página se cargue completamente
   */
  async waitForPageLoad() {
    console.log('Esperando carga completa de la página...');
    try {
      await this.driver.wait(async () => {
        const readyState = await this.driver.executeScript('return document.readyState');
        return readyState === 'complete';
      }, this.config.defaultTimeout);
      console.log('✅ Página cargada completamente.');
      return this;
    } catch (error) {
      console.error('❌ Timeout esperando carga de página:', error.message);
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

module.exports = BasePage;
