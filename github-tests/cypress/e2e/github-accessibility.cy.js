describe('Conformidade de Acessibilidade do GitHub', () => {
  it('deve validar a estrutura de acessibilidade da página de login', () => {
    cy.visit('/login', { timeout: 15000 });
    cy.get('#login_field', { timeout: 10000 }).should('have.attr', 'type', 'text');
    cy.get('#password', { timeout: 10000 }).should('have.attr', 'type', 'password');
    cy.get('input[type="submit"]', { timeout: 10000 }).should('have.attr', 'value', 'Sign in');
    cy.get('label[for="login_field"]', { timeout: 10000 }).should('exist');
    cy.get('label[for="password"]', { timeout: 10000 }).should('exist');
  });

  it('deve validar rótulos ARIA em elementos interativos', () => {
    cy.visit('/login', { timeout: 15000 });
    cy.get('input[type="submit"]', { timeout: 10000 }).should('have.attr', 'value').and('not.be.empty');
  });

  it('deve validar indicadores de foco em elementos do formulário', () => {
    cy.visit('/login', { timeout: 15000 });
    cy.get('#login_field', { timeout: 10000 }).focus().should('be.focused');
    cy.get('#password', { timeout: 10000 }).focus().should('be.focused');
  });

  it('deve validar a visibilidade das mensagens de erro', () => {
    cy.visit('/login', { timeout: 15000 });
    cy.get('#login_field', { timeout: 10000 }).type('invalid@email.com');
    cy.get('#password', { timeout: 10000 }).type('wrongpassword');
    cy.get('input[type="submit"]', { timeout: 10000 }).click();
    cy.get('.flash-error, .js-flash-alert, [role="alert"], #js-flash-container', { timeout: 10000 }).should('be.visible');
  });
});
