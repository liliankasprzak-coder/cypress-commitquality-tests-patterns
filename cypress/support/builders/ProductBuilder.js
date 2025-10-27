// Builder Pattern: Product Builder
// Autora: Lilian Kasprzak
// Analista de QA

const { faker } = require('@faker-js/faker');

class ProductBuilder {
  constructor() {
    this.product = {
      name: '',
      price: '',
      dateStocked: ''
    };
  }

  withName(name) {
    this.product.name = name;
    return this;
  }

  withRandomName() {
    this.product.name = faker.commerce.productName();
    return this;
  }

  withPrice(price) {
    this.product.price = price;
    return this;
  }

  withRandomPrice() {
    this.product.price = faker.commerce.price({ min: 10, max: 1000, dec: 2 });
    return this;
  }

  withDateStocked(date) {
    this.product.dateStocked = date;
    return this;
  }

  withTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    this.product.dateStocked = today;
    return this;
  }

  build() {
    return this.product;
  }

  // Métodos auxiliares para cenários específicos
  buildCompleteProduct() {
    return this.withRandomName()
      .withRandomPrice()
      .withTodayDate()
      .build();
  }

  buildOnlyWithName() {
    return this.withRandomName().build();
  }

  buildOnlyWithPrice() {
    return this.withRandomPrice().build();
  }

  buildOnlyWithDate() {
    return this.withTodayDate().build();
  }
}

export default ProductBuilder;
