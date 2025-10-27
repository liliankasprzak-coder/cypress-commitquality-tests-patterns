// Singleton Pattern - Configuração global
// Criado em: 21/10/2025
// Autor: Lilian

class TestConfig {
  constructor() {
    if (TestConfig.instance) {
      return TestConfig.instance;
    }

    this.config = {
      apiBaseUrl: 'https://jsonplaceholder.typicode.com',
      webBaseUrl: 'https://commitquality.com',
      timeout: 10000,
      responseTimeout: 500,
      retries: 2,
      browser: 'chrome',
      viewport: {
        width: 1280,
        height: 720
      }
    };

    TestConfig.instance = this;
    return this;
  }

  // Getters para configurações
  getApiBaseUrl() {
    return this.config.apiBaseUrl;
  }

  getWebBaseUrl() {
    return this.config.webBaseUrl;
  }

  getTimeout() {
    return this.config.timeout;
  }

  getResponseTimeout() {
    return this.config.responseTimeout;
  }

  getRetries() {
    return this.config.retries;
  }

  getViewport() {
    return this.config.viewport;
  }

  // Setters para alterar configurações
  setApiBaseUrl(url) {
    this.config.apiBaseUrl = url;
    return this;
  }

  setResponseTimeout(timeout) {
    this.config.responseTimeout = timeout;
    return this;
  }

  setViewport(width, height) {
    this.config.viewport = { width, height };
    return this;
  }

  // Método para ambiente de teste
  setEnvironment(env) {
    switch (env) {
      case 'dev':
        this.config.apiBaseUrl = 'https://dev-api.example.com';
        break;
      case 'staging':
        this.config.apiBaseUrl = 'https://staging-api.example.com';
        break;
      case 'prod':
        this.config.apiBaseUrl = 'https://jsonplaceholder.typicode.com';
        break;
    }
    return this;
  }

  // Reset para valores padrão
  reset() {
    this.config = {
      apiBaseUrl: 'https://jsonplaceholder.typicode.com',
      webBaseUrl: 'https://commitquality.com',
      timeout: 10000,
      responseTimeout: 500,
      retries: 2,
      browser: 'chrome',
      viewport: { width: 1280, height: 720 }
    };
    return this;
  }
}

// Factory method para garantir singleton
function getTestConfig() {
  return new TestConfig();
}

module.exports = { TestConfig, getTestConfig };