// Builder Pattern: Contact Form Builder
// Autora: Lilian Kasprzak
// Analista de QA

const { faker } = require('@faker-js/faker');

class ContactFormBuilder {
  constructor() {
    this.contact = {
      name: '',
      email: '',
      queryType: '',
      dateOfBirth: '',
      consent: false
    };
  }

  withName(name) {
    this.contact.name = name;
    return this;
  }

  withRandomName() {
    this.contact.name = faker.person.fullName();
    return this;
  }

  withEmail(email) {
    this.contact.email = email;
    return this;
  }

  withRandomEmail() {
    this.contact.email = faker.internet.email();
    return this;
  }

  withQueryType(queryType) {
    this.contact.queryType = queryType;
    return this;
  }

  withRandomQueryType() {
    const types = ['General', 'Product', 'Support', 'Other'];
    this.contact.queryType = faker.helpers.arrayElement(types);
    return this;
  }

  withDateOfBirth(date) {
    this.contact.dateOfBirth = date;
    return this;
  }

  withRandomDateOfBirth() {
    const date = faker.date.past({ years: 30 });
    this.contact.dateOfBirth = date.toISOString().split('T')[0];
    return this;
  }

  withConsent(consent = true) {
    this.contact.consent = consent;
    return this;
  }

  build() {
    return this.contact;
  }

  // Métodos auxiliares para cenários específicos
  buildCompleteContact() {
    return this.withRandomName()
      .withRandomEmail()
      .withQueryType('General')
      .withRandomDateOfBirth()
      .withConsent()
      .build();
  }

  buildOnlyWithName() {
    return this.withRandomName().build();
  }

  buildOnlyWithEmail() {
    return this.withRandomEmail().build();
  }

  buildOnlyWithQueryType() {
    return this.withQueryType('General').build();
  }

  buildOnlyWithDateOfBirth() {
    return this.withRandomDateOfBirth().build();
  }

  buildOnlyWithConsent() {
    return this.withConsent().build();
  }
}

export default ContactFormBuilder;
