describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('selector').should('contain', 'Swag Labs')
  })
})
