// Testes com Design Patterns: Data Layer - Carrinho e Compra
// Autora: Lilian Kasprzak
// Patterns: Builder, Factory, Strategy

const { createProduct } = require('../../support/builders/EcommerceProductBuilder');
const { createDataLayerEventFactory } = require('../../support/factories/DataLayerEventFactory');
const { createDataLayerValidator } = require('../../support/validators/DataLayerValidator');

describe('Data Layer: Carrinho e Compra (Design Patterns)', () => {
  let eventFactory;
  let validator;

  beforeEach(() => {
    // Inicializar Factory e Validator
    eventFactory = createDataLayerEventFactory();
    validator = createDataLayerValidator();

    // Mock do data layer
    cy.visit('https://commitquality.com/', {
      onBeforeLoad(win) {
        win.dataLayer = [];
      }
    });
  });

  it('Cenário 1: Adicionar produto ao carrinho usando Builder Pattern', () => {
    // Criar produto usando Builder
    const product = createProduct().asSmartphone().build();

    cy.window().then((win) => {
      // Usar Factory para criar evento
      const event = eventFactory.createAddToCartEvent(product);
      win.dataLayer.push(event);

      // Validar usando Strategy Pattern
      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      validator.validateAddToCartEvent().validate(lastEvent);
    });
  });

  it('Cenário 2: Remover produto do carrinho com Factory Pattern', () => {
    // Criar produto Mouse usando preset
    const mouse = createProduct().asMouse().build();

    cy.window().then((win) => {
      // Usar Factory para criar evento remove_from_cart
      const event = eventFactory.createRemoveFromCartEvent(mouse);
      win.dataLayer.push(event);

      // Validar evento
      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      createDataLayerValidator()
        .validateEventName('remove_from_cart')
        .validateCurrency('BRL')
        .validateFieldValue('ecommerce.value', 150.00)
        .validateFieldValue('ecommerce.items[0].item_id', 'PROD-002')
        .validate(lastEvent);
    });
  });

  it('Cenário 3: Iniciar checkout com múltiplos produtos usando Builders', () => {
    // Criar 3 produtos diferentes
    const smartphone = createProduct().asSmartphone().build();
    const notebook = createProduct().asNotebook().build();
    const keyboard = createProduct().asKeyboard().build();

    const items = [smartphone, notebook, keyboard];

    cy.window().then((win) => {
      // Usar Factory para criar begin_checkout
      const event = eventFactory.createBeginCheckoutEvent(items);
      win.dataLayer.push(event);

      // Validações encadeadas
      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      createDataLayerValidator()
        .validateEventName('begin_checkout')
        .validateItemsCount(3)
        .validateCalculatedTotal()
        .validateItemsStructure()
        .validate(lastEvent);
    });
  });

  it('Cenário 4: Finalizar compra usando Factory Pattern completo', () => {
    // Criar produtos
    const smartphone = createProduct().asSmartphone().build();
    const notebook = createProduct().asNotebook().build();
    const keyboard = createProduct().asKeyboard().build();

    // Dados da transação
    const transactionData = {
      transactionId: 'TXN-2025-001',
      affiliation: 'Loja Online',
      items: [smartphone, notebook, keyboard],
      tax: 124.97,
      shipping: 50.00
    };

    cy.window().then((win) => {
      // Criar evento purchase com Factory
      const event = eventFactory.createPurchaseEvent(transactionData);
      win.dataLayer.push(event);

      // Validar evento completo
      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      createDataLayerValidator()
        .validatePurchaseEvent()
        .validateFieldValue('ecommerce.transaction_id', 'TXN-2025-001')
        .validateFieldValue('ecommerce.tax', 124.97)
        .validateFieldValue('ecommerce.shipping', 50.00)
        .validate(lastEvent);
    });
  });

  it('Cenário 5: Validar campos obrigatórios usando Strategy Pattern', () => {
    const product = createProduct().asNotebook().build();
    
    const transactionData = {
      transactionId: 'TXN-2025-002',
      items: [product],
      tax: 29.99,
      shipping: 15.00
    };

    cy.window().then((win) => {
      const event = eventFactory.createPurchaseEvent(transactionData);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar campos obrigatórios específicos
      createDataLayerValidator()
        .validateRequiredFields([
          'event',
          'ecommerce.transaction_id',
          'ecommerce.value',
          'ecommerce.currency',
          'ecommerce.items'
        ])
        .validate(lastEvent);

      // Validar item_id do primeiro item
      expect(lastEvent.ecommerce.items[0]).to.have.property('item_id');
    });
  });

  it('Cenário 6: Calcular valor total automaticamente com Builder', () => {
    // Criar produtos com quantidades específicas
    const product1 = createProduct()
      .withId('PROD-001')
      .withName('Produto 1')
      .withPrice(499.90)
      .withQuantity(2)
      .build();

    const product2 = createProduct()
      .withId('PROD-002')
      .withName('Produto 2')
      .withPrice(150.00)
      .withQuantity(3)
      .build();

    const product3 = createProduct()
      .withId('PROD-003')
      .withName('Produto 3')
      .withPrice(350.00)
      .withQuantity(1)
      .build();

    cy.window().then((win) => {
      const event = eventFactory.createBeginCheckoutEvent([product1, product2, product3]);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar valor total calculado (499.90*2 + 150.00*3 + 350.00*1 = 1799.80)
      createDataLayerValidator()
        .validateFieldValue('ecommerce.value', 1799.80)
        .validateCalculatedTotal()
        .validate(lastEvent);
    });
  });

  it('Cenário 7: Validar estrutura de items com Strategy Pattern', () => {
    const product = createProduct()
      .asSmartphone()
      .withQuantity(2)
      .build();

    cy.window().then((win) => {
      const event = eventFactory.createAddToCartEvent(product);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar estrutura completa de items
      createDataLayerValidator()
        .validateItemsStructure(['item_id', 'item_name', 'price', 'quantity'])
        .validate(lastEvent);
    });
  });

  it('Cenário 8: Usar presets de produtos do Builder', () => {
    const presets = [
      { method: 'asSmartphone', expected: { id: 'PROD-010', name: 'Smartphone Samsung' } },
      { method: 'asNotebook', expected: { id: 'PROD-001', name: 'Notebook Dell' } },
      { method: 'asMouse', expected: { id: 'PROD-002', name: 'Mouse Gamer' } },
      { method: 'asKeyboard', expected: { id: 'PROD-003', name: 'Teclado Mecânico' } }
    ];

    presets.forEach(({ method, expected }) => {
      const product = createProduct()[method]().build();
      
      expect(product.item_id).to.equal(expected.id);
      expect(product.item_name).to.equal(expected.name);
      expect(product).to.have.property('price');
      expect(product).to.have.property('item_category');
    });
  });

  it('Cenário 9: Encadear validações com Strategy Pattern', () => {
    const items = [
      createProduct().asSmartphone().build(),
      createProduct().asNotebook().build(),
      createProduct().asKeyboard().build()
    ];

    const transactionData = {
      transactionId: 'TXN-2025-003',
      items: items,
      tax: 99.99,
      shipping: 25.00
    };

    cy.window().then((win) => {
      const event = eventFactory.createPurchaseEvent(transactionData);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validações encadeadas fluentemente
      createDataLayerValidator()
        .validateEventName('purchase')
        .validateCurrency('BRL')
        .validateItemsCount(3)
        .validateCalculatedTotal()
        .validateRequiredFields(['ecommerce.transaction_id', 'ecommerce.tax', 'ecommerce.shipping'])
        .validate(lastEvent);
    });
  });

  it('Cenário 10: Customizar produto com Builder fluente', () => {
    // Criar produto totalmente customizado
    const customProduct = createProduct()
      .withId('PROD-CUSTOM')
      .withName('Produto Customizado')
      .withPrice(999.99)
      .withQuantity(2)
      .withBrand('Marca X')
      .withCategory('Categoria Y')
      .build();

    cy.window().then((win) => {
      const event = eventFactory.createAddToCartEvent(customProduct);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar valores customizados
      expect(lastEvent.ecommerce.items[0].item_id).to.equal('PROD-CUSTOM');
      expect(lastEvent.ecommerce.items[0].item_name).to.equal('Produto Customizado');
      expect(lastEvent.ecommerce.items[0].price).to.equal(999.99);
      expect(lastEvent.ecommerce.items[0].quantity).to.equal(2);
      expect(lastEvent.ecommerce.items[0].item_brand).to.equal('Marca X');
    });
  });
});
