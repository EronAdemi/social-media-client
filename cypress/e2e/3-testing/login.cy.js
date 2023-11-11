// login_spec.js

describe('Login Functionality', () => {
  beforeEach(() => {
    cy.visit('127.0.0.1:5500');
  });

  it('displays an error message for invalid login', () => {
    cy.window().then(win => {
      win.localStorage.removeItem('token');
      win.localStorage.removeItem('profile');
    });

    cy.reload();
    cy.wait(1000);
    cy.get('#loginButton').click();

    cy.get('#loginEmail').should('be.visible');

    // Fill out the login form with invalid credentials
    cy.get('#loginEmail').type('invalidemail@noroff.no', { force: true });
    cy.get('#loginPassword').type('wrongpassword', { force: true });

    // Intercept the login request
    cy.intercept('POST', '**/social/auth/login').as('loginRequest');

    // Click the login button
    cy.get('#loginForm').submit();

    // Wait for the login request to complete
    cy.wait('@loginRequest').then(interception => {
      if (interception.response.statusCode !== 200) {
        // Log the error response when status is not 200
        alert('The user cannot submit the login form with invalid credentials');
      }
    });
  });

  it('allows the user to log in successfully', () => {
    cy.wait(1000);
    cy.get('#loginButton').click();

    cy.get('#loginEmail').should('be.visible');

    // Fill out the login form
    cy.get('#loginEmail').type('test123@noroff.no', { force: true });
    cy.get('#loginPassword').type('12345678', { force: true });

    // Click the login button
    cy.get('#loginForm').submit();
    // Intercept the API call to verify it is made correctly

    cy.intercept('POST', '**/social/auth/login').as('loginRequest');

    // Wait for the API call to complete and verify it was successful
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // e.g., check for the presence of a logout button and click
    cy.get('button[data-auth="logout"]').should('be.visible');
    cy.get('.btn-outline-warning').click();

    // Logout
    cy.get('button[data-auth="login"]').should('be.visible');

    cy.window().then(win => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('profile')).to.be.null;
    });
  });
});
