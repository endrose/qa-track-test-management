describe("Website Sauce", () => {
  it("Website Sauce", () => {
    // Navigate to URL
    cy.visit("https://www.saucedemo.com/");

    // Fill "#user-name" with value
    cy.get("#user-name").type("standard_user");

    // Fill "#password" with value
    cy.get("#password").type("secret_sauce");

    // Click element
    cy.get("#login-button").click();

    // Assert text is visible on page
    cy.contains("Swag Labs").should('be.visible');

  });
});