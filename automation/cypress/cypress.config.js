const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false
  },
  reporter: "json",
  reporterOptions: {
    output: "test-results.json"
  }
});
