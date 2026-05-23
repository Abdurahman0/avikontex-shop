import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { products } from '../data/products'

const productsById = products.reduce((accumulator, product) => {
  accumulator[product.id] = product
  return accumulator
}, {})

const clampQuantity = (quantity, stock) => {
  if (quantity < 0) {
    return 0
  }

  if (quantity > stock) {
    return stock
  }

  return quantity
}

export const useShopStore = create(
  persist(
    (set, get) => ({
      cart: {},
      wishlist: [],
      orders: [],

      toggleWishlist: productId => {
        set(state => {
          const exists = state.wishlist.includes(productId)
          return {
            wishlist: exists
              ? state.wishlist.filter(id => id !== productId)
              : [...state.wishlist, productId],
          }
        })
      },

      addToCart: (productId, quantity = 1) => {
        const product = productsById[productId]
        if (!product || product.stock === 0) {
          return false
        }

        const currentQuantity = get().cart[productId] || 0
        const nextQuantity = clampQuantity(currentQuantity + quantity, product.stock)

        set(state => ({
          cart: {
            ...state.cart,
            [productId]: nextQuantity,
          },
        }))

        return nextQuantity > currentQuantity
      },

      updateCartQuantity: (productId, quantity) => {
        const product = productsById[productId]
        if (!product) {
          return
        }

        const safeQuantity = clampQuantity(quantity, product.stock)

        set(state => {
          const nextCart = { ...state.cart }

          if (safeQuantity === 0) {
            delete nextCart[productId]
          } else {
            nextCart[productId] = safeQuantity
          }

          return { cart: nextCart }
        })
      },

      removeFromCart: productId => {
        set(state => {
          const nextCart = { ...state.cart }
          delete nextCart[productId]
          return { cart: nextCart }
        })
      },

      clearCart: () => set({ cart: {} }),

      placeOrder: customer => {
        const cart = get().cart
        const items = Object.entries(cart)
          .map(([id, quantity]) => {
            const product = productsById[Number(id)]
            if (!product) {
              return null
            }

            return {
              productId: product.id,
              unitPrice: product.price,
              quantity,
            }
          })
          .filter(Boolean)

        if (!items.length) {
          return null
        }

        const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
        const delivery = subtotal >= 1000000 ? 0 : 35000
        const total = subtotal + delivery
        const orderId = `AVK-${Date.now().toString().slice(-8)}`

        const order = {
          id: orderId,
          statusKey: 'pending_confirmation',
          createdAt: new Date().toISOString(),
          customer,
          items,
          subtotal,
          delivery,
          total,
        }

        set(state => ({
          orders: [order, ...state.orders],
          cart: {},
        }))

        return orderId
      },
    }),
    {
      name: 'avikontex-shop-state',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
      }),
    }
  )
)

export const getProductById = productId => productsById[productId]
