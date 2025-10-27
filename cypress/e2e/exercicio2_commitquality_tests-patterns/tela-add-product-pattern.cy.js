// Teste com Design Patterns: Add Product
// Patterns aplicados: Page Object Model + Builder Pattern
// Autora: Lilian Kasprzak
// Analista de QA

import AddProductPage from '../../support/pages/AddProductPage';
import ProductBuilder from '../../support/builders/ProductBuilder';

describe('Funcionalidade: Adicionar Produto - Design Patterns', () => {
  const addProductPage = new AddProductPage();
  const productBuilder = new ProductBuilder();

  beforeEach(() => {
    addProductPage.visit();
  });

  it('Cenário 1: Validar layout da tela de adicionar produto', () => {
    addProductPage.validateAllFieldsExist();
  });

  it('Cenário 2: Adicionar produto completo com sucesso', () => {
    const product = productBuilder.buildCompleteProduct();

    addProductPage.fillProductName(product.name);
    addProductPage.fillPrice(product.price);
    addProductPage.fillDateStocked(product.dateStocked);
    addProductPage.submit();
  });

  it('Cenário 3: Validar campo obrigatório - Nome vazio', () => {
    const product = productBuilder.buildOnlyWithPrice();

    addProductPage.fillPrice(product.price);
    addProductPage.submit();
    addProductPage.validateUrl('/add-product');
  });

  it('Cenário 4: Validar campo obrigatório - Preço vazio', () => {
    const product = productBuilder.buildOnlyWithName();

    addProductPage.fillProductName(product.name);
    addProductPage.submit();
    addProductPage.validateUrl('/add-product');
  });

  it('Cenário 5: Validar campo obrigatório - Data vazia', () => {
    const product = new ProductBuilder()
      .withRandomName()
      .withRandomPrice()
      .build();

    addProductPage.fillProductName(product.name);
    addProductPage.fillPrice(product.price);
    addProductPage.submit();
    addProductPage.validateUrl('/add-product');
  });

  it('Cenário 6: Validar botão Cancel', () => {
    addProductPage.cancel();
    cy.url().should('eq', 'https://commitquality.com/');
  });

  it('Cenário 7: Preencher apenas nome do produto', () => {
    const product = productBuilder.buildOnlyWithName();

    addProductPage.fillProductName(product.name);
    addProductPage.clearPrice();
    addProductPage.clearDateStocked();
    addProductPage.submit();
    addProductPage.validateUrl('/add-product');
  });

  it('Cenário 8: Preencher apenas preço do produto', () => {
    const product = productBuilder.buildOnlyWithPrice();

    addProductPage.clearProductName();
    addProductPage.fillPrice(product.price);
    addProductPage.clearDateStocked();
    addProductPage.submit();
    addProductPage.validateUrl('/add-product');
  });

  it('Cenário 9: Preencher apenas data do produto', () => {
    const product = productBuilder.buildOnlyWithDate();

    addProductPage.clearProductName();
    addProductPage.clearPrice();
    addProductPage.fillDateStocked(product.dateStocked);
    addProductPage.submit();
    addProductPage.validateUrl('/add-product');
  });
});
