import { onDatePickerPage } from "../support/page_objects/datePickerPage"
import { onFormLayoutsPage } from "../support/page_objects/formLayoutsPage"
import { navigateTo} from "../support/page_objects/navigationPage"
import { onSmartTablePage } from "../support/page_objects/smartTablePage"

describe('Page Object', () => {

    beforeEach('open app', () => {
        cy.openHomePage()
    })

    it('navigation between pages', () => {
        cy.wait(500)
        navigateTo.formLayoutPage()
        navigateTo.datePickerPage()
        navigateTo.smartTablePage()
        navigateTo.tooltipPage()
        navigateTo.toasterPage()
    })

    it('should submit Inline and Basic form and select tomorrow date in the calendar', () => {
        navigateTo.formLayoutPage()
        onFormLayoutsPage.submitInlineFormNameAndEmail('Natasha','test@test.com')
        onFormLayoutsPage.submitBasicFormwithEmailAndPass('test@test.com','password')
        cy.wait(500)
        navigateTo.datePickerPage()
        onDatePickerPage.selectCommonDatePickerDateFromToday(1)
        onDatePickerPage.selectDatepickerWithRangeFromToday(7,14)
        navigateTo.smartTablePage()
        onSmartTablePage.addNewRecordWithFirstAndLastName('Natasha','Kostovska')
        onSmartTablePage.updateAgeByFirstName('Natasha','29')
        onSmartTablePage.deleteRowByIndex(1)
    })

})