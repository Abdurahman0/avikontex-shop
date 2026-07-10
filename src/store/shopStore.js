import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { commerceService } from '../services/commerceService'
import { TEST_PRODUCT_IMAGE, normalizeCommerceProduct, useCatalogStore } from './catalogStore'

if (typeof window !== 'undefined') {
  localStorage.removeItem('avikontex-shop-state-v2')
  localStorage.removeItem('avikontex-shop-state-v3')
}

const withTestImage = product =>
  product ? { ...product, images: [TEST_PRODUCT_IMAGE] } : null

const resolveProduct = (productId, snapshots = {}) =>
  withTestImage(useCatalogStore.getState().getProductById(productId) || snapshots[productId])

const clampQuantity = (quantity, stock) => {
  if (quantity < 0) return 0
  if (Number.isFinite(stock) && quantity > stock) return stock
  return quantity
}

const getProductCode = product => product?.code || product?.slug || product?.id || ''

function getCartData(payload) {
  const data = payload?.data ?? payload ?? {}
  return data && typeof data === 'object' ? data : {}
}

function normalizeBackendProduct(product, fallbackCode, index = 0) {
  if (!product || typeof product !== 'object') {
    return null
  }

  return normalizeCommerceProduct(
    {
      ...product,
      code: product.code || fallbackCode,
    },
    index
  )
}

function normalizeCartState(payload) {
  const data = getCartData(payload)
  const items = Array.isArray(data.items) ? data.items : []
  const cart = {}
  const productSnapshots = {}

  items.forEach((item, index) => {
    const product = normalizeBackendProduct(item.product, item.product_code, index)
    if (!product) return

    const quantity = Number(item.quantity) || 0
    if (quantity <= 0) return

    cart[product.id] = quantity
    productSnapshots[product.id] = product
  })

  return {
    cart,
    productSnapshots,
    cartTotal: Number(data.total) || 0,
    cartLineCount: Number(data.count) || items.length,
  }
}

function normalizeFavoritesState(payload) {
  const data = payload?.data ?? payload ?? []
  const items = Array.isArray(data) ? data : []
  const wishlist = []
  const productSnapshots = {}

  items.forEach((item, index) => {
    const rawProduct = item.product || item
    const product = normalizeBackendProduct(rawProduct, item.product_code || rawProduct?.code, index)
    if (!product) return

    wishlist.push(product.id)
    productSnapshots[product.id] = product
  })

  return {
    wishlist: [...new Set(wishlist)],
    productSnapshots,
  }
}

