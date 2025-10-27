// Page Object Model - Tela Learn
// Criado em: 21/10/2025
// Autor: Lilian

class LearnPage {
  // Seletores
  get learnLink() { return 'a[href*="learn"], a:contains("Learn")'; }
  get navigationMenu() { return 'nav, .menu, .navigation'; }
  get homeLink() { return 'a[href="/"], a:contains("Home")'; }
  get practiceLink() { return 'a[href*="practice"], a:contains("Practice")'; }

  // Métodos de navegação
  visit() {
    // Apenas navegar para a página inicial, sem clicar em Learn automaticamente
    cy.visitCommitQuality();
    cy.wait(800);
    return this;
  }

  visitLearnPage() {
    // Método separado para navegar diretamente para Learn
    cy.visitCommitQuality();
    cy.wait(800);
    
    // Procurar e clicar no link Learn
    cy.get('body').then($body => {
      const learnLinks = $body.find('a:contains("Learn"), [href*="learn"], .learn, #learn');
      if (learnLinks.length > 0) {
        cy.wrap(learnLinks.first()).click();
        cy.wait(1000);
      }
    });
    
    return this;
  }

  clickLearnLink() {
    cy.get(this.learnLink).click();
    return this;
  }

  clickHomeLink() {
    cy.get(this.homeLink).click();
    return this;
  }

  clickPracticeLink() {
    cy.get(this.practiceLink).click();
    return this;
  }

  // Verificações
  shouldRedirectToYouTube() {
    cy.url().should('include', 'youtube.com/@commitquality');
    return this;
  }

  shouldBeOnHomePage() {
    cy.url().should('include', 'commitquality.com');
    cy.url().should('not.include', '/login');
    return this;
  }

  shouldHaveNavigationMenu() {
    cy.get(this.navigationMenu).should('be.visible');
    return this;
  }

  // Verificar se elementos estão visíveis
  shouldHaveLearnLink() {
    cy.get(this.learnLink).should('be.visible').should('contain.text', 'Learn');
    return this;
  }
}

export default LearnPage;