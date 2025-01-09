/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Test with backend', () => {

    beforeEach('log to app', () => {
        cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' })
        cy.loginToApplication()
    })

    it('verify correct request and response', () => {
        cy.intercept('POST', Cypress.env("apiUrl") +'/api/articles/').as('postArticles')
        let articleTitle = faker.word.noun()
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type(articleTitle) // the title needs to be unique so the article can be created
        cy.get('[formcontrolname="description"]').type("A Description")
        cy.get('[formcontrolname="body"]').type("A Body")
        cy.contains('Publish Article').click()

        cy.wait('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(201)
            expect(xhr.request.body.article.body).to.equal('A Body')
            expect(xhr.response.body.article.description).to.equal('A Description')
        })
    })

    it('intercepting and modifying the request and response', () => {

        /*  cy.intercept('POST',Cypress.env("apiUrl") +'/api/articles/',(req =>{
              req.body.article.description ="A Description 2"
          })).as('postArticles')*/

        cy.intercept('POST', Cypress.env("apiUrl") +'/api/articles/', (req => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('A Description')
                res.body.article.description = "A Description 2"
            })
        })).as('postArticles')

        let articleTitle = faker.word.noun()
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type(articleTitle) // the title needs to be unique so the article can be created
        cy.get('[formcontrolname="description"]').type("A Description")
        cy.get('[formcontrolname="body"]').type("A Body")
        cy.contains('Publish Article').click()

        cy.wait('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(201)
            expect(xhr.request.body.article.body).to.equal('A Body')
            expect(xhr.response.body.article.description).to.equal('A Description 2')
        })
    })

    it('verify popular tags are intercepted', () => {
        cy.get('.tag-list').should('contain', 'cypress').and('contain', 'automation').and('contain', 'testing')
    })

    it('verify global feed likes count', () => {
        cy.intercept('GET', Cypress.env("apiUrl") +'/api/articles/feed*', { "articles": [], "articlesCount": 0 }) // * wild card this is in your feed section
        cy.intercept('GET', Cypress.env("apiUrl") +'/api/articles*', { fixture: 'articles.json' })

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(heartList => {
            expect(heartList[0]).to.contain('1')
            expect(heartList[1]).to.contain('5')

        })

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            file.articles[1].favoritesCount = 6
            cy.intercept('POST', Cypress.env("apiUrl") +'/api/articles/' + articleLink + '/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click().should('contain', '6')
    })

    it('delete a new article in a global feed', () => {
        const bodyRequest = {
            "article": {
                "body": "API 123456",
                "description": "API testing",
                "tagList": [],
                "title": "Request from API"
            }
        }
        cy.get('@token').then(token => {
            cy.request({
                url: Cypress.env("apiUrl") +'/api/articles/',
                headers: { 'Authorization': 'Token ' + token },
                method: 'POST',
                body: bodyRequest
            }).then(response => {
                expect(response.status).to.equal(201)
            })

            cy.contains('Global Feed').click()
            cy.wait(500)
            cy.get('.article-preview').first().click()
            cy.wait(500)
            cy.get('.article-actions').contains('Delete Article').click()
            cy.wait(500)

            cy.request({
                url: Cypress.env("apiUrl") +'/api/articles?limit=10&offset=0',
                headers: { 'Authorization': 'Token ' + token },
                method: 'GET'
            }).its('body').then(body => {
                expect(body.articles[0].title).not.to.equal('Request from API')
            })
        })
    })
})