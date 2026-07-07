import { apiRequest, unwrapPayload } from './apiClient'

function buildQuery(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })
  const value = query.toString()
  return value ? `?${value}` : ''
}

function getCollection(payload, keys) {
  const data = unwrapPayload(payload)
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []

  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key]
  }
  return []
}

export function normalizeCollectionResponse(payload, keys) {
  const data = unwrapPayload(payload)
  return {
    items: getCollection(payload, keys),
    total: Number(data?.total ?? data?.count ?? data?.totalCount ?? 0) || null,
    nextCursor: data?.nextCursor ?? data?.next_cursor ?? data?.cursor?.next ?? null,
    hasMore: Boolean(data?.hasMore ?? data?.has_more ?? data?.nextCursor ?? data?.next_cursor),
  }
}

export const commerceService = {
  async getProducts(params) {
    const payload = await apiRequest(`/api/unf/products/${buildQuery(params)}`, { skipAuth: true })
    return normalizeCollectionResponse(payload, ['items', 'products', 'results'])
  },

  async getProductGroups() {
    const payload = await apiRequest('/api/unf/product-groups/', { skipAuth: true })
    return getCollection(payload, ['items', 'groups', 'results'])
  },

  async getProductSegments() {
    const payload = await apiRequest('/api/unf/product-segments/', { skipAuth: true })
    return getCollection(payload, ['items', 'segments', 'results'])
  },

  getCart() {
    return apiRequest('/api/clients/cart/')
  },

  addCartItem(productCode, quantity = 1) {
    return apiRequest('/api/clients/cart/items/', {
      method: 'POST',
      body: {
        product_code: productCode,
        quantity,
      },
    })
  },

  updateCartItem(productCode, quantity) {
    return apiRequest(`/api/clients/cart/items/${encodeURIComponent(productCode)}/`, {
      method: 'PATCH',
      body: { quantity },
    })
  },

  removeCartItem(productCode) {
    return apiRequest(`/api/clients/cart/items/${encodeURIComponent(productCode)}/`, {
      method: 'DELETE',
    })
  },

  getFavorites() {
    return apiRequest('/api/clients/favorites/')
  },

  addFavorite(productCode) {
    return apiRequest('/api/clients/favorites/', {
      method: 'POST',
      body: { product_code: productCode },
    })
  },

  removeFavorite(productCode) {
    return apiRequest(`/api/clients/favorites/${encodeURIComponent(productCode)}/`, {
      method: 'DELETE',
    })
  },
}
