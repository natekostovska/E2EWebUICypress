/// <reference types="cypress" />

describe('JSON objects suite',() =>{

    it('JSON objects test', () => {
        cy.openHomePage()

        const simpleObject={"key": "value", "key2":"value2"} // key:pair
        const simpleArrayOfValues=["one","two","three"] // just values
        const arrayOfObjects=[{"key": "value"},{"key2": "value2"},{"key3": "value3"}] // aray of objects
        const typesOfData={"string":"A string value","number":10}

        const mix={
            "FirstName":"Natasha",
            "LastName":"Kostovska",
            "Age":29,
            "Students":[
                {
                    "firstName":"Sara",
                    "lastName":"Conor"
                },
                {
                    "firstName":"Bruce",
                    "lastName":"Willis"
                }
            ]
        }

        console.log(simpleObject.key2)
        console.log(simpleObject["key2"])
        console.log(simpleArrayOfValues[1])
        console.log(arrayOfObjects[2].key3)
        console.log(mix.Students[0].firstName)

        const lastNameOfSecondStudent=mix.Students[1].lastName
    })

})