<template>
  <div class="flex mt-6">
    <div class="flex w-full">
      <img class="h-20 w-20 object-cover rounded" :src="product.image" :alt="product.name" />
      <div class="mx-3 flex-1">
        <div class="flex items-start justify-between w-full">
          <h3 class="text-sm text-gray-600">{{ product.name }}</h3>
          <button data-testid="remove-button" @click="$cart.removeProduct(product.id)">
            <svg
              class="h-5 w-5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center">
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
              data-testid="minus-button"
              @click="decrease"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
            <span data-testid="quantity" class="text-gray-700 mx-2">{{ quantity }}</span>
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
              data-testid="plus-button"
              @click="quantity++"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
          <span class="text-gray-600">${{ product.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      quantity: 1
    }
  },
  methods: {
    decrease() {
      if (this.quantity) {
        this.quantity--
      }
    }
  }
}
</script>
