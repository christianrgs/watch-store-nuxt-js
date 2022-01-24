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
    server.createList('product', 25)

    cy.visit('/')

    cy.get('body').contains('Brand')
    cy.get('body').contains('Wrist Watch')
  })
})
