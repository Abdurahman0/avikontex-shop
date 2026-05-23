export const categoryTree = [
  {
    key: 'diagnostic_systems',
    iconKey: 'imaging',
    totalCount: 860,
    children: [
      { key: 'ultrasound_imaging', totalCount: 430 },
      { key: 'xray_imaging', totalCount: 430 },
    ],
  },
  {
    key: 'monitoring_systems',
    iconKey: 'monitoring',
    totalCount: 1240,
    children: [
      { key: 'bedside_monitoring', totalCount: 620 },
      { key: 'icu_monitoring', totalCount: 620 },
    ],
  },
  {
    key: 'laboratory_systems',
    iconKey: 'laboratory',
    totalCount: 980,
    children: [
      { key: 'hematology_analyzers', totalCount: 490 },
      { key: 'biochemistry_analyzers', totalCount: 490 },
    ],
  },
  {
    key: 'surgical_systems',
    iconKey: 'surgical',
    totalCount: 1420,
    children: [
      { key: 'electrosurgery_units', totalCount: 710 },
      { key: 'surgical_lighting', totalCount: 710 },
    ],
  },
  {
    key: 'sterilization_systems',
    iconKey: 'sterilization',
    totalCount: 730,
    children: [
      { key: 'plasma_sterilizers', totalCount: 365 },
      { key: 'steam_autoclaves', totalCount: 365 },
    ],
  },
  {
    key: 'rehabilitation_systems',
    iconKey: 'rehabilitation',
    totalCount: 770,
    children: [
      { key: 'rehab_treadmills', totalCount: 385 },
      { key: 'therapy_devices', totalCount: 385 },
    ],
  },
]

const leafCategoryDefinitions = categoryTree.flatMap(parent =>
  parent.children.map(child => ({
    ...child,
    parentKey: parent.key,
    parentIconKey: parent.iconKey,
  }))
)

const leafCategoryKeys = leafCategoryDefinitions.map(category => category.key)
const parentCategoryKeys = categoryTree.map(category => category.key)
const categoryKeys = ['all', ...parentCategoryKeys, ...leafCategoryKeys]

const parentCategoryByLeafKey = Object.fromEntries(
  leafCategoryDefinitions.map(category => [category.key, category.parentKey])
)

const categoryDefinitionByKey = Object.fromEntries(
  [...categoryTree, ...leafCategoryDefinitions].map(category => [category.key, category])
)