export const useShopStore = create(
  persist(
    (set, get) => ({
      cart: {},
      wishlist: [],
      orders: [],
      productSnapshots: {},
      cartTotal: 0,
      cartLineCount: 0,
      status: 'idle',
      error: null,
      cartMutations: {},
      wishlistMutations: {},

      setCartMutation: (productId, isLoading) => {
        set(state => {
          const nextMutations = { ...state.cartMutations }
          if (isLoading) nextMutations[productId] = true
          else delete nextMutations[productId]
          return { cartMutations: nextMutations }
        })
      },

      setWishlistMutation: (productId, isLoading) => {
        set(state => {
          const nextMutations = { ...state.wishlistMutations }
          if (isLoading) nextMutations[productId] = true
          else delete nextMutations[productId]
          return { wishlistMutations: nextMutations }
        })
      },

      syncRemote: async () => {
        set({ status: 'loading', error: null })
        try {
          const [cartPayload, favoritesPayload] = await Promise.all([
            commerceService.getCart(),
            commerceService.getFavorites(),
          ])
          const cartState = normalizeCartState(cartPayload)
          const favoritesState = normalizeFavoritesState(favoritesPayload)
          set(state => ({
            cart: cartState.cart,
            wishlist: favoritesState.wishlist,
            productSnapshots: {
              ...state.productSnapshots,
              ...cartState.productSnapshots,
              ...favoritesState.productSnapshots,
            },
            cartTotal: cartState.cartTotal,
            cartLineCount: cartState.cartLineCount,
            status: 'ready',
            error: null,
          }))
        } catch (error) {
          set({ status: 'error', error })
        }
      },

      toggleWishlist: async (productId, productSnapshot) => {
        const product = productSnapshot || resolveProduct(productId, get().productSnapshots)
        const productCode = getProductCode(product)
        if (!product || !productCode) return false
        if (get().wishlistMutations[product.id]) {
          return get().wishlist.includes(product.id)
        }

        const exists = get().wishlist.includes(product.id)
        get().setWishlistMutation(product.id, true)
        try {
          if (exists) {
            await commerceService.removeFavorite(productCode)
            set(state => ({
              wishlist: state.wishlist.filter(id => id !== product.id),
              productSnapshots: { ...state.productSnapshots, [product.id]: product },
              error: null,
            }))
            return false
          }

          const payload = await commerceService.addFavorite(productCode)
          const backendProduct = normalizeBackendProduct(payload?.data, productCode) || product
          set(state => ({
            wishlist: [...new Set([...state.wishlist, backendProduct.id])],
            productSnapshots: { ...state.productSnapshots, [backendProduct.id]: backendProduct },
            error: null,
          }))
          return true
        } catch (error) {
          set({ error })
          return exists
        } finally {
          get().setWishlistMutation(product.id, false)
        }
      },

      addToCart: async (productId, quantity = 1, productSnapshot) => {
        const product = productSnapshot || resolveProduct(productId, get().productSnapshots)
        const productCode = getProductCode(product)
        if (!product || !productCode || product.stock === 0) return false
        if (get().cartMutations[product.id]) return false

        const currentQuantity = get().cart[product.id] || 0
        const remainingQuantity = Number.isFinite(product.stock)
          ? product.stock - currentQuantity
          : quantity
        if (Number.isFinite(product.stock) && remainingQuantity < 1) return false

        const safeQuantity = clampQuantity(
          Number.isFinite(product.stock) ? Math.min(quantity, remainingQuantity) : quantity,
          product.stock
        )
        if (safeQuantity <= 0) return false

        get().setCartMutation(product.id, true)
        try {
          const payload = await commerceService.addCartItem(productCode, safeQuantity)
          const cartState = normalizeCartState(payload)
          const nextQuantity = cartState.cart[product.id] || currentQuantity + safeQuantity
          set(state => ({
            cart: cartState.cart,
            productSnapshots: {
              ...state.productSnapshots,
              [product.id]: product,
              ...cartState.productSnapshots,
            },
            cartTotal: cartState.cartTotal,
            cartLineCount: cartState.cartLineCount,
            error: null,
          }))
          return nextQuantity > currentQuantity
        } catch (error) {
          set({ error })
          return false
        } finally {
          get().setCartMutation(product.id, false)
        }
      },

      updateCartQuantity: async (productId, quantity) => {
        const product = resolveProduct(productId, get().productSnapshots)
        const productCode = getProductCode(product)
        if (!product || !productCode) return false
        if (get().cartMutations[product.id]) return false

        const safeQuantity = clampQuantity(quantity, product.stock)
        get().setCartMutation(product.id, true)
        try {
          const payload = safeQuantity === 0
            ? await commerceService.removeCartItem(productCode)
            : await commerceService.updateCartItem(productCode, safeQuantity)
          const cartState = normalizeCartState(payload)
          set(state => ({
            cart: cartState.cart,
            productSnapshots: { ...state.productSnapshots, ...cartState.productSnapshots },
            cartTotal: cartState.cartTotal,
            cartLineCount: cartState.cartLineCount,
            error: null,
          }))
          return true
        } catch (error) {
          set({ error })
          return false
        } finally {
          get().setCartMutation(product.id, false)
        }
      },

      removeFromCart: async productId => {
        const product = resolveProduct(productId, get().productSnapshots)
        const productCode = getProductCode(product)
        if (!product || !productCode) return false
        if (get().cartMutations[product.id]) return false

        get().setCartMutation(product.id, true)
        try {
          const payload = await commerceService.removeCartItem(productCode)
          const cartState = normalizeCartState(payload)
          set(state => ({
            cart: cartState.cart,
            productSnapshots: { ...state.productSnapshots, ...cartState.productSnapshots },
            cartTotal: cartState.cartTotal,
            cartLineCount: cartState.cartLineCount,
            error: null,
          }))
          return true
        } catch (error) {
          set({ error })
          return false
        } finally {
          get().setCartMutation(product.id, false)
        }
      },

      clearCart: async () => {
        const products = Object.keys(get().cart)
          .map(productId => resolveProduct(productId, get().productSnapshots))
          .filter(Boolean)

        set({ cart: {}, cartTotal: 0, cartLineCount: 0 })

        await Promise.allSettled(
          products
            .map(getProductCode)
            .filter(Boolean)
            .map(productCode => commerceService.removeCartItem(productCode))
        )
      },

      placeOrder: async customer => {
        const items = Object.entries(get().cart)
          .map(([id, quantity]) => {
            const product = resolveProduct(id, get().productSnapshots)
            if (!product) return null
            return {
              productId: product.id,
              unitPrice: product.price,
              quantity,
              product,
            }
          })
          .filter(Boolean)

        if (!items.length) return null

        const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
        const delivery = subtotal >= 500 ? 0 : 15
        const order = {
          id: `AVK-${Date.now().toString().slice(-8)}`,
          statusKey: 'pending_confirmation',
          createdAt: new Date().toISOString(),
          customer,
          items,
          subtotal,
          delivery,
          total: subtotal + delivery,
          currency: items[0].product?.currency || '',
          source: 'local',
        }

        set(state => ({ orders: [order, ...state.orders] }))
        await get().clearCart()
        return order.id
      },
    }),
    {
      name: 'avikontex-shop-state-v4',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        orders: state.orders,
        productSnapshots: state.productSnapshots,
      }),
    }
  )
)

export const getProductById = productId =>
  resolveProduct(productId, useShopStore.getState().productSnapshots)
