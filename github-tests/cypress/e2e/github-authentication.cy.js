describe('Fluxo de Autenticação GitHub', () => {
  const email = Cypress.env('GITHUB_EMAIL');
  const password = Cypress.env('GITHUB_PASSWORD');
  const username = Cypress.env('GITHUB_USERNAME');

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('deve abrir navegador e acessar página inicial do GitHub', () => {
    cy.visit('/');
    cy.url().should('eq', 'https://github.com/');
    cy.get('body').should('be.visible');
  });

  it('deve acessar página de login e verificar elementos do formulário', () => {
    cy.visit('/login');
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.get('#login_field', { timeout: 10000 }).should('be.visible');
    cy.get('#password', { timeout: 10000 }).should('be.visible');
    cy.get('input[type="submit"]', { timeout: 10000 }).should('be.visible');
  });

  it('deve autenticar com sucesso e redirecionar para dashboard', () => {
    cy.visit('/login');
    cy.get('#login_field', { timeout: 15000 }).should('be.visible').type(email, { log: false });
    cy.get('#password', { timeout: 15000 }).should('be.visible').type(password, { log: false });
    cy.get('input[type="submit"]').click();
    cy.url({ timeout: 20000 }).should('satisfy', (url) => 
      url.includes('/dashboard') || url === 'https://github.com/' || url.includes('/session')
    );
    cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 }).should('be.visible');
  });

  it('deve exibir nome do usuário abaixo da foto do perfil após login', () => {
    cy.visit('/login');
    cy.get('#login_field', { timeout: 15000 }).should('be.visible').type(email, { log: false });
    cy.get('#password', { timeout: 15000 }).should('be.visible').type(password, { log: false });
    cy.get('input[type="submit"]').click();
    cy.url({ timeout: 20000 }).should('satisfy', (url) => 
      url.includes('/dashboard') || url === 'https://github.com/' || url.includes('/session')
    );
    cy.get('.prc-Button-ButtonBase-9n-Xk > [data-testid="github-avatar"]', { timeout: 15000 })
      .should('be.visible')
      .click();
    cy.get('[data-component="ActionList.Item.Label"]', { timeout: 10000 }).contains('Profile').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('match', new RegExp(`github.com/${username}`, 'i'));
    cy.get('.p-nickname', { timeout: 10000 }).invoke('text').should('match', new RegExp(username, 'i'));
  });
});
