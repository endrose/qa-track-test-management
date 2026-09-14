describe("Website Sauce", () => {
  it("Sauce Cypress", () => {
    // Navigate to URL
    cy.visit("https://www.saucedemo.com/");

    // Fill "#user-name" with value
    cy.get("#user-name").type("standard_user");

    // Click element
    cy.get("#password").click();

    // Click element
    cy.get('#login-button').click()

    // Assert text is visible on page
    cy.contains("Swag Labs").should('be.visible');

  });
});