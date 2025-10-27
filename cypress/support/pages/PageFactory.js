// Factory Pattern - Fábrica de páginas
// Criado em: 21/10/2025
// Autor: Lilian

import LoginPage from './LoginPage.js';
import LearnPage from './LearnPage.js';

class PageFactory {
  static createPage(pageType) {
    switch (pageType.toLowerCase()) {
      case 'login':
        return new LoginPage();
      case 'learn':
        return new LearnPage();
      default:
        throw new Error(`Tipo de página desconhecido: ${pageType}`);
    }
  }

  // Métodos de conveniência
  static loginPage() {
    return this.createPage('login');
  }

  static learnPage() {
    return this.createPage('learn');
  }

  // Método para múltiplas páginas
  static createPages(pageTypes) {
    return pageTypes.map(type => this.createPage(type));
  }
}

// Função helper para facilitar uso
function createPage(pageType) {
  return PageFactory.createPage(pageType);
}

export { PageFactory, createPage };