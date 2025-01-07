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

export class DatepickerPage{

    selectCommonDatePickerDateFromToday(dayFromToday){
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            let dateToAssert = selectDayFromCurrent(dayFromToday)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
            cy.wrap(input).should('have.value', dateToAssert)
        })
    }

    selectDatepickerWithRangeFromToday(firstDay, secondDay){
        cy.contains('nb-card', 'Datepicker With Range').find('input').then(input => {
            cy.wrap(input).click()
            let dateToAssertFirst = selectDayFromCurrent(firstDay)
            let dateToAssertSecond = selectDayFromCurrent(secondDay)
            const finalDate= dateToAssertFirst+' - '+dateToAssertSecond
            cy.wrap(input).invoke('prop', 'value').should('contain', finalDate)
            cy.wrap(input).should('have.value', finalDate)
        })
    }
}

export const onDatePickerPage=new DatepickerPage()