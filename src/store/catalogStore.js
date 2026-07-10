import { create } from 'zustand'
import { commerceService } from '../services/commerceService'

let latestRequestId = 0

function numberOrNull(...values) {
  for (const value of values) {
    const parsed = Number(value)
    if (value !== null && value !== '' && Number.isFinite(parsed)) return parsed
  }
  return null
}

function normalizeImages(product) {
  const candidates = [
    product.imageUrl,
    product.image_url,
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
    ...(Array.isArray(product.gallery) ? product.gallery : []),
  ]
    .map(image => (typeof image === 'object' ? image.url || image.imageUrl : image))
    .filter(Boolean)

  return [...new Set(candidates)]
}

function getStock(product) {
  const warehouses = product.warehouses || product.stockByWarehouse || product.stock_by_warehouse
  const warehouseTotal = Array.isArray(warehouses)
    ? warehouses.reduce(
        (sum, warehouse) => sum + (numberOrNull(warehouse.quantity, warehouse.stock, warehouse.balance) || 0),
        0
      )
    : null

  return numberOrNull(
    typeof product.stock === 'object' ? product.stock.total ?? product.stock.quantity : product.stock,
    product.quantity,
    product.balance,
    product.stockQuantity,
    product.stock_quantity,
    warehouseTotal
  )
}

export function normalizeCommerceProduct(product, index = 0) {
  const id = String(product.id || product.ref || product.uuid || product.code || index)
  const code = String(product.code || product.article || id)
  const images = normalizeImages(product)
  const price = numberOrNull(product.price, product.currentPrice, product.current_price) || 0

  return {
    id,
    code,
    slug: code,
    name: product.name || product.full_name || product.fullName || code,
    full_name: product.full_name || product.fullName || product.name || code,
    description: product.description || '',
    article: product.article || '',
    group: product.group?.name || product.group || product.category?.name || product.category || '',
    segment: product.segment?.name || product.segment || product.productType || product.product_type || '',
    manufacturer: product.manufacturer?.name || product.manufacturer || '',
    country: product.country?.name || product.country || '',
    unit: product.unit?.name || product.unit || '',
    price,
    priceSince: product.priceSince || product.price_since || null,
    stock: getStock(product),
    currency: product.currency || '',
    images,
    categoryKey: 'all',
  }
}

function normalizeTaxonomyItem(item, index = 0) {
  if (typeof item === 'string') {
    return { id: item, value: item, label: item, count: null, children: [] }
  }

  const name = String(item.name || item.label || item.title || item.value || item.id || index)
  const id = String(item.code || item.id || item.ref || item.uuid || name)
  const childrenSource = item.children || item.items || item.groups || []
  return {
    id,
    // /api/unf/products/ expects the group filter to be the folder/category name, not code.
    value: name,
    label: item.label || item.name || item.title || name,
    parentId: String(
      item.parent?.code ||
        item.parent?.id ||
        item.parent?.ref ||
        item.parent?.name ||
        item.parent_code ||
        item.parent_id ||
        item.parentId ||
        item.parent ||
        ''
    ),
    count: numberOrNull(item.count, item.productsCount, item.products_count),
    children: Array.isArray(childrenSource)
      ? childrenSource.map((child, childIndex) => normalizeTaxonomyItem(child, childIndex))
      : [],
  }
}

function normalizeTaxonomyList(items) {
  const normalized = items.map(normalizeTaxonomyItem)
  const nodes = new Map(
    normalized.map(item => [item.id, { ...item, children: [...item.children] }])
  )
  const nodesByValue = new Map([...nodes.values()].map(item => [item.value, item]))
  const roots = []

  nodes.forEach(node => {
    const parent = nodes.get(node.parentId) || nodesByValue.get(node.parentId)
    if (parent && parent.id !== node.id) parent.children.push(node)
    else roots.push(node)
  })
  return roots
}

export const useCatalogStore = create((set, get) => ({
  products: [],
  groups: [],
  segments: [],
  status: 'idle',
  source: 'unavailable',
  error: null,
  total: 0,
  nextCursor: null,
  hasMore: false,
  filters: {},

  getProductById: id => get().products.find(product => product.id === id) || null,
  getProductBySlug: slug =>
    get().products.find(product => product.slug === slug || product.code === slug || product.id === slug) || null,

  loadFilters: async () => {
    try {
      const [groups, segments] = await Promise.all([
        commerceService.getProductGroups(),
        commerceService.getProductSegments(),
      ])
      set({
        groups: groups.length ? normalizeTaxonomyList(groups) : get().groups,
        segments: segments.length ? normalizeTaxonomyList(segments) : get().segments,
      })
    } catch {
      // Product results remain usable when optional filter dictionaries are unavailable.
    }
  },

  loadProducts: async (filters = {}, options = {}) => {
    const requestId = ++latestRequestId
    const append = Boolean(options.append)
    const nextFilters = { ...filters }
    set({ status: append ? get().status : 'loading', error: null, filters: nextFilters })

    try {
      const response = await commerceService.getProducts({
        ...nextFilters,
        cursor: append ? get().nextCursor : undefined,
        limit: nextFilters.limit || 24,
        include: 'all',
        byWarehouse: true,
        includeFolders: false,
        includeDeleted: false,
      })
      if (requestId !== latestRequestId) return []

      const normalized = response.items.map(normalizeCommerceProduct)
      const products = append
        ? [...get().products, ...normalized.filter(item => !get().products.some(current => current.id === item.id))]
        : normalized

      set({
        products,
        status: 'ready',
        source: 'live',
        total: response.total || products.length,
        nextCursor: response.nextCursor,
        hasMore: response.hasMore,
      })
      return normalized
    } catch (error) {
      if (requestId !== latestRequestId) return []
      set({
        products: [],
        status: 'ready',
        source: 'unavailable',
        error,
        total: 0,
        nextCursor: null,
        hasMore: false,
      })
      return []
    }
  },

  loadMore: () => {
    if (!get().hasMore || get().status === 'loading') return Promise.resolve([])
    return get().loadProducts(get().filters, { append: true })
  },

  loadProduct: async slug => {
    const existing = get().getProductBySlug(slug)
    if (existing && get().source === 'live') return existing

    try {
      const response = await commerceService.getProducts({
        code: slug,
        limit: 1,
        include: 'all',
        byWarehouse: true,
      })
      const product = response.items[0] ? normalizeCommerceProduct(response.items[0]) : existing
      if (product) {
        let relatedProducts = []
        if (product.group) {
          try {
            const relatedResponse = await commerceService.getProducts({
              group: product.group,
              limit: 5,
              include: 'all',
              byWarehouse: true,
              includeFolders: false,
              includeDeleted: false,
            })
            relatedProducts = relatedResponse.items.map(normalizeCommerceProduct)
          } catch {
            relatedProducts = []
          }
        }
        const incoming = [product, ...relatedProducts]
        const incomingIds = new Set(incoming.map(item => item.id))
        set(state => ({
          products: [...incoming, ...state.products.filter(item => !incomingIds.has(item.id))],
          source: 'live',
        }))
      }
      return product || null
    } catch {
      return existing || null
    }
  },
}))
