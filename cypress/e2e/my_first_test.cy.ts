describe('template spec', () => {
  it('can log in with csdt dev account', () => {
    cy.visit('/password-protect');

    console.log('Password:', Cypress.env('NEXT_PUBLIC_PASSWORD_PROTECT'));

    cy.get('input[name=password]').type(Cypress.env('NEXT_PUBLIC_PASSWORD_PROTECT') + '{enter}')
    
    // Start Auth0 flow
    cy.contains('Sign in with email').click();
    cy.origin('https://artisanalfutures-dev.us.auth0.com', () => {
      cy.get('input[name=username]').type(Cypress.env('USERNAME'))
      cy.get('input[name=password]').type(Cypress.env('PASSWORD'))
      cy.get('input[name=password]').type('{enter}')

  })

  })  
})