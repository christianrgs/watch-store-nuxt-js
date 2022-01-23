import { mount } from '@vue/test-utils'
import CartItem from '@/components/CartItem'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

describe('CartItem', () => {
  let server
  let cartManager

  const mountCartItem = () => {
    const product = server.create('product')

    const wrapper = mount(CartItem, {
      propsData: {
        product
      },
      mocks: {
        $cart: cartManager
      }
    })

    return { wrapper, product }
  }

  beforeEach(() => {
    cartManager = new CartManager()
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const { wrapper } = mountCartItem()

    expect(wrapper.vm).toBeDefined()
  })

  it('should display product information', () => {
    const { wrapper, product } = mountCartItem()
    const wrapperContent = wrapper.text()

    expect(wrapperContent).toContain(product.name)
    expect(wrapperContent).toContain(product.price)
  })

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')

    expect(quantity.text()).toBe('1')
  })

  it('should increase quantity when plus button gets clicked', async () => {
    const { wrapper } = mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="plus-button"]')

    await button.trigger('click')
    expect(quantity.text()).toBe('2')
    await button.trigger('click')
    expect(quantity.text()).toBe('3')
    await button.trigger('click')
    expect(quantity.text()).toBe('4')
  })

  it('should decrease quantity when minus button gets clicked', async () => {
    const { wrapper } = mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="minus-button"]')

    await button.trigger('click')
    expect(quantity.text()).toBe('0')
  })

  it('should not go below zero when minus button is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="minus-button"]')

    await button.trigger('click')
    await button.trigger('click')
    expect(quantity.text()).toBe('0')
  })

  it('should display a button to remove item from the cart', () => {
    const { wrapper } = mountCartItem()
    const button = wrapper.find('[data-testid="remove-button"]')

    expect(button.exists()).toBe(true)
  })

  it('should call the cartManager removeProduct method when remove button gets clicked', async () => {
    const { wrapper, product } = mountCartItem()
    const spy = jest.spyOn(cartManager, 'removeProduct')

    const button = wrapper.find('[data-testid="remove-button"]')

    await button.trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(product.id)
  })
})
