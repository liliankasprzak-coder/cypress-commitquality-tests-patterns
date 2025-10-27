// Testes com Design Patterns: Data Layer - Visualização de Produto
// Autora: Lilian Kasprzak
// Patterns: Builder, Factory, Strategy

const { createProduct } = require('../../support/builders/EcommerceProductBuilder');
const { createDataLayerEventFactory } = require('../../support/factories/DataLayerEventFactory');
const { createDataLayerValidator } = require('../../support/validators/DataLayerValidator');

describe('Data Layer: Visualização de Produto (Design Patterns)', () => {
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

  it('Cenário 1: Visualizar produto usando Builder e Factory', () => {
    // Criar produto Notebook usando Builder preset
    const notebook = createProduct().asNotebook().build();

    cy.window().then((win) => {
      // Usar Factory para criar evento view_item
      const event = eventFactory.createViewItemEvent(notebook);
      win.dataLayer.push(event);

      // Validar usando Strategy Pattern
      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      validator.validateViewItemEvent().validate(lastEvent);
    });
  });

  it('Cenário 2: Validar campos obrigatórios com Strategy Pattern', () => {
    const product = createProduct().asSmartphone().build();

    cy.window().then((win) => {
      const event = eventFactory.createViewItemEvent(product);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar campos obrigatórios
      createDataLayerValidator()
        .validateRequiredFields([
          'event',
          'ecommerce.currency',
          'ecommerce.value',
          'ecommerce.items'
        ])
        .validate(lastEvent);
    });
  });

  it('Cenário 3: Visualizar lista de produtos com múltiplos Builders', () => {
    // Criar 3 produtos usando presets
    const keyboard = createProduct().asKeyboard().build();
    const headset = createProduct().asHeadset().build();
    const webcam = createProduct().asWebcam().build();

    const products = [keyboard, headset, webcam];

    cy.window().then((win) => {
      // Usar Factory para criar view_item_list
      const event = eventFactory.createViewItemListEvent(products);
      win.dataLayer.push(event);

      // Validar evento e estrutura
      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      createDataLayerValidator()
        .validateEventName('view_item_list')
        .validateItemsCount(3)
        .validateItemsStructure()
        .validate(lastEvent);
    });
  });

  it('Cenário 4: Customizar produto com Builder fluente', () => {
    // Criar produto customizado
    const customProduct = createProduct()
      .withId('PROD-999')
      .withName('Monitor 4K')
      .withPrice(1299.90)
      .withCategory('Monitores')
      .withBrand('LG')
      .build();

    cy.window().then((win) => {
      const event = eventFactory.createViewItemEvent(customProduct);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar valores customizados
      expect(lastEvent.ecommerce.items[0].item_id).to.equal('PROD-999');
      expect(lastEvent.ecommerce.items[0].item_name).to.equal('Monitor 4K');
      expect(lastEvent.ecommerce.items[0].price).to.equal(1299.90);
      expect(lastEvent.ecommerce.items[0].item_category).to.equal('Monitores');
      expect(lastEvent.ecommerce.items[0].item_brand).to.equal('LG');
    });
  });

  it('Cenário 5: Validar campos específicos de produto', () => {
    const smartphone = createProduct().asSmartphone().build();

    cy.window().then((win) => {
      const event = eventFactory.createViewItemEvent(smartphone);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar campos específicos usando validator
      createDataLayerValidator()
        .validateFieldValue('ecommerce.items[0].item_id', 'PROD-010')
        .validateFieldValue('ecommerce.items[0].item_name', 'Smartphone Samsung')
        .validateFieldValue('ecommerce.items[0].price', 499.90)
        .validate(lastEvent);
    });
  });

  it('Cenário 6: Usar todos os presets de produtos', () => {
    const presets = [
      { method: 'asSmartphone', expectedId: 'PROD-010', expectedName: 'Smartphone Samsung', expectedPrice: 499.90 },
      { method: 'asNotebook', expectedId: 'PROD-001', expectedName: 'Notebook Dell', expectedPrice: 299.90 },
      { method: 'asMouse', expectedId: 'PROD-002', expectedName: 'Mouse Gamer', expectedPrice: 150.00 },
      { method: 'asKeyboard', expectedId: 'PROD-003', expectedName: 'Teclado Mecânico', expectedPrice: 350.00 },
      { method: 'asHeadset', expectedId: 'PROD-004', expectedName: 'Headset Gamer', expectedPrice: 280.00 },
      { method: 'asWebcam', expectedId: 'PROD-005', expectedName: 'Webcam HD', expectedPrice: 180.00 }
    ];

    cy.window().then((win) => {
      presets.forEach(({ method, expectedId, expectedName, expectedPrice }) => {
        const product = createProduct()[method]().build();
        const event = eventFactory.createViewItemEvent(product);
        win.dataLayer.push(event);

        const lastEvent = win.dataLayer[win.dataLayer.length - 1];
        
        // Validar estrutura e valores
        expect(lastEvent.event).to.equal('view_item');
        expect(lastEvent.ecommerce.items[0].item_id).to.equal(expectedId);
        expect(lastEvent.ecommerce.items[0].item_name).to.equal(expectedName);
        expect(lastEvent.ecommerce.value).to.equal(expectedPrice);
      });
    });
  });

  it('Cenário 7: Validar moeda do evento view_item', () => {
    const product = createProduct().asNotebook().build();

    cy.window().then((win) => {
      const event = eventFactory.createViewItemEvent(product);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar moeda
      createDataLayerValidator()
        .validateCurrency('BRL')
        .validate(lastEvent);
      
      expect(lastEvent.ecommerce).to.have.property('currency');
      expect(lastEvent.ecommerce.currency).to.equal('BRL');
    });
  });

  it('Cenário 8: Encadear validações múltiplas', () => {
    const products = [
      createProduct().asKeyboard().build(),
      createProduct().asHeadset().build(),
      createProduct().asWebcam().build()
    ];

    cy.window().then((win) => {
      const event = eventFactory.createViewItemListEvent(products);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validações encadeadas
      createDataLayerValidator()
        .validateEventName('view_item_list')
        .validateItemsCount(3)
        .validateItemsStructure()
        .validate(lastEvent);
    });
  });

  it('Cenário 9: Validar valor do produto no evento', () => {
    const product = createProduct()
      .withId('PROD-TEST')
      .withName('Produto Teste')
      .withPrice(299.90)
      .build();

    cy.window().then((win) => {
      const event = eventFactory.createViewItemEvent(product);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      
      // Validar que o valor do evento é igual ao preço do produto
      createDataLayerValidator()
        .validateFieldValue('ecommerce.value', 299.90)
        .validate(lastEvent);
      
      expect(lastEvent.ecommerce.value).to.equal(product.price);
    });
  });

  it('Cenário 10: Combinar Builder com categoria e marca', () => {
    const notebook = createProduct().asNotebook().build();

    cy.window().then((win) => {
      const event = eventFactory.createViewItemEvent(notebook);
      win.dataLayer.push(event);

      const lastEvent = win.dataLayer[win.dataLayer.length - 1];
      const item = lastEvent.ecommerce.items[0];
      
      // Validar campos de categoria e marca do preset
      expect(item.item_category).to.equal('Eletrônicos');
      expect(item.item_category2).to.equal('Computadores');
      expect(item.item_brand).to.equal('Dell');
      
      // Confirmar que todos estão presentes
      expect(item).to.have.property('item_category');
      expect(item).to.have.property('item_category2');
      expect(item).to.have.property('item_brand');
    });
  });
});
