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

describe('When: I add/remove books', () => {
  beforeEach(() => {
    cy.startAt('/'); 
  });

  it('Then: I should be able to mark that as finished', () => { 
    cy.get('input[type="search"]').type('python');
    cy.get('form').submit();
    cy.get('[data-testing="want-to-read"]').filter(':not(:disabled)').eq(0).click();
    cy.wait(3000);
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="finish-book-button"]').last().click();
    cy.get('[data-testing="finished-on"]').should('contain.text', 'Finished on');
  });
});
