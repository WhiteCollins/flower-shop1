const { Builder, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs-extra');
const path = require('path');

// Asegurar que existan las carpetas para reportes y capturas
const screenshotsDir = path.join(__dirname, 'screenshots');
const reportsDir = path.join(__dirname, 'reports');

// Crear directorios si no existen
fs.ensureDirSync(screenshotsDir);
fs.ensureDirSync(reportsDir);
fs.ensureDirSync(path.join(reportsDir, 'hu01'));
fs.ensureDirSync(path.join(reportsDir, 'hu02'));
fs.ensureDirSync(path.join(reportsDir, 'hu04'));
fs.ensureDirSync(path.join(reportsDir, 'hu06'));
fs.ensureDirSync(path.join(reportsDir, 'hu07'));

console.log('✅ Directorios de pruebas verificados');

/**
 * Configuración para iniciar el navegador para las pruebas
 */
async function setupDriver(testName = null) {
  console.log(`Iniciando navegador${testName ? ` para test: ${testName}` : ''}...`);
  
  // Configurar opciones de Chrome
  const options = new chrome.Options();
  
  // Configurar para ejecutar en modo headless en entorno CI
  if (process.env.CI) {
    options.addArguments('--headless');
  }
  
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');
  
  // Especificar la ruta al ejecutable de Chrome
  const chromePath = 'C:\\Users\\Eric\\Desktop\\chrome-win64\\chrome.exe';
  if (fs.existsSync(chromePath)) {
    console.log(`🌐 Usando Chrome desde: ${chromePath}`);
    options.setChromeBinaryPath(chromePath);
  } else {
    console.log('⚠️ Ruta de Chrome no encontrada, usando Chrome por defecto');
  }

  try {
    // Crear el driver con las capacidades de Chrome
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // Configurar timeouts implícitos
    await driver.manage().setTimeouts({ implicit: 15000, pageLoad: 30000 });
    
    // Maximizar la ventana del navegador
    await driver.manage().window().maximize();
    
    // Definir una función correcta para tomar capturas de pantalla
    driver.takeScreenshotSafe = async function(name) {
      try {
        const screenshot = await driver.takeScreenshot();
        if (!screenshot) {
          console.warn('⚠️ La captura de pantalla devolvió null');
          return null;
        }
        
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const sanitizedName = (name || 'screenshot').replace(/[^a-zA-Z0-9-_]/g, '_');
        const fileName = `${sanitizedName}_${timestamp}.png`;
        const filePath = path.join(screenshotsDir, fileName);
        
        await fs.writeFile(filePath, screenshot, 'base64');
        console.log(`📸 Captura guardada: ${filePath}`);
        return filePath;
      } catch (error) {
        console.error('❌ Error al tomar captura de pantalla:', error.message);
        return null;
      }
    };
    
    console.log('✅ Navegador iniciado correctamente');
    return driver;
  } catch (error) {
    console.error('❌ Error al iniciar el navegador:', error);
    throw error;
  }
}

/**
 * Toma una captura de pantalla y la guarda en la carpeta screenshots
 */
async function takeScreenshot(driver, testName) {
  if (!driver) return null;
  
  try {
    // Verificar si el driver está activo
    const isDriverActive = await driver.getTitle().catch(() => false);
    if (!isDriverActive) {
      console.warn('⚠️ Driver no está activo para tomar captura');
      return null;
    }
    
    const screenshot = await driver.takeScreenshot();
    if (!screenshot) {
      console.warn('⚠️ La captura de pantalla devolvió null');
      return null;
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const sanitizedTestName = (testName || 'screenshot').replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${sanitizedTestName}_${timestamp}.png`;
    const filePath = path.join(screenshotsDir, fileName);
    
    await fs.writeFile(filePath, screenshot, 'base64');
    
    console.log(`✅ Captura guardada: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('❌ Error al tomar captura de pantalla:', error.message);
    return null;
  }
}

/**
 * Cerrar el driver de Selenium
 */
async function tearDown(driver, testInfo = null) {
  if (driver) {
    // Si hay información del test y falló, tomar captura de pantalla
    if (testInfo && testInfo.currentTest && testInfo.currentTest.state === 'failed') {
      try {
        const testName = `error_${testInfo.currentTest.title}`;
        console.log(`⚠️ Test fallido: ${testName}`);
        await driver.takeScreenshotSafe(testName);
      } catch (error) {
        console.error('❌ Error al tomar captura de error:', error.message);
      }
    }
    
    console.log('🔄 Cerrando navegador...');
    try {
      await driver.quit();
      console.log('✅ Navegador cerrado correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar el navegador:', error.message);
    }
  }
}

module.exports = {
  setupDriver,
  tearDown,
  takeScreenshot
};
