// Page Object: Add Product Page
// Autora: Lilian Kasprzak
// Analista de QA

class AddProductPage {
  // Elementos da página
  elements = {
    productNameInput: () => cy.get('[data-testid="product-textbox"]'),
    priceInput: () => cy.get('[data-testid="price-textbox"]'),
    dateStockedInput: () => cy.get('[data-testid="date-stocked"]'),
    submitButton: () => cy.get('[data-testid="submit-form"]'),
    cancelButton: () => cy.get('[data-testid="cancel-button"]'),
    pageTitle: () => cy.get('h1'),
    body: () => cy.get('body')
  };

  // Ações
  visit() {
    cy.visit('https://commitquality.com/');
    cy.navegarPara('addproduct');
  }

  fillProductName(productName) {
    this.elements.productNameInput().clear().type(productName);
  }

  fillPrice(price) {
    this.elements.priceInput().clear().type(price);
  }

  fillDateStocked(date) {
    this.elements.dateStockedInput().clear().type(date);
  }

  clearProductName() {
    this.elements.productNameInput().clear();
  }

  clearPrice() {
    this.elements.priceInput().clear();
  }

  clearDateStocked() {
    this.elements.dateStockedInput().clear();
  }

  submit() {
    this.elements.submitButton().click();
  }

  cancel() {
    this.elements.cancelButton().click();
  }

  // Validações
  validatePageTitle(expectedTitle) {
    this.elements.pageTitle().contains(expectedTitle).should('be.visible');
  }

  validateUrl(expectedPath) {
    cy.url().should('include', expectedPath);
  }

  validateProductNameExists() {
    this.elements.productNameInput().should('exist');
  }

  validatePriceExists() {
    this.elements.priceInput().should('exist');
  }

  validateDateStockedExists() {
    this.elements.dateStockedInput().should('exist');
  }

  validateSubmitButtonExists() {
    this.elements.submitButton().should('exist');
  }

  validateCancelButtonExists() {
    this.elements.cancelButton().should('exist');
  }

  validateAllFieldsExist() {
    this.validateProductNameExists();
    this.validatePriceExists();
    this.validateDateStockedExists();
    this.validateSubmitButtonExists();
    this.validateCancelButtonExists();
  }
}

export default AddProductPage;
