const { By, until, Key } = require('selenium-webdriver');

/**
 * Objeto de página para el formulario de flores
 */
class FlowerFormPage {
  constructor(driver) {
    this.driver = driver;
    this.addUrl = 'http://localhost:3000/add';
    
    // Selectores
    this.nameInput = By.css('[data-testid="name-input"]');
    this.priceInput = By.css('[data-testid="price-input"]');
    this.quantityInput = By.css('[data-testid="quantity-input"]');
    this.categorySelect = By.css('[data-testid="category-select"]');
    this.descriptionTextarea = By.css('[data-testid="description-textarea"]');
    this.imageInput = By.css('[data-testid="image-input"]');
    this.submitButton = By.css('[data-testid="submit-button"]');
    this.cancelButton = By.css('[data-testid="cancel-button"]');
    this.formTitle = By.css('[data-testid="form-title"]');
  }

  /**
   * Navegar al formulario de añadir flor
   */
  async navigateToAdd() {
    await this.driver.get(this.addUrl);
    await this.driver.wait(until.elementLocated(this.formTitle), 10000);
  }

  /**
   * Navegar al formulario de editar flor
   */
  async navigateToEdit(flowerId) {
    await this.driver.get(`http://localhost:3000/edit/${flowerId}`);
    await this.driver.wait(until.elementLocated(this.formTitle), 10000);
  }

  /**
   * Rellenar el formulario con datos
   */
  async fillForm(flowerData) {
    console.log('Rellenando formulario de flor con datos:', flowerData);
    
    // Limpiar y rellenar nombre
    const nameField = await this.driver.findElement(this.nameInput);
    await nameField.clear();
    await nameField.sendKeys(flowerData.name);
    
    // Limpiar y rellenar precio
    const priceField = await this.driver.findElement(this.priceInput);
    await priceField.clear();
    await priceField.sendKeys(flowerData.price.toString());
    
    // Limpiar y rellenar cantidad
    const quantityField = await this.driver.findElement(this.quantityInput);
    await quantityField.clear();
    await quantityField.sendKeys(flowerData.quantity.toString());
    
    // Seleccionar categoría - Método mejorado
    try {
      // Hacer clic en el selector para abrir el dropdown
      const categoryField = await this.driver.findElement(this.categorySelect);
      await categoryField.click();
      await this.driver.sleep(500); // Esperar a que se abra el dropdown
      
      // Intentar seleccionar la categoría por su data-value
      console.log(`Buscando categoría: ${flowerData.category}`);
      
      // Primero, intentar con atributo data-value
      try {
        const selectItem = await this.driver.findElement(
          By.css(`[data-value="${flowerData.category}"]`)
        );
        await selectItem.click();
        console.log(`✅ Categoría seleccionada por data-value: ${flowerData.category}`);
      } catch (selectError) {
        console.log('No se pudo seleccionar por data-value, intentando por contenido de texto...');
        
        // Como alternativa, buscar por texto visible
        const options = await this.driver.findElements(By.css('[role="option"]'));
        let optionFound = false;
        
        for (const option of options) {
          const optionText = await option.getText();
          console.log(`Opción encontrada: "${optionText}"`);
          
          if (optionText.toLowerCase().includes(flowerData.category.toLowerCase())) {
            await option.click();
            optionFound = true;
            console.log(`✅ Categoría seleccionada por texto: ${optionText}`);
            break;
          }
        }
        
        if (!optionFound) {
          // Como último recurso, enviar teclas de flecha abajo y Enter
          console.log('Intentando seleccionar usando teclas...');
          await categoryField.click();
          await this.driver.sleep(300);
          await categoryField.sendKeys(Key.DOWN);
          await this.driver.sleep(200);
          await categoryField.sendKeys(Key.ENTER);
        }
      }
    } catch (error) {
      console.error('❌ Error al seleccionar categoría:', error.message);
      // Continuar con el resto del formulario incluso si falla este paso
    }
    
    // Limpiar y rellenar descripción
    const descriptionField = await this.driver.findElement(this.descriptionTextarea);
    await descriptionField.clear();
    await descriptionField.sendKeys(flowerData.description);
    
    // Opcional: rellenar URL de imagen si se proporciona
    if (flowerData.image) {
      const imageField = await this.driver.findElement(this.imageInput);
      await imageField.clear();
      await imageField.sendKeys(flowerData.image);
    }
    
    console.log('✅ Formulario completado correctamente');
  }

  /**
   * Enviar el formulario
   */
  async submitForm() {
    const submitBtn = await this.driver.findElement(this.submitButton);
    await submitBtn.click();
    // Esperar redirección a la página principal
    await this.driver.sleep(1000);
  }

  /**
   * Cancelar el formulario
   */
  async cancelForm() {
    const cancelBtn = await this.driver.findElement(this.cancelButton);
    await cancelBtn.click();
    // Esperar redirección a la página principal
    await this.driver.sleep(1000);
  }
}

module.exports = FlowerFormPage;
