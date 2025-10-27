// Chain of Responsibility Pattern - Validações Web
// Criado em: 21/10/2025
// Autor: Lilian

class WebValidationHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  handle(element, options = {}) {
    if (this.canHandle(element, options)) {
      return this.doHandle(element, options);
    } else if (this.nextHandler) {
      return this.nextHandler.handle(element, options);
    }
    throw new Error('Nenhum handler pode processar esta validação');
  }

  canHandle(element, options) {
    return false;
  }

  doHandle(element, options) {
    throw new Error('Método doHandle deve ser implementado');
  }
}

class VisibilityValidation extends WebValidationHandler {
  canHandle(element, options) {
    return options.type === 'visibility';
  }

  doHandle(element, options) {
    cy.get(element).should('be.visible');
    cy.log(`Elemento ${element} está visível`);
    return this;
  }
}

class TextValidation extends WebValidationHandler {
  canHandle(element, options) {
    return options.type === 'text' && options.expectedText;
  }

  doHandle(element, options) {
    cy.get(element).should('contain.text', options.expectedText);
    cy.log(`Texto "${options.expectedText}" encontrado em ${element}`);
    return this;
  }
}

class UrlValidation extends WebValidationHandler {
  canHandle(element, options) {
    return options.type === 'url' && options.expectedUrl;
  }

  doHandle(element, options) {
    cy.url().should('include', options.expectedUrl);
    cy.log(`URL contém: ${options.expectedUrl}`);
    return this;
  }
}

class AttributeValidation extends WebValidationHandler {
  canHandle(element, options) {
    return options.type === 'attribute' && options.attribute;
  }

  doHandle(element, options) {
    if (options.expectedValue) {
      cy.get(element).should('have.attr', options.attribute, options.expectedValue);
    } else {
      cy.get(element).should('have.attr', options.attribute);
    }
    cy.log(`Atributo ${options.attribute} validado em ${element}`);
    return this;
  }
}

// Factory para criar a cadeia
class WebValidationChain {
  static create() {
    const visibility = new VisibilityValidation();
    const text = new TextValidation();
    const url = new UrlValidation();
    const attribute = new AttributeValidation();

    visibility.setNext(text).setNext(url).setNext(attribute);

    return visibility;
  }

  static validate(element, options) {
    const chain = this.create();
    return chain.handle(element, options);
  }
}

export { WebValidationChain, VisibilityValidation, TextValidation, UrlValidation, AttributeValidation };