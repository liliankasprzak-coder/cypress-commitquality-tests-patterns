// Page Object Model - Tela de Login
// Criado em: 21/10/2025
// Autor: Lilian

class LoginPage {
  // Seletores encapsulados
  get usernameField() { return 'input[type="text"], input[name*="user"], input[placeholder*="user"]'; }
  get passwordField() { return 'input[type="password"], input[name*="pass"], input[placeholder*="pass"]'; }
  get loginButton() { return 'button[type="submit"], input[type="submit"], button:contains("Login")'; }
  get errorMessage() { return '.error, .alert, [class*="error"]'; }
  
  // Métodos de ação
  visit() {
    // Navegar para Home primeiro e depois clicar em Login
    cy.visitCommitQuality();
    cy.wait(800);
    
    // Procurar e clicar no link Login
    cy.get('body').then($body => {
      const loginLinks = $body.find('a:contains("Login"), [href*="login"], .login, #login');
      if (loginLinks.length > 0) {
        cy.wrap(loginLinks.first()).click();
        cy.wait(1000);
      }
    });
    
    return this;
  }

  fillUsername(username) {
    cy.get(this.usernameField).clear().type(username);
    return this;
  }

  fillPassword(password) {
    cy.get(this.passwordField).clear().type(password);
    return this;
  }

  clickLogin() {
    cy.get(this.loginButton).click();
    return this;
  }

  // Método fluente para login completo
  login(username, password) {
    return this.fillUsername(username)
               .fillPassword(password)
               .clickLogin();
  }

  // Verificações
  shouldHaveErrorMessage() {
    cy.get(this.errorMessage).should('be.visible');
    return this;
  }

  shouldBeOnLoginPage() {
    cy.url().should('include', '/login');
    return this;
  }
}

export default LoginPage;