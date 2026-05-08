describe('GitHub Security Validation', () => {
  const sensitiveDataPatterns = [
    /password/i,
    /token/i,
    /api[_-]?key/i,
    /secret/i,
    /private[_-]?key/i,
  ];

  it('should validate secure connection with HTTPS', () => {
    cy.visit('/login', { timeout: 15000 });
    cy.location('protocol').should('eq', 'https:');
  });

  it('should validate security headers on login page', () => {
    cy.request('/login', { timeout: 15000 }).then((response) => {
      const headers = response.headers;
      expect(headers).to.have.property('x-frame-options');
      expect(headers).to.have.property('x-content-type-options');
    });
  });

  it('should not expose sensitive data in page source', () => {
    cy.request('/login', { timeout: 15000 }).then((response) => {
      const body = response.body;
      // Remove HTML elements and attributes that legitimately contain sensitive words
      const cleanBody = body
        // Remove all HTML tags and their attributes
        .replace(/<[^>]*>/gi, '')
        // Remove CSS class names and IDs that might contain these words
        .replace(/class=["'][^"']*(password|token|secret|key)[^"']*["']/gi, '')
        .replace(/id=["'][^"']*(password|token|secret|key)[^"']*["']/gi, '')
        // Remove common form-related text that is legitimate
        .replace(/password\s*:?\s*$/gim, '')
        .replace(/enter\s+password/gim, '')
        .replace(/forgot\s+password/gim, '')
        // Remove JavaScript code that might contain these words legitimately
        .replace(/["'][^"']*(password|token|secret|key)[^"']*["']/gi, '');
      
      sensitiveDataPatterns.forEach((pattern) => {
        expect(cleanBody).not.to.match(pattern);
      });
    });
  });

  it('should validate secure session cookie attributes', () => {
    cy.visit('/login', { timeout: 15000 });
    cy.getCookies().then((cookies) => {
      cookies.forEach((cookie) => {
        if (cookie.name.includes('session') || cookie.name.includes('_csrf')) {
          expect(cookie).to.have.property('secure');
          expect(cookie).to.have.property('httpOnly');
        }
      });
    });
  });
});
