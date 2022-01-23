import Vue from 'vue'

const INITIAL_STATE = {
  open: false,
  items: []
}

export class CartManager {
  state

  constructor() {
    this.state = Vue.observable(INITIAL_STATE)
  }

  getState() {
    return this.state
  }

  open() {
    this.state.open = true

    return this.getState()
  }

  close() {
    this.state.open = false

    return this.getState()
  }

  hasProducts() {
    return !!this.state.items.length
  }

  productIsInTheCart(product) {
    return this.getState().items.some(({ id }) => id === product.id)
  }

  addProduct(product) {
    if (!this.productIsInTheCart(product)) {
      this.state.items.push(product)
    }

    return this.getState()
  }

  removeProduct(productId) {
    const newItems = this.state.items.filter(product => product.id !== productId)

    this.state.items = [...newItems]

    return this.getState()
  }

  clearProducts() {
    this.state.items = []

    return this.getState()
  }

  clearCart() {
    this.clearProducts()
    this.close()

    return this.getState()
  }
}

export default {
  install: VueInstance => {
    VueInstance.prototype.$cart = new CartManager()
  }
}
