describe('Fluxo de Logout GitHub', () => {
  const email = Cypress.env('GITHUB_EMAIL');
  const password = Cypress.env('GITHUB_PASSWORD');

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('deve fazer login e logout com sucesso', () => {
    cy.visit('/login');
    cy.get('#login_field', { timeout: 15000 }).should('be.visible').type(email, { log: false });
    cy.get('#password', { timeout: 15000 }).should('be.visible').type(password, { log: false });
    cy.get('input[type="submit"]').click();
    
    cy.url({ timeout: 20000 }).should('satisfy', (url) => 
      url.includes('/dashboard') || url === 'https://github.com/' || url.includes('/session')
    );
    cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 })
      .should('be.visible');
    
    cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 })
      .click();
    cy.contains('Sign out', { timeout: 10000 }).should('be.visible').click();
    
    // Confirm logout if needed
    cy.get('body').then(($body) => {
      if ($body.find('input[name="commit"][value="Sign out"]').length > 0) {
        cy.get('input[name="commit"][value="Sign out"]').click();
      }
    });
    
    cy.url({ timeout: 15000 }).should('satisfy', (url) => 
      url === 'https://github.com/' || url === 'https://github.com/?locale=pt-br'
    );
  });

  it('deve validar que logout remove elementos autenticados', () => {
    cy.visit('/login');
    cy.get('#login_field', { timeout: 15000 }).should('be.visible').type(email, { log: false });
    cy.get('#password', { timeout: 15000 }).should('be.visible').type(password, { log: false });
    cy.get('input[type="submit"]').click();
    
    cy.url({ timeout: 20000 }).should('satisfy', (url) => 
      url.includes('/dashboard') || url === 'https://github.com/' || url.includes('/session')
    );
    
    cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 })
      .should('be.visible');
    cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 })
      .click();
    cy.contains('Sign out', { timeout: 10000 }).click();
    
    // Confirm logout if needed
    cy.get('body').then(($body) => {
      if ($body.find('input[name="commit"][value="Sign out"]').length > 0) {
        cy.get('input[name="commit"][value="Sign out"]').click();
      }
    });
    
    cy.url({ timeout: 15000 }).should('satisfy', (url) => 
      url === 'https://github.com/' || url === 'https://github.com/?locale=pt-br'
    );
    
    // Navigate to login page and validate credentials are not saved
    cy.visit('/login');
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.get('#login_field', { timeout: 10000 }).should('be.visible');
    cy.get('#password', { timeout: 10000 }).should('be.visible');
    cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 10000 }).should('not.exist');
  });
});
