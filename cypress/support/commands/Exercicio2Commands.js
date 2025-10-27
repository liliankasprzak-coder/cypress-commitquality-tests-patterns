// Comandos customizados para testes do Exercício 2 - CommitQuality
// Autora: Lilian Kasprzak

const { faker } = require('@faker-js/faker');

// Comando para navegar para páginas específicas
Cypress.Commands.add('navegarPara', (pagina) => {
  const rotas = {
    'addproduct': '/add-product',
    'login': '/login',
    'practice': '/practice',
    'learn': '/learn',
    'products': '/practice-products'
  };

  const rota = rotas[pagina.toLowerCase()] || `/${pagina}`;
  cy.visit(`https://commitquality.com${rota}`);
});

// Comando para aguardar com delay visual
Cypress.Commands.add('waitDemo', (tempo = 500) => {
  cy.wait(tempo);
});

// Comando para testar responsividade
Cypress.Commands.add('testarResponsividade', (seletor) => {
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 1366, height: 768, name: 'Laptop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];

  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height);
    cy.get(seletor).should('be.visible');
  });
});

// Comando para obter elementos de forma flexível (por id, class, etc)
Cypress.Commands.add('getFlexivel', (seletor) => {
  // Tenta diferentes estratégias
  if (seletor.startsWith('#')) {
    return cy.get(seletor);
  } else if (seletor.startsWith('.')) {
    return cy.get(seletor);
  } else if (seletor.startsWith('[')) {
    return cy.get(seletor);
  } else {
    // Tenta como data-testid
    return cy.get(`[data-testid="${seletor}"]`).then($el => {
      if ($el.length === 0) {
        // Se não encontrar, tenta como tag
        return cy.get(seletor);
      }
      return cy.wrap($el);
    });
  }
});

// Comando para preencher produto com Faker
Cypress.Commands.add('preencherProdutoFaker', ($campo) => {
  const produto = faker.commerce.productName();
  cy.wrap($campo).clear().type(produto);
});

// Comando para preencher preço com Faker
Cypress.Commands.add('preencherPrecoFaker', ($campo) => {
  const preco = faker.commerce.price({ min: 10, max: 1000, dec: 2 });
  cy.wrap($campo).clear().type(preco);
});

// Comando para preencher nome com Faker
Cypress.Commands.add('preencherNomeFaker', ($campo) => {
  const nome = faker.person.fullName();
  cy.wrap($campo).clear().type(nome);
});

// Comando para preencher email com Faker
Cypress.Commands.add('preencherEmailFaker', ($campo) => {
  const email = faker.internet.email();
  cy.wrap($campo).clear().type(email);
});

// Comando para preencher telefone com Faker
Cypress.Commands.add('preencherTelefoneFaker', ($campo) => {
  const telefone = faker.phone.number('(##) #####-####');
  cy.wrap($campo).clear().type(telefone);
});

// Comando para preencher mensagem com Faker
Cypress.Commands.add('preencherMensagemFaker', ($campo) => {
  const mensagem = faker.lorem.paragraph();
  cy.wrap($campo).clear().type(mensagem);
});

// Comando para preencher usuário com Faker
Cypress.Commands.add('preencherUsuarioFaker', ($campo) => {
  const usuario = faker.internet.username ? faker.internet.username() : faker.internet.email().split('@')[0];
  cy.wrap($campo).clear().type(usuario);
});

// Comando para preencher senha com Faker
Cypress.Commands.add('preencherSenhaFaker', ($campo) => {
  const senha = faker.internet.password({ length: 10 });
  cy.wrap($campo).clear().type(senha);
});

// Comando para validar DataLayer
Cypress.Commands.add('validarDataLayer', (evento, propriedades = {}) => {
  cy.window().then((win) => {
    expect(win.dataLayer).to.exist;
    
    if (evento) {
      const eventosEncontrados = win.dataLayer.filter(item => item.event === evento);
      expect(eventosEncontrados.length).to.be.greaterThan(0);
      
      if (Object.keys(propriedades).length > 0) {
        const ultimoEvento = eventosEncontrados[eventosEncontrados.length - 1];
        Object.keys(propriedades).forEach(key => {
          expect(ultimoEvento[key]).to.equal(propriedades[key]);
        });
      }
    }
  });
});

module.exports = {};
