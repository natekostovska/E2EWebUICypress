/// <reference types="cypress" />

//const { Button } = require("bootstrap")
//const { text } = require("stream/consumers")

// context()

describe('First test suite', () => {

    it('first test', () => {
        // Finding locators

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // by Tag name
        cy.get('input')

        // by id #
        cy.get('#inputEmail1')

        // by class value .
        cy.get('.input-full-width')

        // by attribute name []
        cy.get('[fullwidth]')

        // by attribute and value
        cy.get('[placeholder="Email"]')

        // by entire class value 
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        // by two attributes 
        cy.get('[placeholder="Email"][fullwidth]')

        //by tag, attribute id and class, which web element have all of those
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //by cypress test id (data-cy)
        cy.get('[data-cy="imputEmail1"]')

    })

    // to run only this test it.only, to skip a test it.skip
    it('second test', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // get () - used to find elements on the page by locator globally
        // find() - find child elements by locator, can not bi cy.find must be a child to the parent element
        // contains () - find HTML text and by text and locator, only looking for the first match on the page

        cy.contains('Sign in')
        cy.contains('[status="warning"]', 'Sign in')
        cy.contains('nb-card', 'Horizontal form').find('button')
        cy.contains('nb-card', 'Horizontal form').contains('Sign in')
        cy.contains('nb-card', 'Horizontal form').get('button') // will find all button elements on the entire page

        //cypress chains and Dom
        cy.get('#inputEmail3').parents('form').find('button').should('contain', 'Sign in')
            .parents('form').find('nb-checkbox').click()
    })

    it('save subject of the command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')

        // CANT DO THING LIKE THIS
        /* const usingTheGrid=  cy.contains('nb-card', 'Using the Grid')
         usingTheGrid.find('[for="inputEmail1"]').should('contain','Email')
         usingTheGrid.find('[for="inputPassword2"]').should('contain','Password') */

        // 1 Cypress Alias
        cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')
        cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain', 'Password')

        // 2 Cypress then() methods
        cy.contains('nb-card', 'Using the Grid').then(usingTheGridForm => {
            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain', 'Email')
            cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain', 'Password')
        })

    })

    it('extract text values', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1 
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then(label => {
            const labelText = label.text()
            expect(labelText).to.equal('Email address')
            cy.wrap(labelText).should('contain', 'Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })
        cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('contain', 'Email address')

        //4
        cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').then(classValue => {
            expect(classValue).to.equal('label')
        })

        //5 invoke properties , the text exists in the input field
        cy.get('#exampleInputEmail1').type('test@test.com')
        cy.get('#exampleInputEmail1').invoke('prop', 'value').should('contain', 'test@test.com').then(property => {
            expect(property).to.equal('test@test.com')
        })
    })

    it('radio buttons', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // can be used only for input type radio or checkbox 
        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons).eq(0).check({ force: true }).should('be.checked')
            cy.wrap(radioButtons).eq(1).check({ force: true })
            cy.wrap(radioButtons).eq(0).should('not.be.checked')
            cy.wrap(radioButtons).eq(2).should('be.disabled')
        })
    })

    it('checkboxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        // can use click only on the first element (click does not care of the status of the checkbox if its checked or not)
        cy.get('[type="checkbox"]').eq(0).click({ force: true })
        cy.get('[type="checkbox"]').eq(1).check({ force: true })

        // all will be checked, skipping those that are checked by default 
        cy.get('[type="checkbox"]').check({ force: true })

        //  all will be unchecked, skipping those that are unchecked by default
        cy.get('[type="checkbox"]').uncheck({ force: true })
    })

    it('Date picker', () => {

        function selectDayFromCurrent(day) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
            let date = new Date()
            date.setDate(date.getDate() + day) // adding +5 days from todays date, if we add +30 days the month won't be changed, if we add +60 the arrow wont be clicked we need function loop
            console.log(date)
            let futureDay = date.getDate()
            let futureMonth = date.toLocaleDateString('en-US', { month: 'short' })
            let futureYear = date.getFullYear()
            let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`
            cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
                if (!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)) {
                    cy.get('[data-name="chevron-right"]').click()
                    selectDayFromCurrent(day)
                } else {
                    cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
                }
            })
            return dateToAssert
        }

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            const dateToAssert = selectDayFromCurrent(200)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
            cy.wrap(input).should('have.value', dateToAssert)
        })
    })

    it('Lists and dropdowns', () => {
        cy.visit('/')

        //1
        cy.get('nav nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')

        //2
        cy.get('nav nb-select').then(dropDown => {
            cy.wrap(dropDown).click()
            cy.get('.options-list nb-option').each((listItem, index) => {
                const itemText = listItem.text().trim()
                cy.wrap(listItem).click()
                cy.wrap(dropDown).should('contain', itemText)
                if (index < 3) {
                    cy.wrap(dropDown).click()
                }
            })
        })
    })

    it('Web Tables', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 Get row by text
        cy.get('tbody').contains('tr', 'Larry').then(tablerow => {
            cy.wrap(tablerow).find('.nb-edit').click()
            cy.wrap(tablerow).find('[placeholder="Age"]').clear().type('29')
            cy.wrap(tablerow).find('.nb-checkmark').click()
            cy.wrap(tablerow).find('td').eq(6).should('contain', '29')
        })

        //2 Get row by index
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type("John")
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Smith")
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then(tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', 'John')
            cy.wrap(tableColumns).eq(3).should('contain', 'Smith')
        })

        //3 Get each row validation
        const age = [20, 30, 40, 200]

        cy.wrap(age).each(age => {
            cy.get('thead [placeholder="Age"]').clear().type(age)
            cy.wait(500)
            cy.get('tbody tr').each(tableRow => {
                if (age == 200) {
                    cy.wrap(tableRow).should('contain', 'No data found')
                }
                else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
                }
            })
        })
    })

    it('tooltip', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()

        cy.contains('nb-card', 'Colored Tooltips').contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')
    })

    it.only('dialog box', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 Not a good method
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('windiw:confirm', (confirm) => {
            expect(confirm).to.equal('Are you sure you want to delete?')
        })

        //2 
        const stub = cy.stub()
        cy.on('window:confirm', stub)
        cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })

        //3
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', () => false)
    })
})

