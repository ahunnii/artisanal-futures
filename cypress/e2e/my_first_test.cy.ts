describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://www.artisanalfutures.org/')
  })
  it('create new transaction', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('www.artisanalfutures.org');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.my-6 > .flex > .mx-auto').click();
    cy.get('.mt-5 > .rounded-md').click();

    cy.get(
      ':nth-child(1) > .bg-slate-50 > .items-center > .gap-2 > .bg-slate-500 > .lucide > [d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"]'
    ).click();

    /* ==== End Cypress Studio ==== */
  })  
})