const normalizeBackendText = value => {
  const text = String(value ?? '').trim()
  return text && text !== '-' ? text : ''
}

export const getLocalizedProduct = (product, t) => ({
  ...product,
  name:
    normalizeBackendText(product.name) ||
    normalizeBackendText(product.full_name) ||
    t('productData.notProvided'),
  description: normalizeBackendText(product.description) || t('productData.notProvided'),
  categoryLabel: normalizeBackendText(product.group) || t('productData.notProvided'),
  parentCategoryLabel: normalizeBackendText(product.group) || t('productData.notProvided'),
  specs: {
    code: normalizeBackendText(product.code) || t('productData.notProvided'),
    article: normalizeBackendText(product.article) || t('productData.notProvided'),
    manufacturer: normalizeBackendText(product.manufacturer) || t('productData.notProvided'),
    country: normalizeBackendText(product.country) || t('productData.notProvided'),
    unit: normalizeBackendText(product.unit) || t('productData.notProvided'),
    segment: normalizeBackendText(product.segment) || t('productData.notProvided'),
  },
})
