const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://commitquality.com',
    specPattern: 'cypress/e2e/exercicio2_commitquality_tests-patterns/**/*.cy.js',
    setupNodeEvents(on, config) {
      // eventos/plugins se necessário
      return config;
    },
  },
  video: false,
  screenshotsFolder: 'cypress/screenshots',
  downloadsFolder: 'cypress/downloads',
});
