import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'

describe('ProductCard - unit', () => {
  let server

  const mountProductCard = () => {
    const product = server.create('product')

    const wrapper = mount(ProductCard, {
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
    const { wrapper, product } = mountProductCard()

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain(product.name)
    expect(wrapper.text()).toContain(product.price)
  })

  it('should emit the event addToCart with product object when button gets clicked', async () => {
    const { wrapper, product } = mountProductCard()

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted().addToCart).toBeTruthy()
    expect(wrapper.emitted().addToCart.length).toBe(1)
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }])
  })
})
