import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'

describe('ProductCard - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const product = server.create('product')

    const wrapper = mount(ProductCard, {
      propsData: {
        product
      }
    })

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain(product.name)
    expect(wrapper.text()).toContain(product.price)
  })
})
