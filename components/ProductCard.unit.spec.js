import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

describe('ProductCard - unit', () => {
  let server
  let cartManager

  const mountProductCard = () => {
    const product = server.create('product')

    const wrapper = mount(ProductCard, {
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
    const { wrapper, product } = mountProductCard()

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain(product.name)
    expect(wrapper.text()).toContain(product.price)
  })

  it('should add product to cart state when button gets clicked', async () => {
    const { wrapper, product } = mountProductCard()
    const spyOpen = jest.spyOn(cartManager, 'open')
    const spyAddProduct = jest.spyOn(cartManager, 'addProduct')

    await wrapper.find('button').trigger('click')

    expect(spyOpen).toHaveBeenCalledTimes(1)
    expect(spyAddProduct).toHaveBeenCalledTimes(1)
    expect(spyAddProduct).toHaveBeenCalledWith(product)
  })
})