export const products = [
  {
    id: 1,
    slug: 'portable-ultrasound-scanner-x8',
    translationKey: 'p1',
    categoryKey: 'ultrasound_imaging',
    price: 18900000,
    oldPrice: 21500000,
    stock: 12,
    rating: 4.9,
    images: [
      'https://images.pexels.com/photos/7089029/pexels-photo-7089029.jpeg?cs=srgb&dl=pexels-mart-production-7089029.jpg&fm=jpg',
      'https://images.pexels.com/photos/7089304/pexels-photo-7089304.jpeg?cs=srgb&dl=pexels-mart-production-7089304.jpg&fm=jpg',
    ],
    featured: true,
  },
  {
    id: 2,
    slug: 'digital-xray-sensor-dr17',
    translationKey: 'p2',
    categoryKey: 'xray_imaging',
    price: 12400000,
    oldPrice: 13900000,
    stock: 8,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/6235656/pexels-photo-6235656.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-6235656.jpg&fm=jpg',
      'https://images.pexels.com/photos/7108421/pexels-photo-7108421.jpeg?cs=srgb&dl=pexels-pavel-danilyuk-7108421.jpg&fm=jpg',
    ],
    featured: true,
  },
  {
    id: 3,
    slug: 'bedside-patient-monitor-pm10',
    translationKey: 'p3',
    categoryKey: 'bedside_monitoring',
    price: 8600000,
    oldPrice: 9600000,
    stock: 20,
    rating: 4.9,
    images: [
      'https://images.pexels.com/photos/6291261/pexels-photo-6291261.jpeg?cs=srgb&dl=pexels-shvetsa-6291261.jpg&fm=jpg',
      'https://images.pexels.com/photos/3845129/pexels-photo-3845129.jpeg?cs=srgb&dl=pexels-shvetsa-3845129.jpg&fm=jpg',
    ],
    featured: true,
  },
  {
    id: 4,
    slug: 'icu-multiparameter-monitor-mp12',
    translationKey: 'p4',
    categoryKey: 'icu_monitoring',
    price: 11300000,
    oldPrice: 0,
    stock: 6,
    rating: 4.7,
    images: [
      'https://images.pexels.com/photos/30797638/pexels-photo-30797638.jpeg?cs=srgb&dl=pexels-duksi-30797638.jpg&fm=jpg',
      'https://images.pexels.com/photos/4483340/pexels-photo-4483340.jpeg?cs=srgb&dl=pexels-shvetsa-4483340.jpg&fm=jpg',
    ],
    featured: false,
  },
  {
    id: 5,
    slug: 'hematology-analyzer-ha320',
    translationKey: 'p5',
    categoryKey: 'hematology_analyzers',
    price: 14600000,
    oldPrice: 16100000,
    stock: 5,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/8442027/pexels-photo-8442027.jpeg?cs=srgb&dl=pexels-pavel-danilyuk-8442027.jpg&fm=jpg',
      'https://images.pexels.com/photos/6627667/pexels-photo-6627667.jpeg?cs=srgb&dl=pexels-karola-g-6627667.jpg&fm=jpg',
    ],
    featured: true,
  },
  {
    id: 6,
    slug: 'biochemistry-analyzer-ba200',
    translationKey: 'p6',
    categoryKey: 'biochemistry_analyzers',
    price: 17200000,
    oldPrice: 0,
    stock: 7,
    rating: 4.7,
    images: [
      'https://images.pexels.com/photos/8442027/pexels-photo-8442027.jpeg?cs=srgb&dl=pexels-pavel-danilyuk-8442027.jpg&fm=jpg',
      'https://images.pexels.com/photos/9951393/pexels-photo-9951393.jpeg?cs=srgb&dl=pexels-bakytzhan-baurzhanov-854600-9951393.jpg&fm=jpg',
    ],
    featured: false,
  },
  {
    id: 7,
    slug: 'electrosurgical-unit-esu400',
    translationKey: 'p7',
    categoryKey: 'electrosurgery_units',
    price: 9800000,
    oldPrice: 10800000,
    stock: 11,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/6291088/pexels-photo-6291088.jpeg?cs=srgb&dl=pexels-shvetsa-6291088.jpg&fm=jpg',
      'https://images.pexels.com/photos/36101262/pexels-photo-36101262.jpeg?cs=srgb&dl=pexels-fernando-capetillo-94107723-36101262.jpg&fm=jpg',
    ],
    featured: true,
  },
  {
    id: 8,
    slug: 'led-surgical-light-skyled',
    translationKey: 'p8',
    categoryKey: 'surgical_lighting',
    price: 22100000,
    oldPrice: 24500000,
    stock: 4,
    rating: 4.9,
    images: [
      'https://images.pexels.com/photos/36101264/pexels-photo-36101264.jpeg?cs=srgb&dl=pexels-fernando-capetillo-94107723-36101264.jpg&fm=jpg',
      'https://images.pexels.com/photos/36101262/pexels-photo-36101262.jpeg?cs=srgb&dl=pexels-fernando-capetillo-94107723-36101262.jpg&fm=jpg',
    ],
    featured: true,
  },
  {
    id: 9,
    slug: 'plasma-sterilizer-ps60',
    translationKey: 'p9',
    categoryKey: 'plasma_sterilizers',
    price: 25700000,
    oldPrice: 0,
    stock: 3,
    rating: 4.8,
    images: [
      'https://images.pexels.com/photos/8413159/pexels-photo-8413159.jpeg?cs=srgb&dl=pexels-shvets-production-8413159.jpg&fm=jpg',
      'https://images.pexels.com/photos/9951400/pexels-photo-9951400.jpeg?cs=srgb&dl=pexels-bakytzhan-baurzhanov-854600-9951400.jpg&fm=jpg',
    ],
    featured: false,
  },
  {
    id: 10,
    slug: 'autoclave-classb-23l',
    translationKey: 'p10',
    categoryKey: 'steam_autoclaves',
    price: 7900000,
    oldPrice: 8700000,
    stock: 9,
    rating: 4.6,
    images: [
      'https://images.pexels.com/photos/6627664/pexels-photo-6627664.jpeg?cs=srgb&dl=pexels-karola-g-6627664.jpg&fm=jpg',
      'https://images.pexels.com/photos/6627665/pexels-photo-6627665.jpeg?cs=srgb&dl=pexels-karola-g-6627665.jpg&fm=jpg',
    ],
    featured: false,
  },
  {
    id: 11,
    slug: 'medical-rehab-treadmill-rt5',
    translationKey: 'p11',
    categoryKey: 'rehab_treadmills',
    price: 13200000,
    oldPrice: 14900000,
    stock: 10,
    rating: 4.7,
    images: [
      'https://images.pexels.com/photos/4716814/pexels-photo-4716814.jpeg?cs=srgb&dl=pexels-jdgromov-4716814.jpg&fm=jpg',
      'https://images.pexels.com/photos/6046977/pexels-photo-6046977.png?cs=srgb&dl=pexels-totalshape-6046977.jpg&fm=jpg',
    ],
    featured: false,
  },
  {
    id: 12,
    slug: 'cpm-knee-therapy-device-km2',
    translationKey: 'p12',
    categoryKey: 'therapy_devices',
    price: 10400000,
    oldPrice: 11900000,
    stock: 14,
    rating: 4.6,
    images: [
      'https://images.pexels.com/photos/29807423/pexels-photo-29807423.jpeg?cs=srgb&dl=pexels-recovery-sport-center-2147880161-29807423.jpg&fm=jpg',
      'https://images.pexels.com/photos/4162486/pexels-photo-4162486.jpeg?cs=srgb&dl=pexels-ivan-samkov-4162486.jpg&fm=jpg',
    ],
    featured: false,
  },
]

