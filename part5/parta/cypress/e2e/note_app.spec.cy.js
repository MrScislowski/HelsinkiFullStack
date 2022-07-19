
/// <reference types="cypress" />

describe('Note app', function () {
  this.beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'b',
      username: 'a',
      password: 'c'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
  })

  it('login form can be opened', function () {
    cy.contains('show').click()
    cy.get('#username').type('a')
    cy.get('#password').type('c')
    cy.get('#login-button').click()

    cy.contains('b logged-in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      // cy.contains('show').click()
      // cy.get('#username').type('a')
      // cy.get('#password').type('c')
      // cy.get('#login-button').click()
      cy.login({ username: 'a', password: 'c'})
    })
    describe('and several notes exist', function () {
      this.beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function () {
        cy.contains('second note').parent().find('button').as('theButton')

        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'make not important')
      })
    })

    it('a new note can be created', function () {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      this.beforeEach(function () {
        cy.createNote({
          content: 'another note cypress',
          important: false
        })
      })

      this.beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make important')
          .click()

        cy.contains('another note cypress')
          .contains('make not important')
      })
    })
  })

  it.only('login fails with wrong password', function () {
    cy.contains('show').click()
    cy.get('#username').type('a')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'b logged-in')
  })
})

