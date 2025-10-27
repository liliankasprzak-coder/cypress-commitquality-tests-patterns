// Builder Pattern - Construtor de dados de teste
// Criado em: 21/10/2025
// Autor: Lilian

const { faker } = require('@faker-js/faker');
faker.locale = 'pt_BR';

class TestDataBuilder {
  constructor() {
    this.data = {};
  }

  // Métodos para construir usuário
  withUsername(username = faker.internet.username()) {
    this.data.username = username;
    return this;
  }

  withEmail(email = faker.internet.email()) {
    this.data.email = email;
    return this;
  }

  withPassword(password = faker.internet.password(12)) {
    this.data.password = password;
    return this;
  }

  withFullName(name = faker.person.fullName()) {
    this.data.fullName = name;
    return this;
  }

  // Métodos para construir post
  withPostTitle(title = faker.lorem.sentence()) {
    this.data.title = title;
    return this;
  }

  withPostBody(body = faker.lorem.paragraphs(2)) {
    this.data.body = body;
    return this;
  }

  withUserId(userId = faker.number.int({ min: 1, max: 10 })) {
    this.data.userId = userId;
    return this;
  }

  // Presets comuns
  asValidUser() {
    return this.withUsername()
               .withEmail()
               .withPassword()
               .withFullName();
  }

  asValidPost() {
    return this.withPostTitle()
               .withPostBody()
               .withUserId();
  }

  asInvalidUser() {
    return this.withUsername('user')
               .withEmail('email-invalido')
               .withPassword('123');
  }

  // Construir o objeto final
  build() {
    return { ...this.data };
  }
}

// Factory method
function createTestData() {
  return new TestDataBuilder();
}

module.exports = { TestDataBuilder, createTestData };