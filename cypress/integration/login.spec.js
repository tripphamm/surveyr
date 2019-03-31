function getElementByTestId(type, testId) {
  return cy.get(`${type}[data-test-id='${testId}']`);
}

describe('navigation', () => {
  it('root redirects new users to the Join page', () => {
    cy.visit('http://localhost:3000');

    cy.url().should('be', 'http://localhost:3000/join');
  });

  it('host-survey-link goes to the Host page', () => {
    getElementByTestId('a', 'host-survey-link').click();

    cy.url().should('be', 'http://localhost:3000/host');
  });

  it('can sign in', () => {
    cy.contains('email').click();

    cy.get("input[type='email']").type('cypress-test@srvy.live');

    // uses the text in the DOM; so we use 'Next' rather than 'NEXT'
    cy.contains('Next').click();

    cy.get("input[type='password']").type('test-pw-1!');

    cy.contains('Sign In').click();
  });

  it('create-survey-fab goes to the Create Survey page', () => {
    // uses the text in the DOM; so we use 'Next' rather than 'NEXT'
    getElementByTestId('button', 'create-survey-fab').click();

    cy.url().should('be', 'http://localhost:3000/host/surveys/create');
  });

  it('can create a survey', () => {
    getElementByTestId('input', 'survey-title-textfield').type('Test Survey');

    getElementByTestId('input', 'survey-question-q0-textfield').type('Is this a sample question?');

    getElementByTestId('input', 'survey-answer-q0-a0-textfield').type('Yes');

    getElementByTestId('button', 'add-answer-button').click();

    getElementByTestId('input', 'survey-answer-q0-a1-textfield').type('No');
  });
});
