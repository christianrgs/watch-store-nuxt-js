import { mount } from '@vue/test-utils'
import CartItem from '@/components/CartItem'
import { makeServer } from '@/miragejs/server'

describe('CartItem', () => {
  let server

  const mountCartItem = () => {
    const product = server.create('product')

    const wrapper = mount(CartItem, {
      propsData: {
        product
      }
    })

    return { wrapper, product }
  }

  beforeEach(() => {
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
})
