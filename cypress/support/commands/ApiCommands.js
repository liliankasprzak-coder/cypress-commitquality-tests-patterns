// Command Pattern - Comandos de API
// Criado em: 21/10/2025
// Autor: Lilian

class ApiCommand {
  execute() {
    throw new Error('Método execute deve ser implementado');
  }
}

class GetCommand extends ApiCommand {
  constructor(endpoint, baseUrl = 'https://jsonplaceholder.typicode.com') {
    super();
    this.endpoint = endpoint;
    this.baseUrl = baseUrl;
  }

  execute() {
    const startTime = Date.now();
    return cy.request('GET', `${this.baseUrl}${this.endpoint}`)
             .then(response => ({ response, startTime }));
  }
}

class PostCommand extends ApiCommand {
  constructor(endpoint, data, baseUrl = 'https://jsonplaceholder.typicode.com') {
    super();
    this.endpoint = endpoint;
    this.data = data;
    this.baseUrl = baseUrl;
  }

  execute() {
    const startTime = Date.now();
    return cy.request('POST', `${this.baseUrl}${this.endpoint}`, this.data)
             .then(response => ({ response, startTime }));
  }
}

class PutCommand extends ApiCommand {
  constructor(endpoint, data, baseUrl = 'https://jsonplaceholder.typicode.com') {
    super();
    this.endpoint = endpoint;
    this.data = data;
    this.baseUrl = baseUrl;
  }

  execute() {
    const startTime = Date.now();
    return cy.request('PUT', `${this.baseUrl}${this.endpoint}`, this.data)
             .then(response => ({ response, startTime }));
  }
}

class DeleteCommand extends ApiCommand {
  constructor(endpoint, baseUrl = 'https://jsonplaceholder.typicode.com') {
    super();
    this.endpoint = endpoint;
    this.baseUrl = baseUrl;
  }

  execute() {
    const startTime = Date.now();
    return cy.request('DELETE', `${this.baseUrl}${this.endpoint}`)
             .then(response => ({ response, startTime }));
  }
}

// Invoker - Executor de comandos
class ApiExecutor {
  constructor() {
    this.commands = [];
  }

  addCommand(command) {
    this.commands.push(command);
    return this;
  }

  execute() {
    if (this.commands.length === 1) {
      return this.commands[0].execute();
    }
    // Para múltiplos comandos
    return Promise.all(this.commands.map(cmd => cmd.execute()));
  }

  // Factory methods fluentes
  get(endpoint) {
    return this.addCommand(new GetCommand(endpoint));
  }

  post(endpoint, data) {
    return this.addCommand(new PostCommand(endpoint, data));
  }

  put(endpoint, data) {
    return this.addCommand(new PutCommand(endpoint, data));
  }

  delete(endpoint) {
    return this.addCommand(new DeleteCommand(endpoint));
  }
}

// Factory method
function createApiExecutor() {
  return new ApiExecutor();
}

module.exports = { 
  GetCommand, 
  PostCommand, 
  PutCommand, 
  DeleteCommand, 
  ApiExecutor, 
  createApiExecutor 
};