export const categoryFilterKeys = categoryKeys

export const getCatalogTotal = () =>
  categoryTree.reduce((total, category) => total + category.totalCount, 0)

export const isLeafCategory = categoryKey => leafCategoryKeys.includes(categoryKey)

export const getParentCategoryKey = categoryKey =>
  parentCategoryByLeafKey[categoryKey] || categoryKey

export const getCategoryNodeByKey = categoryKey => categoryDefinitionByKey[categoryKey] || null

export const getCategoryOptions = t =>
  categoryFilterKeys.map(key => {
    if (key === 'all') {
      return { key, label: t('categories.all') }
    }

    if (isLeafCategory(key)) {
      const parentKey = getParentCategoryKey(key)
      return {
        key,
        label: `${t(`categories.${parentKey}`)} / ${t(`categories.${key}`)}`,
      }
    }

    return {
      key,
      label: t(`categories.${key}`),
    }
  })

export const getCategoryStats = t => {
  const totalCount = getCatalogTotal()

  return [
    {
      key: 'all',
      label: t('categories.all'),
      totalCount,
      iconKey: 'all',
      children: [],
    },
    ...categoryTree.map(category => ({
      key: category.key,
      label: t(`categories.${category.key}`),
      totalCount: category.totalCount,
      iconKey: category.iconKey,
      children: category.children.map(child => ({
        key: child.key,
        label: t(`categories.${child.key}`),
        totalCount: child.totalCount,
        parentKey: category.key,
      })),
    })),
  ]
}

export const getLocalizedProduct = (product, t) => {
  const productPath = `products.${product.translationKey}`

  return {
    ...product,
    name: t(`${productPath}.name`),
    description: t(`${productPath}.description`),
    categoryLabel: t(`categories.${product.categoryKey}`),
    parentCategoryLabel: t(`categories.${getParentCategoryKey(product.categoryKey)}`),
    specs: {
      material: t(`${productPath}.material`),
      fit: t(`${productPath}.fit`),
      origin: t(`${productPath}.origin`),
    },
  }
}
