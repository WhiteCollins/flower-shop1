const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/test-config');
const ScreenshotHelper = require('./screenshot-helper');
const fs = require('fs-extra');
const path = require('path');

/**
 * Configura el driver de Selenium y otras utilidades
 */
class SetupHelper {
  /**
   * Inicializa el WebDriver de Selenium
   */
  static async setupDriver() {
    // Asegurar que los directorios existen
    fs.ensureDirSync(config.screenshots.dir);
    fs.ensureDirSync(path.join('tests', 'reports'));
    
    // Configurar opciones de Chrome
    const options = new chrome.Options();
    
    // Configurar para ejecutar en modo headless si está especificado
    if (config.browser.headless) {
      options.addArguments('--headless');
    }
    
    // Añadir argumentos adicionales
    config.browser.args.forEach(arg => options.addArguments(arg));
    
    // Especificar el binario de Chrome si se proporciona una ruta
    if (config.browser.chromedriverPath) {
      options.setChromeBinaryPath(config.browser.chromedriverPath);
    }
    
    // Crear el driver con las opciones configuradas
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    // Configurar timeouts implícitos
    await driver.manage().setTimeouts({ implicit: config.defaultTimeout });
    
    // Maximizar la ventana
    await driver.manage().window().maximize();
    
    // Crear y adjuntar el helper de capturas
    const screenshotHelper = new ScreenshotHelper(driver);
    driver.screenshotHelper = screenshotHelper;
    
    return driver;
  }

  /**
   * Cierra el driver de Selenium y realiza limpieza
   */
  static async tearDown(driver, testContext = null) {
    if (driver) {
      // Tomar captura en error si está habilitado y el test falló
      if (config.screenshots.takeOnError && 
          testContext && 
          testContext.currentTest && 
          testContext.currentTest.state === 'failed') {
        
        const testName = testContext.currentTest.title;
        await driver.screenshotHelper.takeScreenshot(`error_${testName}`);
      }
      
      // Cerrar el navegador
      await driver.quit();
    }
  }
}

module.exports = SetupHelper;
