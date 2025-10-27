// Teste com Design Patterns: Contact Form
// Patterns aplicados: Page Object Model + Builder Pattern
// Autora: Lilian Kasprzak
// Analista de QA

import ContactFormPage from '../../support/pages/ContactFormPage';
import ContactFormBuilder from '../../support/builders/ContactFormBuilder';

describe('Funcionalidade: Contact Form - Design Patterns', () => {
  const contactFormPage = new ContactFormPage();
  const contactBuilder = new ContactFormBuilder();

  beforeEach(() => {
    contactFormPage.visit();
  });

  it('Cenário 1: Submeter formulário vazio', () => {
    contactFormPage.submit();
    contactFormPage.validateAllFieldsRequired();
  });

  it('Cenário 2: Preencher apenas nome', () => {
    const contact = contactBuilder.buildOnlyWithName();

    contactFormPage.fillName(contact.name);
    contactFormPage.submit();
    
    contactFormPage.validateEmailRequired();
    contactFormPage.validateQueryTypeRequired();
    contactFormPage.validateDobRequired();
    contactFormPage.validateConsentRequired();
  });

  it('Cenário 3: Preencher apenas email', () => {
    const contact = contactBuilder.buildOnlyWithEmail();

    contactFormPage.fillEmail(contact.email);
    contactFormPage.submit();
    
    contactFormPage.validateNameRequired();
    contactFormPage.validateQueryTypeRequired();
    contactFormPage.validateDobRequired();
    contactFormPage.validateConsentRequired();
  });

  it('Cenário 4: Preencher apenas data de nascimento', () => {
    const contact = contactBuilder.buildOnlyWithDateOfBirth();

    contactFormPage.fillDateOfBirth(contact.dateOfBirth);
    contactFormPage.submit();
    
    contactFormPage.validateNameRequired();
    contactFormPage.validateEmailRequired();
    contactFormPage.validateQueryTypeRequired();
    contactFormPage.validateConsentRequired();
  });

  it('Cenário 5: Preencher apenas query type', () => {
    const contact = contactBuilder.buildOnlyWithQueryType();

    contactFormPage.selectQueryType(contact.queryType);
    contactFormPage.submit();
    
    contactFormPage.validateNameRequired();
    contactFormPage.validateEmailRequired();
    contactFormPage.validateDobRequired();
    contactFormPage.validateConsentRequired();
  });

  it('Cenário 6: Preencher apenas checkbox', () => {
    contactFormPage.checkConsent();
    contactFormPage.submit();
    
    contactFormPage.validateNameRequired();
    contactFormPage.validateEmailRequired();
    contactFormPage.validateQueryTypeRequired();
    contactFormPage.validateDobRequired();
  });

  it('Cenário 7: Preencher todos os campos e submeter com sucesso', () => {
    const contact = contactBuilder.buildCompleteContact();

    contactFormPage.fillName(contact.name);
    contactFormPage.fillEmail(contact.email);
    contactFormPage.selectQueryType(contact.queryType);
    contactFormPage.fillDateOfBirth(contact.dateOfBirth);
    contactFormPage.checkConsent();
    contactFormPage.submit();
    
    contactFormPage.validateSuccessMessage();
  });

  it('Cenário 8: Validar preenchimento com dados específicos', () => {
    const contact = new ContactFormBuilder()
      .withName('Maria Santos')
      .withEmail('maria@email.com')
      .withQueryType('General')
      .withDateOfBirth('1990-05-15')
      .withConsent()
      .build();

    contactFormPage.fillName(contact.name);
    contactFormPage.fillEmail(contact.email);
    contactFormPage.selectQueryType(contact.queryType);
    contactFormPage.fillDateOfBirth(contact.dateOfBirth);
    contactFormPage.checkConsent();
    contactFormPage.submit();
    
    contactFormPage.validateSuccessMessage();
  });
});
