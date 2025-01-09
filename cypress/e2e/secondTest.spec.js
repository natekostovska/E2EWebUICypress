describe('Test log out', () => {

    beforeEach('log to app', () => {
        cy.loginToApplication()
    })

    it('verify user can log out succesfully', {retries:2}, () => {

        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain','Sign up1')
    })
})