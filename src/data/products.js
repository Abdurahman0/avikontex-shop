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
    totalCount: 1095,
    children: [
      { key: 'sterilization_baskets', totalCount: 365 },
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

export const backendProductsMock = [
  {
    id: '9d4ee25cf5b2c6c211e75e33aa47098d',
    code: '00000000010',
    name: 'Коробка стерилизационная круглая КСК-3',
    imageUrl:
      'https://64d6-2a05-45c2-51-fd00-20a4-4cb7-5939-92bc.ngrok-free.app/media/products/00000000001.jpg',
    article: '-',
    full_name: 'Коробка стерилизационная круглая КСК-3',
    description: '-',
    group: 'Биксы / корзины стерилизационные',
    segment: 'Потребительский (импортный)',
    unit: null,
    manufacturer: 'Гродненский завод торгового машиностроения ООО',
    country: 'БЕЛАРУСЬ',
    price: 21.84,
    priceSince: '2025-06-17T00:00:00',
  },
  {
    id: '0f7ad8a8bc374d4889b610504197c5f1',
    code: '00000000011',
    name: 'Стерилизатор плазменный PS-60',
    imageUrl: 'https://images.pexels.com/photos/8413159/pexels-photo-8413159.jpeg',
    article: 'PS-60',
    full_name: 'Стерилизатор плазменный PS-60',
    description: 'Низкотемпературная стерилизация медицинских инструментов.',
    group: 'Стерилизаторы плазменные',
    segment: 'Профессиональный (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK SteriTech',
    country: 'КИТАЙ',
    price: 2850,
    priceSince: '2025-08-01T00:00:00',
  },
  {
    id: 'c97abff7de87458e86a7be62ec2fcaf3',
    code: '00000000012',
    name: 'Автоклав медицинский Class B 23L',
    imageUrl: 'https://images.pexels.com/photos/6627664/pexels-photo-6627664.jpeg',
    article: 'AC-B23',
    full_name: 'Автоклав медицинский Class B 23L',
    description: 'Паровой автоклав с вакуумным циклом для клиник и стоматологии.',
    group: 'Автоклавы паровые',
    segment: 'Потребительский (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK SteriTech',
    country: 'КИТАЙ',
    price: 910,
    priceSince: '2025-07-12T00:00:00',
  },
  {
    id: 'e219158f98c54bb184675425d13f60a4',
    code: '00000000013',
    name: 'Монитор пациента PM-10',
    imageUrl: 'https://images.pexels.com/photos/6291261/pexels-photo-6291261.jpeg',
    article: 'PM-10',
    full_name: 'Монитор пациента PM-10',
    description: 'Многопараметрический монитор для палат и экстренной помощи.',
    group: 'Мониторы прикроватные',
    segment: 'Профессиональный (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Monitor Systems',
    country: 'КИТАЙ',
    price: 680,
    priceSince: '2025-09-04T00:00:00',
  },
  {
    id: '4892f5800a664726ad8148a9b7f55c28',
    code: '00000000014',
    name: 'Монитор пациента для ОРИТ MP-12',
    imageUrl: 'https://images.pexels.com/photos/30797638/pexels-photo-30797638.jpeg',
    article: 'MP-12 ICU',
    full_name: 'Монитор пациента для ОРИТ MP-12',
    description: 'Расширенный мониторинг и тревожные сигналы для отделений интенсивной терапии.',
    group: 'Мониторы для ОРИТ',
    segment: 'Профессиональный (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Monitor Systems',
    country: 'КИТАЙ',
    price: 930,
    priceSince: '2025-09-04T00:00:00',
  },
  {
    id: '2505e540c03c45e6bc1da28b9cc81667',
    code: '00000000015',
    name: 'Анализатор гематологический HA-320',
    imageUrl: 'https://images.pexels.com/photos/8442027/pexels-photo-8442027.jpeg',
    article: 'HA-320',
    full_name: 'Анализатор гематологический HA-320',
    description: 'Автоматический анализатор крови с трехкомпонентной дифференцировкой.',
    group: 'Анализаторы гематологические',
    segment: 'Лабораторный (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Lab Instruments',
    country: 'КИТАЙ',
    price: 1240,
    priceSince: '2025-05-20T00:00:00',
  },
  {
    id: 'e45f0c34d60d490797bba4ddb94c128e',
    code: '00000000016',
    name: 'Анализатор биохимический BA-200',
    imageUrl: 'https://images.pexels.com/photos/9951393/pexels-photo-9951393.jpeg',
    article: 'BA-200',
    full_name: 'Анализатор биохимический BA-200',
    description: 'Компактная random-access система для биохимических исследований.',
    group: 'Анализаторы биохимические',
    segment: 'Лабораторный (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Lab Instruments',
    country: 'КИТАЙ',
    price: 1680,
    priceSince: '2025-05-20T00:00:00',
  },
  {
    id: '6ec63baad49640dc814f5d553209eb70',
    code: '00000000017',
    name: 'Аппарат электрохирургический ESU-400',
    imageUrl: 'https://images.pexels.com/photos/6291088/pexels-photo-6291088.jpeg',
    article: 'ESU-400',
    full_name: 'Аппарат электрохирургический ESU-400',
    description: 'Монополярные и биполярные режимы резания и коагуляции.',
    group: 'Аппараты электрохирургические',
    segment: 'Хирургический (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Surgical',
    country: 'КИТАЙ',
    price: 760,
    priceSince: '2025-10-10T00:00:00',
  },
  {
    id: 'ab57e3514659401caa11d48d6a66e3ec',
    code: '00000000018',
    name: 'Светильник операционный SkyLED',
    imageUrl: 'https://images.pexels.com/photos/36101264/pexels-photo-36101264.jpeg',
    article: 'SKY-LED-5',
    full_name: 'Светильник операционный SkyLED',
    description: 'Бестеневой LED-свет с высокой цветопередачей для операционных.',
    group: 'Светильники операционные',
    segment: 'Хирургический (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Surgical',
    country: 'КИТАЙ',
    price: 1750,
    priceSince: '2025-10-10T00:00:00',
  },
  {
    id: 'a0c20c47a1b1440393a6633f12049596',
    code: '00000000019',
    name: 'Сканер ультразвуковой портативный X8',
    imageUrl: 'https://images.pexels.com/photos/7089029/pexels-photo-7089029.jpeg',
    article: 'US-X8',
    full_name: 'Сканер ультразвуковой портативный X8',
    description: 'Цифровая УЗ-система для малых клиник и мобильных диагностических бригад.',
    group: 'Системы ультразвуковой диагностики',
    segment: 'Диагностический (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK MedTech',
    country: 'КИТАЙ',
    price: 1490,
    priceSince: '2025-11-02T00:00:00',
  },
  {
    id: '55c41cd405aa4ed3ad436e8c0a705fba',
    code: '00000000020',
    name: 'Детектор рентгеновский цифровой DR17',
    imageUrl: 'https://images.pexels.com/photos/6235656/pexels-photo-6235656.jpeg',
    article: 'DR-17',
    full_name: 'Детектор рентгеновский цифровой DR17',
    description: 'Плоскопанельный детектор 17x17 для цифровой рентгенографии.',
    group: 'Рентгеновские детекторы',
    segment: 'Диагностический (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Imaging',
    country: 'КИТАЙ',
    price: 980,
    priceSince: '2025-11-02T00:00:00',
  },
  {
    id: 'b605d596eaae4df7b4867f9537af8cd6',
    code: '00000000021',
    name: 'Аппарат CPM для коленного сустава KM2',
    imageUrl: 'https://images.pexels.com/photos/29807423/pexels-photo-29807423.jpeg',
    article: 'CPM-KM2',
    full_name: 'Аппарат CPM для коленного сустава KM2',
    description: 'Программируемая пассивная разработка коленного сустава после операций.',
    group: 'Аппараты для механотерапии',
    segment: 'Реабилитационный (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Rehab',
    country: 'КИТАЙ',
    price: 820,
    priceSince: '2025-04-15T00:00:00',
  },
  {
    id: 'df5e6bed2ae44514af0f9c7b1ac733f5',
    code: '00000000022',
    name: 'Дорожка реабилитационная RT5',
    imageUrl: 'https://images.pexels.com/photos/4716814/pexels-photo-4716814.jpeg',
    article: 'REHAB-RT5',
    full_name: 'Дорожка реабилитационная RT5',
    description: 'Система для физиотерапии и восстановления подвижности.',
    group: 'Реабилитационные дорожки',
    segment: 'Реабилитационный (импортный)',
    unit: 'шт.',
    manufacturer: 'AVK Rehab',
    country: 'КИТАЙ',
    price: 1120,
    priceSince: '2025-04-15T00:00:00',
  },
]

const frontendOnlyByCode = {
  '00000000010': {
    categoryKey: 'sterilization_baskets',
    oldPrice: 24.9,
    stock: 18,
    rating: 4.8,
    featured: true,
    currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/6627664/pexels-photo-6627664.jpeg',
    galleryImages: ['https://images.pexels.com/photos/6627665/pexels-photo-6627665.jpeg'],
  },
  '00000000011': {
    categoryKey: 'plasma_sterilizers', oldPrice: 3090, stock: 3, rating: 4.8, featured: true, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/8413159/pexels-photo-8413159.jpeg',
    galleryImages: ['https://images.pexels.com/photos/9951400/pexels-photo-9951400.jpeg'],
  },
  '00000000012': {
    categoryKey: 'steam_autoclaves', oldPrice: 990, stock: 9, rating: 4.6, featured: false, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/6627664/pexels-photo-6627664.jpeg',
    galleryImages: ['https://images.pexels.com/photos/6627665/pexels-photo-6627665.jpeg'],
  },
  '00000000013': {
    categoryKey: 'bedside_monitoring', oldPrice: 760, stock: 20, rating: 4.9, featured: true, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/6291261/pexels-photo-6291261.jpeg',
    galleryImages: ['https://images.pexels.com/photos/3845129/pexels-photo-3845129.jpeg'],
  },
  '00000000014': {
    categoryKey: 'icu_monitoring', oldPrice: 0, stock: 6, rating: 4.7, featured: false, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/30797638/pexels-photo-30797638.jpeg',
    galleryImages: ['https://images.pexels.com/photos/4483340/pexels-photo-4483340.jpeg'],
  },
  '00000000015': {
    categoryKey: 'hematology_analyzers', oldPrice: 1370, stock: 5, rating: 4.8, featured: true, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/8442027/pexels-photo-8442027.jpeg',
    galleryImages: ['https://images.pexels.com/photos/6627667/pexels-photo-6627667.jpeg'],
  },
  '00000000016': {
    categoryKey: 'biochemistry_analyzers', oldPrice: 0, stock: 7, rating: 4.7, featured: false, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/9951393/pexels-photo-9951393.jpeg',
    galleryImages: ['https://images.pexels.com/photos/8442027/pexels-photo-8442027.jpeg'],
  },
  '00000000017': {
    categoryKey: 'electrosurgery_units', oldPrice: 840, stock: 11, rating: 4.8, featured: true, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/6291088/pexels-photo-6291088.jpeg',
    galleryImages: ['https://images.pexels.com/photos/36101262/pexels-photo-36101262.jpeg'],
  },
  '00000000018': {
    categoryKey: 'surgical_lighting', oldPrice: 1950, stock: 4, rating: 4.9, featured: true, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/36101264/pexels-photo-36101264.jpeg',
    galleryImages: ['https://images.pexels.com/photos/36101262/pexels-photo-36101262.jpeg'],
  },
  '00000000019': {
    categoryKey: 'ultrasound_imaging', oldPrice: 1690, stock: 12, rating: 4.9, featured: true, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/7089029/pexels-photo-7089029.jpeg',
    galleryImages: ['https://images.pexels.com/photos/7089304/pexels-photo-7089304.jpeg'],
  },
  '00000000020': {
    categoryKey: 'xray_imaging', oldPrice: 1090, stock: 8, rating: 4.8, featured: true, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/6235656/pexels-photo-6235656.jpeg',
    galleryImages: ['https://images.pexels.com/photos/7108421/pexels-photo-7108421.jpeg'],
  },
  '00000000021': {
    categoryKey: 'therapy_devices', oldPrice: 930, stock: 14, rating: 4.6, featured: false, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/29807423/pexels-photo-29807423.jpeg',
    galleryImages: ['https://images.pexels.com/photos/4162486/pexels-photo-4162486.jpeg'],
  },
  '00000000022': {
    categoryKey: 'rehab_treadmills', oldPrice: 1290, stock: 10, rating: 4.7, featured: false, currency: 'USD',
    fallbackImage: 'https://images.pexels.com/photos/4716814/pexels-photo-4716814.jpeg',
    galleryImages: ['https://images.pexels.com/photos/6046977/pexels-photo-6046977.png'],
  },
}

export const products = backendProductsMock.map(product => {
  const frontendOnly = frontendOnlyByCode[product.code]
  const primaryImage = product.imageUrl || frontendOnly.fallbackImage

  return {
    ...product,
    slug: product.code,
    categoryKey: frontendOnly.categoryKey,
    oldPrice: frontendOnly.oldPrice,
    stock: frontendOnly.stock,
    rating: frontendOnly.rating,
    featured: frontendOnly.featured,
    currency: frontendOnly.currency,
    images: [primaryImage, ...frontendOnly.galleryImages].filter(Boolean),
    frontendOnly,
  }
})

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

const normalizeBackendText = value => {
  const text = String(value ?? '').trim()
  return text && text !== '-' ? text : ''
}

export const getLocalizedProduct = (product, t) => ({
  ...product,
  name: normalizeBackendText(product.name) || normalizeBackendText(product.full_name),
  description: normalizeBackendText(product.description) || t('productData.notProvided'),
  categoryLabel: normalizeBackendText(product.group) || t(`categories.${product.categoryKey}`),
  parentCategoryLabel: t(`categories.${getParentCategoryKey(product.categoryKey)}`),
  specs: {
    code: normalizeBackendText(product.code),
    article: normalizeBackendText(product.article) || t('productData.notProvided'),
    manufacturer: normalizeBackendText(product.manufacturer) || t('productData.notProvided'),
    country: normalizeBackendText(product.country) || t('productData.notProvided'),
    unit: normalizeBackendText(product.unit) || t('productData.notProvided'),
    segment: normalizeBackendText(product.segment) || t('productData.notProvided'),
  },
})
