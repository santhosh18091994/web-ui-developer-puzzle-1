describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });
});

describe('Undo feature for adding and removing book to reading list', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I could able to undo the book adding to reading list', () => {
    cy.get('input[type="search"]').type('python');
    cy.get('form').submit();
    cy.get('[data-testing="want-to-read"]').filter(':not(:disabled)').eq(0).each(($item) => {
        cy.wrap($item).click();
        cy.get('.mat-simple-snackbar-action > button').click();
    });
    cy.get('[data-testing="want-to-read"]').filter(':not(:disabled)').eq(0).each(($item) => {
        cy.wrap($item).should('not.be.disabled');
    });
  });

  it('Then: I could able to redo the book removing from reading list', () => {
    cy.get('input[type="search"]').type('python');
    cy.get('form').submit();
    cy.get('[data-testing="want-to-read"]').filter(':not(:disabled)').eq(0).each(($item) => {
        cy.wrap($item).click();
        cy.wait(3000);
    });

    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="remove-reading-list"]').eq(0).each(($item) => {
      cy.wrap($item).click({force:true});
      cy.get('.mat-simple-snackbar-action > button').click();
    });
    cy.get('[data-testing="remove-reading-list"]').eq(0).each(($item) => {
      cy.wrap($item).should('exist');
    });
  });
})