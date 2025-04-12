const fs = require('fs-extra');
const path = require('path');
const config = require('../config/test-config');

/**
 * Utilidad para tomar capturas de pantalla
 */
class ScreenshotHelper {
  constructor(driver) {
    this.driver = driver;
    this.screenshotDir = config.screenshots.dir;
    
    // Asegurar que el directorio existe
    fs.ensureDirSync(this.screenshotDir);
  }

  /**
   * Genera un nombre de archivo único basado en la descripción y timestamp
   */
  generateFilename(description) {
    const timestamp = new Date().toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '');
    
    const sanitizedDesc = (description || 'screenshot')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    return `${sanitizedDesc}_${timestamp}.png`;
  }

  /**
   * Toma una captura de pantalla y la guarda
   */
  async takeScreenshot(description = 'screenshot') {
    try {
      const filename = this.generateFilename(description);
      const filepath = path.join(this.screenshotDir, filename);
      
      // Tomar la captura
      const screenshot = await this.driver.takeScreenshot();
      
      // Guardar la captura
      await fs.writeFile(filepath, screenshot, 'base64');
      
      console.log(`Screenshot saved: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error('Error al tomar captura de pantalla:', error);
      return null;
    }
  }
}

module.exports = ScreenshotHelper;
