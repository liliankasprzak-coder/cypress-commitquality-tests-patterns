// Page Object: Contact Form Page
// Autora: Lilian Kasprzak
// Analista de QA

class ContactFormPage {
  // Elementos da página
  elements = {
    nameInput: () => cy.get('input[data-testid="name"]'),
    emailInput: () => cy.get('input[data-testid="email"]'),
    queryTypeSelect: () => cy.get('select[data-testid="query-type"]'),
    dobInput: () => cy.get('input[data-testid="dob"]'),
    checkbox: () => cy.get('input[data-testid="practice-checkbox"]'),
    submitButton: () => cy.get('button[data-testid="submit-button"]'),
    successMessage: () => cy.contains('Thanks for contacting us, we will never respond!'),
    errorMessage: (message) => cy.contains(message)
  };

  // Ações
  visit() {
    cy.visit('https://commitquality.com/');
    cy.navegarPara('practice');
    cy.get('div[data-testid="practice-contact-form"]').should('be.visible').click();
    cy.url().should('include', '/practice-contact-form');
  }

  fillName(name) {
    this.elements.nameInput().clear().type(name);
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email);
  }

  selectQueryType(queryType) {
    this.elements.queryTypeSelect().select(queryType);
  }

  fillDateOfBirth(date) {
    this.elements.dobInput().clear().type(date);
  }

  checkConsent() {
    this.elements.checkbox().check();
  }

  submit() {
    this.elements.submitButton().click();
  }

  clearAllFields() {
    this.elements.nameInput().clear();
    this.elements.emailInput().clear();
    this.elements.dobInput().clear();
  }

  // Validações
  validateSuccessMessage() {
    this.elements.successMessage().should('be.visible');
  }

  validateErrorMessage(message) {
    this.elements.errorMessage(message).should('be.visible');
  }

  validateNameRequired() {
    this.validateErrorMessage('Name is required');
  }

  validateEmailRequired() {
    this.validateErrorMessage('Email is required');
  }

  validateQueryTypeRequired() {
    this.validateErrorMessage('Query Type is required');
  }

  validateDobRequired() {
    this.validateErrorMessage('Date of Birth is required');
  }

  validateConsentRequired() {
    this.validateErrorMessage('Please check the box to confirm');
  }

  validateAllFieldsRequired() {
    this.validateNameRequired();
    this.validateEmailRequired();
    this.validateQueryTypeRequired();
    this.validateDobRequired();
    this.validateConsentRequired();
  }
}

export default ContactFormPage;
