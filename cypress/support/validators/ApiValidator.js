// Strategy Pattern - Estratégias de validação
// Criado em: 21/10/2025
// Autor: Lilian

class ValidationStrategy {
  validate(response) {
    throw new Error('Método validate deve ser implementado');
  }
}

class StatusCodeValidation extends ValidationStrategy {
  constructor(expectedStatus = 200) {
    super();
    this.expectedStatus = expectedStatus;
  }

  validate(response) {
    expect(response.status).to.equal(this.expectedStatus);
    cy.log(`Status Code: ${response.status}`);
  }
}

class ResponseTimeValidation extends ValidationStrategy {
  constructor(maxTime = 500) {
    super();
    this.maxTime = maxTime;
  }

  validate(response, startTime) {
    const responseTime = Date.now() - startTime;
    expect(responseTime).to.be.lessThan(this.maxTime);
    cy.log(`Tempo de resposta: ${responseTime}ms`);
  }
}

class SchemaValidation extends ValidationStrategy {
  constructor(schema, validateFunction) {
    super();
    this.schema = schema;
    this.validateFunction = validateFunction;
  }

  validate(response) {
    this.validateFunction(this.schema, response.body);
    cy.log(`Schema validado com sucesso`);
  }
}

class ArrayValidation extends ValidationStrategy {
  validate(response) {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    cy.log(`Array com ${response.body.length} itens`);
  }
}

// Context para usar as estratégias
class ApiValidator {
  constructor() {
    this.strategies = [];
  }

  addValidation(strategy) {
    this.strategies.push(strategy);
    return this;
  }

  validate(response, startTime = null) {
    this.strategies.forEach(strategy => {
      if (strategy instanceof ResponseTimeValidation && startTime) {
        strategy.validate(response, startTime);
      } else {
        strategy.validate(response);
      }
    });
    return this;
  }

  // Métodos fluentes para adicionar validações
  validateStatus(expectedStatus = 200) {
    return this.addValidation(new StatusCodeValidation(expectedStatus));
  }

  validateResponseTime(maxTime = 500) {
    return this.addValidation(new ResponseTimeValidation(maxTime));
  }

  validateSchema(schema, validateFunction) {
    return this.addValidation(new SchemaValidation(schema, validateFunction));
  }

  validateArray() {
    return this.addValidation(new ArrayValidation());
  }
}

// Factory method
function createValidator() {
  return new ApiValidator();
}

module.exports = { 
  ApiValidator, 
  StatusCodeValidation, 
  ResponseTimeValidation, 
  SchemaValidation, 
  ArrayValidation,
  createValidator 
};