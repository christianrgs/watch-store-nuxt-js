/// <reference types="cypress" />

import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('Should display the store', () => {
    server.createList('product', 24)

    cy.visit('/')

    cy.get('body').contains('Brand')
    cy.get('body').contains('Wrist Watch')
  })

  context('Store > Search for Products', () => {
    it('Should type in the search field', () => {
      cy.get('input[type="search"]').type('Some text here').should('have.value', 'Some text here')
    })

    it('should return 1 product when "Smart Watch" is used as search term', () => {
      server.create('product', { name: 'Smart Watch' })
      server.createList('product', 9)

      cy.visit('/')
      cy.get('input[type="search"]').type('Smart Watch')
      cy.get('[data-testid="search-form"]').submit()
      cy.get('[data-testid="product-card"]').should('have.length', 1)
    })

    it('should return any product', () => {
      server.createList('product', 10)

      cy.visit('/')
      cy.get('input[type="search"]').type('Smart Watch')
      cy.get('[data-testid="search-form"]').submit()
      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 Products')
    })
  })
})
