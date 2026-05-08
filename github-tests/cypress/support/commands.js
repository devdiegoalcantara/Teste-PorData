Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.url({ timeout: 10000 }).should('include', '/login');
  cy.get('#login_field', { timeout: 15000 }).should('be.visible').type(email, { log: false });
  cy.get('#password', { timeout: 15000 }).should('be.visible').type(password, { log: false });
  cy.get('input[type="submit"]', { timeout: 10000 }).should('be.enabled').click();
  cy.url({ timeout: 20000 }).should('satisfy', (url) => 
    url.includes('/dashboard') || url === 'https://github.com/' || url.includes('/session')
  );
});

Cypress.Commands.add('logout', () => {
  cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 })
    .should('be.visible')
    .click();
  cy.contains('Sign out', { timeout: 10000 }).should('be.visible').click();
  cy.url({ timeout: 15000 }).should('eq', 'https://github.com/');
});

Cypress.Commands.add('validateAuthenticationSuccess', () => {
  cy.url({ timeout: 20000 }).should('satisfy', (url) => 
    url.includes('/dashboard') || url === 'https://github.com/' || url.includes('/session')
  );
  cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 })
    .should('be.visible');
});
