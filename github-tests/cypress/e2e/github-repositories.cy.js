describe('Interação com Repositórios GitHub', () => {
  const email = Cypress.env('GITHUB_EMAIL');
  const password = Cypress.env('GITHUB_PASSWORD');
  const username = Cypress.env('GITHUB_USERNAME');

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.get('#login_field', { timeout: 15000 }).should('be.visible').type(email, { log: false });
    cy.get('#password', { timeout: 15000 }).should('be.visible').type(password, { log: false });
    cy.get('input[type="submit"]').click();
    cy.url({ timeout: 20000 }).should('satisfy', (url) => 
      url.includes('/dashboard') || url === 'https://github.com/' || url.includes('/session')
    );
  });

  it('deve navegar até aba Repositories', () => {
    cy.visit(`/${username}?tab=repositories`, { timeout: 15000 });
    cy.url({ timeout: 10000 }).should('include', 'tab=repositories');
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  it('deve acessar um repositório aleatório do perfil', () => {
    cy.visit(`/${username}?tab=repositories`, { timeout: 15000 });
    cy.get('[data-testid="repo-list-item"], [itemprop="name codeRepository"], h3 a', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();
    cy.url({ timeout: 10000 }).should('match', new RegExp(username, 'i'));
  });

  it('deve navegar até aba Pull Requests', () => {
    cy.visit(`/${username}?tab=repositories`, { timeout: 15000 });
    cy.get('[data-testid="repo-list-item"], [itemprop="name codeRepository"], h3 a', { timeout: 10000 })
      .first()
      .click();
    cy.get('[data-tab-item="pull-requests-tab"], [aria-label="Pull requests"], a[href*="/pulls"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/pulls');
  });

  it('deve criar novo repositório utilizando seletores XPath', () => {
    const timestamp = Date.now();
    const repoName = `test${timestamp}`;
    
    cy.visit('/new', { timeout: 15000 });
    cy.url({ timeout: 10000 }).should('include', '/new');
    
    cy.xpath('//input[@id="repository-name-input"]', { timeout: 15000 })
      .should('be.visible')
      .type(repoName);
    
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      if ($body.text().includes('Couldn\'t check availability')) {
        const simpleName = `test${Math.floor(Math.random() * 10000)}`;
        cy.xpath('//input[@id="repository-name-input"]').clear().type(simpleName);
        cy.wait(1000);
      }
    });
    
    cy.xpath('//input[@name="Description"]', { timeout: 15000 })
      .should('be.visible')
      .type('Repositório criado por testes automatizados para o PortData');
    
    cy.xpath('//button[@data-component="Button" and @type="submit" and @data-variant="primary"]//span[contains(text(), "Create repository")]', { timeout: 15000 })
      .should('be.visible')
      .click();
    
    cy.url({ timeout: 20000 }).should('include', repoName);
    cy.contains(repoName, { timeout: 10000 }).should('be.visible');
  });

  it('deve acessar tela do repositório criado', () => {
    cy.visit(`/${username}?tab=repositories`, { timeout: 15000 });
    
    cy.get('[data-testid="repo-list-item"], [itemprop="name codeRepository"], h3 a', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();
    
    cy.url({ timeout: 10000 }).should('match', new RegExp(username, 'i'));
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });
});
