describe('visual testing', () => {
    beforeEach(() => {
        cy.eyesOpen({
            appName: 'NGX Cypress Test App',
            testName: Cypress.currentTest.title

        });
    });
    it('test eith applitools demo app', () => {
        cy.visit('/')
        cy.eyesCheckWindow({
            tag: 'Home Page'
        })
        navigateTo.formLayoutPage()
        cy.eyesCheckWindow({
            tag: 'Form Layouts'
        })
    })
    afterEach(() => {
        cy.eyesClose();
      })
})
