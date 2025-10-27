// Observer Pattern - Eventos de UI
// Criado em: 21/10/2025
// Autor: Lilian

class UIEventObserver {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
    return this;
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
    return this;
  }

  notify(event, data) {
    this.observers.forEach(observer => {
      if (observer.update) {
        observer.update(event, data);
      }
    });
    return this;
  }
}

// Observadores específicos
class LoginAttemptObserver {
  update(event, data) {
    if (event === 'login_attempt') {
      cy.log(`Tentativa de login: ${data.username}`);
    }
  }
}

class NavigationObserver {
  update(event, data) {
    if (event === 'navigation') {
      cy.log(`Navegação para: ${data.url}`);
    }
  }
}

class FormInteractionObserver {
  update(event, data) {
    if (event === 'form_fill') {
      cy.log(`Preenchendo campo: ${data.field} = ${data.value}`);
    }
  }
}

class ErrorObserver {
  update(event, data) {
    if (event === 'error') {
      cy.log(`Erro detectado: ${data.message}`);
    }
  }
}

// Factory para criar observador completo
class UIObserverFactory {
  static createCompleteObserver() {
    const eventObserver = new UIEventObserver();
    
    eventObserver
      .addObserver(new LoginAttemptObserver())
      .addObserver(new NavigationObserver())
      .addObserver(new FormInteractionObserver())
      .addObserver(new ErrorObserver());

    return eventObserver;
  }
}

// Comandos Cypress que usam o observer
Cypress.Commands.add('observedLogin', (username, password) => {
  const observer = UIObserverFactory.createCompleteObserver();
  
  observer.notify('login_attempt', { username });
  observer.notify('form_fill', { field: 'username', value: username });
  observer.notify('form_fill', { field: 'password', value: '***' });
  
  cy.get('input[type="text"]').type(username);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('observedNavigation', (url) => {
  const observer = UIObserverFactory.createCompleteObserver();
  observer.notify('navigation', { url });
  cy.visit(url);
});

export { UIEventObserver, UIObserverFactory, LoginAttemptObserver, NavigationObserver };