import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// configure firebase so that we can programmatically log in/out
// and directly seed data into the db
const config = {
  apiKey: 'AIzaSyD1Yyk72-U54xD2t9YqZT-q7OpBGU3-V3g',
  authDomain: 'survey-891.firebaseapp.com',
  databaseURL: 'https://survey-891.firebaseio.com',
  projectId: 'survey-891',
  storageBucket: 'survey-891.appspot.com',
  messagingSenderId: '1006850725025',
};

firebase.initializeApp(config);

const auth = firebase.auth();

const testUserEmail = 'cypress-test@srvy.live';
const testUserPassword = 'test-pw-1!';

function getElementByTestId(testId) {
  return cy.get(`[data-test-id='${testId}']`);
}

function authenticatedContext(otherStatements) {
  return context('authenticated', () => {
    before(() => {
      cy.wrap(auth.signInWithEmailAndPassword(testUserEmail, testUserPassword));
    });

    after(() => {
      cy.wrap(auth.signOut());
    });

    otherStatements();
  });
}

function unauthenticatedContext(otherStatements) {
  return context('unauthenticated', () => {
    before(() => {
      cy.wrap(auth.signOut());
    });

    otherStatements();
  });
}

describe('Home page (authenticated)', () => {
  authenticatedContext(() => {
    beforeEach(() => {
      cy.visit('/');

      // ensure that we got the
      getElementByTestId('home-page-header');
    });

    it('/ keeps logged-in users on /', () => {
      cy.location('pathname').should('be', '/');
    });

    it('join-button goes to /join', () => {
      getElementByTestId('join-button').click();

      cy.location('pathname').should('be', '/join');
    });

    it('host-button goes to /host', () => {
      getElementByTestId('host-button').click();

      cy.location('pathname').should('be', '/host');
    });
  });

  unauthenticatedContext(() => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('/ redirects new users to the /join', () => {
      cy.location('pathname').should('be', '/join');
    });
  });
});

describe('Join page', () => {
  context('any auth', () => {
    beforeEach(() => {
      cy.visit('/join');
    });

    it('how-it-works-link goes to the How it Works page', () => {
      getElementByTestId('how-it-works-link').click();

      cy.location('pathname').should('be', '/how-it-works');
    });
  });

  authenticatedContext(() => {
    beforeEach(() => {
      cy.visit('/join');
    });

    it('host-survey-link goes to the Host page', () => {
      getElementByTestId('host-survey-link').click();

      cy.location('pathname').should('be', '/host');

      // todo-confirm that we're not on auth
    });
  });

  unauthenticatedContext(() => {
    beforeEach(() => {
      cy.visit('/join');
    });

    it('host-survey-link goes to the Auth page', () => {
      getElementByTestId('host-survey-link').click();

      // path should be /host, but we should see the auth page
      cy.location('pathname').should('be', '/host');

      getElementByTestId('auth-page-header');
    });
  });
});

describe('Host-Home page', () => {
  before(() => {
    cy.wrap(auth.signInWithEmailAndPassword(testUserEmail, testUserPassword));
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/host');
  });

  after(() => {
    cy.wrap(auth.signOut());
  });

  it('/hosts redirects logged-in-users to /hosts/surveys', () => {
    cy.url().should('be', 'http://localhost:3000/join');
  });
});

describe('Sign-in page', async () => {
  beforeEach(() => {
    cy.wrap(auth.signOut());

    cy.visit('http://localhost:3000/host');
  });

  // commented out because maybe I don't need to test this part
  // since the ui/flow is provided by a third party. But maybe I should?
  // it('user can sign in with email', () => {
  //   cy.contains('email').click();

  //   cy.get("input[type='email']").type(testUserEmail);

  //   // uses the text in the DOM; so we use 'Next' rather than 'NEXT'
  //   cy.contains('Next').click();

  //   cy.get("input[type='password']").type(testUserPassword);

  //   cy.contains('Sign In').click();
  // });
});

describe('Surveys page', () => {
  authenticatedContext(() => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/host/surveys');
    });

    it('create-survey-fab goes to the Create Survey page', () => {
      getElementByTestId('create-survey-fab').click();

      cy.location('pathname').should('be', '/host/surveys/create');
    });
  });
});

describe('Create-Survey page', () => {
  authenticatedContext(() => {
    before(() => {
      cy.visit('http://localhost:3000/host/surveys/create');
    });

    it('can fill out a survey', () => {
      getElementByTestId('survey-title-textfield')
        .type('Test Survey')
        .should('be', 'Test Survey');

      getElementByTestId('survey-question-q0-textfield')
        .type('Is this a sample question?')
        .should('be', 'Is this a sample question?');

      getElementByTestId('survey-answer-q0-a0-textfield')
        .type('Yes')
        .should('be', 'Yes');

      getElementByTestId('add-answer-button').click();

      getElementByTestId('survey-answer-q0-a1-textfield')
        .type('No')
        .should('be', 'No');

      getElementByTestId('add-question-button').click();

      getElementByTestId('survey-question-q1-textfield')
        .type('Is this another question?')
        .should('be', 'Is this another question?');
    });
  });
  before(() => {
    cy.wrap(auth.signInWithEmailAndPassword(testUserEmail, testUserPassword));
  });

  after(() => {
    cy.wrap(auth.signOut());
  });
});
