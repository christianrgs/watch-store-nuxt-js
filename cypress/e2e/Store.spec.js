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

  context('Store > Shopping Cart', () => {
    const quantity = 10

    beforeEach(() => {
      server.createList('product', quantity)
      cy.visit('/')
    })

    it('should not display shopping cart when page first loads', () => {
      cy.getByTestId('shopping-cart').should('have.class', 'hidden')
    })

    it('should toggle shopping cart visibility when button gets clicked', () => {
      cy.getByTestId('toggle-button').as('toggleButton')
      cy.get('@toggleButton').click()
      cy.getByTestId('shopping-cart').should('not.have.class', 'hidden')
      cy.get('@toggleButton').click({ force: true })
      cy.getByTestId('shopping-cart').should('have.class', 'hidden')
    })

    it('should not display "Clear cart" button when cart is empty', () => {
      cy.getByTestId('toggle-button').as('toggleButton')
      cy.get('@toggleButton').click()
      cy.getByTestId('clear-cart-button').should('not.exist')
    })

    it('should display "Is empty" message when there are no products', () => {
      cy.getByTestId('toggle-button').as('toggleButton')
      cy.get('@toggleButton').click()
      cy.getByTestId('shopping-cart').contains('Is empty')
    })

    it('should open shopping cart when a product is added', () => {
      cy.getByTestId('product-card').first().find('[data-testid="add-to-cart-button"]').click()
      cy.getByTestId('shopping-cart').should('not.have.class', 'hidden')
    })

    it('should add first product to the cart', () => {
      cy.getByTestId('product-card').first().find('[data-testid="add-to-cart-button"]').click()
      cy.getByTestId('cart-item').should('have.length', 1)
    })

    it('should add 3 products to the cart', () => {
      cy.addToCart({ indexes: [1, 3, 5] })

      cy.getByTestId('cart-item').should('have.length', 3)
    })

    it('should add 1 product to the cart', () => {
      cy.addToCart({ index: 6 })

      cy.getByTestId('cart-item').should('have.length', 1)
    })

    it('should add all products to the cart', () => {
      cy.addToCart({ indexes: 'all' })

      cy.getByTestId('cart-item').should('have.length', quantity)
    })

    it('should display quantity 1 when product is added to cart', () => {
      cy.addToCart({ index: 1 })

      cy.getByTestId('quantity').contains(1)
    })

    it('should increase quantity when button + gets clicked', () => {
      cy.addToCart({ index: 1 })
      cy.getByTestId('plus-button').click()
      cy.getByTestId('quantity').contains(2)
      cy.getByTestId('plus-button').click()
      cy.getByTestId('quantity').contains(3)
    })

    it('should decrease quantity when button - gets clicked', () => {
      cy.addToCart({ index: 1 })
      cy.getByTestId('plus-button').click()
      cy.getByTestId('plus-button').click()
      cy.getByTestId('quantity').contains(3)
      cy.getByTestId('minus-button').click()
      cy.getByTestId('quantity').contains(2)
      cy.getByTestId('minus-button').click()
      cy.getByTestId('quantity').contains(1)
    })

    it('should not decrease below zero when button - gets clicked', () => {
      cy.addToCart({ index: 1 })
      cy.getByTestId('minus-button').click()
      cy.getByTestId('minus-button').click()
      cy.getByTestId('quantity').contains(0)
    })

    it('should remove a product from cart', () => {
      cy.addToCart({ index: 2 })

      cy.getByTestId('cart-item').as('cartItems')
      cy.get('@cartItems').should('have.length', 1)
      cy.get('@cartItems').first().find('[data-testid="remove-button"]').click()
      cy.get('@cartItems').should('have.length', 0)
    })

    it('should clear cart when "Clear cart" button gets clicked', () => {
      cy.addToCart({ indexes: [1, 2, 3] })

      cy.getByTestId('cart-item').should('have.length', 3)
      cy.getByTestId('clear-cart-button').click()
      cy.getByTestId('cart-item').should('have.length', 0)
    })
  })

  context('Store > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/')
      cy.getByTestId('product-card').should('have.length', 0)
      cy.get('body').contains('0 Products')
    })

    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product')

      cy.visit('/')
      cy.getByTestId('product-card').should('have.length', 1)
      cy.get('body').contains('1 Product')
    })

    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10)

      cy.visit('/')
      cy.getByTestId('product-card').should('have.length', 10)
      cy.get('body').contains('10 Products')
    })
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
      cy.getByTestId('search-form').submit()
      cy.getByTestId('product-card').should('have.length', 1)
    })

    it('should return any product', () => {
      server.createList('product', 10)

      cy.visit('/')
      cy.get('input[type="search"]').type('Smart Watch')
      cy.getByTestId('search-form').submit()
      cy.getByTestId('product-card').should('have.length', 0)
      cy.get('body').contains('0 Products')
    })
  })
})
