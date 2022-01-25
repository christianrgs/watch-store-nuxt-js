import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Cart from '@/components/Cart'
import CartItem from '@/components/CartItem'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

const EMPTY_MESSAGE = 'Is empty'

describe('Cart', () => {
  let server
  let cartManager

  const mountCart = (quantity = 2) => {
    const products = server.createList('product', quantity)

    const wrapper = mount(Cart, {
      propsData: {
        products
      },
      mocks: {
        $cart: cartManager
      }
    })

    return { wrapper, products }
  }

  beforeEach(() => {
    cartManager = new CartManager()
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const { wrapper } = mountCart()

    expect(wrapper.vm).toBeDefined()
  })

  it('should not display empty cart button when there are no products', () => {
    const { wrapper } = mountCart(0)

    expect(wrapper.find('[data-testid="clear-cart-button"]').exists()).toBe(false)
  })

  it('should call the cartManager close method when close button gets clicked', async () => {
    const { wrapper } = mountCart()
    const spy = jest.spyOn(cartManager, 'close')

    const button = wrapper.find('[data-testid="close-button"]')

    await button.trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should hide the cart when no prop isOpen is passed', () => {
    const { wrapper } = mountCart()

    expect(wrapper.classes()).toContain('hidden')
  })

  it('should display the cart when prop isOpen is passed', async () => {
    const { wrapper } = mountCart()

    wrapper.setProps({ isOpen: true })

    await Vue.nextTick()

    expect(wrapper.classes()).not.toContain('hidden')
  })

  it('should display empty cart message when there are no products', () => {
    const { wrapper } = mountCart(0)

    expect(wrapper.text()).toContain(EMPTY_MESSAGE)
  })

  it('should display 2 instances of CartItem when 2 products are provided', () => {
    const { wrapper } = mountCart()

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2)
    expect(wrapper.text()).not.toContain(EMPTY_MESSAGE)
  })

  it('should display a button to clear the cart', () => {
    const { wrapper } = mountCart()
    const button = wrapper.find('[data-testid="clear-cart-button"]')

    expect(button.exists()).toBe(true)
  })

  it('should call the cartManager clearCart method when clear cart button gets clicked', async () => {
    const { wrapper } = mountCart()

    const spy = jest.spyOn(cartManager, 'clearCart')

    const button = wrapper.find('[data-testid="clear-cart-button"]')

    await button.trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
