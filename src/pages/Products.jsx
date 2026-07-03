import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlineCpuChip,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineRectangleGroup,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineWrenchScrewdriver,
  HiXMark,
} from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/catalog/ProductGrid'
import EmptyState from '../components/common/EmptyState'
import {
  getCatalogTotal,
  getCategoryStats,
  getLocalizedProduct,
  getParentCategoryKey,
  isLeafCategory,
  products,
} from '../data/products'
import { formatPrice } from '../utils/formatPrice'

const CATEGORY_ICON_MAP = {
  all: HiOutlineRectangleGroup,
  imaging: HiOutlineCpuChip,
  monitoring: HiOutlineChartBar,
  laboratory: HiOutlineBeaker,
  surgical: HiOutlineWrenchScrewdriver,
  sterilization: HiOutlineShieldCheck,
  rehabilitation: HiOutlineSparkles,
}

const MIN_PRICE = Math.min(...products.map(product => product.price))
const MAX_PRICE = Math.max(...products.map(product => product.price))
const PRICE_STEP = 1
const PAGE_SIZE = 24

function Products() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [expandedParents, setExpandedParents] = useState([
    'diagnostic_systems',
    'monitoring_systems',
  ])
  const [searchInput, setSearchInput] = useState((searchParams.get('q') || '').trim())
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const [draftCategory, setDraftCategory] = useState(selectedCategory)
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice)
  const [draftExpandedParents, setDraftExpandedParents] = useState(expandedParents)
  const [draftSearchInput, setDraftSearchInput] = useState(searchInput)

  const searchKeyword = searchInput.toLowerCase().trim()
  const categoryStats = useMemo(() => getCategoryStats(t), [t])
  const catalogTotal = useMemo(() => getCatalogTotal(), [])

  const parentCategories = useMemo(
    () => categoryStats.filter(category => category.key !== 'all'),
    [categoryStats]
  )

  const searchableProducts = useMemo(
    () =>
      products.map(product => {
        const localizedProduct = getLocalizedProduct(product, t)
        return {
          product,
          normalizedName: localizedProduct.name.toLowerCase(),
          normalizedCategory: localizedProduct.categoryLabel.toLowerCase(),
          normalizedParentCategory: localizedProduct.parentCategoryLabel.toLowerCase(),
          normalizedCode: String(product.code || '').toLowerCase(),
          normalizedArticle: String(product.article || '').toLowerCase(),
          normalizedManufacturer: String(product.manufacturer || '').toLowerCase(),
          normalizedSegment: String(product.segment || '').toLowerCase(),
        }
      }),
    [t]
  )

  const filterByCriteria = useCallback(
    (categoryKey, priceLimit, keyword) =>
      searchableProducts
        .filter(
          ({
            product,
            normalizedName,
            normalizedCategory,
            normalizedParentCategory,
            normalizedCode,
            normalizedArticle,
            normalizedManufacturer,
            normalizedSegment,
          }) => {
            const matchesCategory =
              categoryKey === 'all' ||
              (isLeafCategory(categoryKey)
                ? product.categoryKey === categoryKey
                : getParentCategoryKey(product.categoryKey) === categoryKey)

            const matchesPrice = product.price <= priceLimit
            const matchesKeyword =
              !keyword ||
              normalizedName.includes(keyword) ||
              normalizedCategory.includes(keyword) ||
              normalizedParentCategory.includes(keyword) ||
              normalizedCode.includes(keyword) ||
              normalizedArticle.includes(keyword) ||
              normalizedManufacturer.includes(keyword) ||
              normalizedSegment.includes(keyword)

            return matchesCategory && matchesPrice && matchesKeyword
          }
        )
        .map(({ product }) => product),
    [searchableProducts]
  )

  const filteredProducts = useMemo(
    () => filterByCriteria(selectedCategory, maxPrice, searchKeyword),
    [filterByCriteria, maxPrice, searchKeyword, selectedCategory]
  )

  const draftResultCount = useMemo(
    () => filterByCriteria(draftCategory, draftMaxPrice, draftSearchInput.toLowerCase().trim()).length,
    [draftCategory, draftMaxPrice, draftSearchInput, filterByCriteria]
  )

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  )

  const hasMoreProducts = visibleCount < filteredProducts.length

  const toggleParent = parentKey => {
    setExpandedParents(current =>
      current.includes(parentKey)
        ? current.filter(key => key !== parentKey)
        : [...current, parentKey]
    )
  }

  const toggleDraftParent = parentKey => {
    setDraftExpandedParents(current =>
      current.includes(parentKey)
        ? current.filter(key => key !== parentKey)
        : [...current, parentKey]
    )
  }

  const openMobileFilters = () => {
    setDraftCategory(selectedCategory)
    setDraftMaxPrice(maxPrice)
    setDraftExpandedParents(expandedParents)
    setDraftSearchInput(searchInput)
    setIsMobileFiltersOpen(true)
  }

  const closeMobileFilters = () => {
    setIsMobileFiltersOpen(false)
  }

  const resetDesktopFilters = () => {
    setSelectedCategory('all')
    setMaxPrice(MAX_PRICE)
    setSearchInput('')
    setExpandedParents(parentCategories.slice(0, 2).map(category => category.key))
  }

  const resetDraftFilters = () => {
    setDraftCategory('all')
    setDraftMaxPrice(MAX_PRICE)
    setDraftSearchInput('')
    setDraftExpandedParents(parentCategories.slice(0, 2).map(category => category.key))
  }

  const applyMobileFilters = () => {
    setSelectedCategory(draftCategory)
    setMaxPrice(draftMaxPrice)
    setSearchInput(draftSearchInput)
    setExpandedParents(draftExpandedParents)
    setIsMobileFiltersOpen(false)
  }

  useEffect(() => {
    if (!isMobileFiltersOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileFiltersOpen])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [selectedCategory, maxPrice, searchKeyword])

  const renderCategoryTree = (currentCategory, currentExpandedParents, onSelect, onToggle) => (
    <div className='space-y-2'>
      <button
        type='button'
        onClick={() => onSelect('all')}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
          currentCategory === 'all'
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
        }`}
      >
        <span className='flex items-center gap-2'>
          <HiOutlineRectangleGroup className='text-lg' />
          <span className='text-sm font-semibold'>{t('categories.all')}</span>
        </span>
        <span className='text-xs opacity-80'>{catalogTotal.toLocaleString(i18n.language)}</span>
      </button>

      {parentCategories.map(parent => {
        const Icon = CATEGORY_ICON_MAP[parent.iconKey] || HiOutlineRectangleGroup
        const isOpen = currentExpandedParents.includes(parent.key)
        const isParentSelected = currentCategory === parent.key

        return (
          <article key={parent.key} className='overflow-hidden rounded-xl border border-slate-200'>
            <div className='flex items-center'>
              <button
                type='button'
                onClick={() => onSelect(parent.key)}
                className={`flex flex-1 items-center justify-between px-3 py-2 text-left transition ${
                  isParentSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <Icon className='text-lg' />
                  <span className='text-sm font-semibold'>{parent.label}</span>
                </span>
                <span className='text-xs opacity-80'>{parent.totalCount.toLocaleString(i18n.language)}</span>
              </button>
              <button
                type='button'
                onClick={() => onToggle(parent.key)}
                aria-label={t('catalog.toggleSubcategories')}
                className='border-l border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50'
              >
                {isOpen ? <HiChevronUp /> : <HiChevronDown />}
              </button>
            </div>

            {isOpen ? (
              <div className='space-y-1 border-t border-slate-200 bg-slate-50 p-2'>
                {parent.children.map(child => {
                  const isChildSelected = currentCategory === child.key

                  return (
                    <button
                      key={child.key}
                      type='button'
                      onClick={() => onSelect(child.key)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition ${
                        isChildSelected ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span>{child.label}</span>
                      <span className='text-xs opacity-80'>{child.totalCount.toLocaleString(i18n.language)}</span>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )

  return (
    <div className='space-y-6'>
      <section className='rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-100 p-5 shadow-sm sm:p-6'>
        <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl'>{t('catalog.title')}</h1>
        <p className='mt-2 max-w-3xl text-sm text-slate-600 sm:text-base'>{t('catalog.description')}</p>

        <div className='mt-4 grid gap-3 sm:grid-cols-3'>
          <article className='rounded-2xl border border-slate-200 bg-white/90 p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>{t('catalog.totalCatalogLabel')}</p>
            <p className='mt-2 text-2xl font-bold text-slate-900'>{catalogTotal.toLocaleString(i18n.language)}</p>
          </article>
          <article className='rounded-2xl border border-slate-200 bg-white/90 p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>{t('catalog.visibleResultsLabel')}</p>
            <p className='mt-2 text-2xl font-bold text-slate-900'>{filteredProducts.length}</p>
          </article>
          <article className='rounded-2xl border border-slate-200 bg-white/90 p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>{t('catalog.categoriesLabel')}</p>
            <p className='mt-2 text-2xl font-bold text-slate-900'>{parentCategories.length}</p>
          </article>
        </div>
      </section>

      <section className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:hidden'>
        <p className='text-sm font-semibold text-slate-700'>
          {t('catalog.visibleResultsLabel')}: {filteredProducts.length}
        </p>
        <button
          type='button'
          onClick={openMobileFilters}
          className='inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700'
        >
          <HiOutlineFunnel className='text-lg' />
          <span>{t('catalog.mobileFilterButton')}</span>
        </button>
      </section>

      <section className='grid gap-4 sm:grid-cols-[320px_1fr]'>
        <aside className='hidden h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:sticky sm:top-24 sm:block sm:self-start'>
          <div>
            <h2 className='text-lg font-semibold text-slate-900'>{t('catalog.navigatorTitle')}</h2>
            <p className='mt-1 text-sm text-slate-500'>{t('catalog.navigatorDescription')}</p>
          </div>

          <label className='relative block'>
            <HiOutlineMagnifyingGlass className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400' />
            <input
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder={t('catalog.mobileSearchPlaceholder')}
              aria-label={t('catalog.mobileSearchLabel')}
              className='w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'
            />
          </label>

          {renderCategoryTree(selectedCategory, expandedParents, setSelectedCategory, toggleParent)}

          <div className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
            <label className='mb-2 block text-sm font-semibold text-slate-700'>
              {t('catalog.maxPrice')}:{' '}
              {formatPrice(maxPrice, i18n.language)} {products[0].currency}
            </label>
            <input
              type='range'
              min={String(MIN_PRICE)}
              max={String(MAX_PRICE)}
              step={String(PRICE_STEP)}
              value={maxPrice}
              onChange={event => setMaxPrice(Number(event.target.value))}
              className='w-full accent-blue-600'
            />
            <div className='mt-1 flex items-center justify-between text-xs text-slate-500'>
              <span>
                {formatPrice(MIN_PRICE, i18n.language)} {products[0].currency}
              </span>
              <span>
                {formatPrice(MAX_PRICE, i18n.language)} {products[0].currency}
              </span>
            </div>
          </div>

          <button
            type='button'
            onClick={resetDesktopFilters}
            className='w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400'
          >
            {t('catalog.resetFilters')}
          </button>
        </aside>

        <div className='space-y-4'>
          {filteredProducts.length ? (
            <>
              <ProductGrid products={visibleProducts} />
              {hasMoreProducts ? (
                <div className='flex justify-center'>
                  <button
                    type='button'
                    onClick={() => setVisibleCount(current => current + PAGE_SIZE)}
                    className='rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700'
                  >
                    {t('catalog.loadMoreProducts')} ({filteredProducts.length - visibleProducts.length})
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              title={t('catalog.noProductsTitle')}
              description={t('catalog.noProductsDescription')}
            />
          )}
        </div>
      </section>

      {isMobileFiltersOpen ? (
        <div className='fixed inset-0 z-[120] sm:hidden'>
          <button
            type='button'
            aria-label={t('catalog.closeFilters')}
            onClick={closeMobileFilters}
            className='absolute inset-0 bg-slate-900/45'
          />

          <aside className='absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl'>
            <header className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
              <h2 className='text-base font-semibold text-slate-900'>{t('catalog.mobileFilterButton')}</h2>
              <button
                type='button'
                aria-label={t('catalog.closeFilters')}
                onClick={closeMobileFilters}
                className='rounded-lg border border-slate-200 p-2 text-slate-600'
              >
                <HiXMark className='text-lg' />
              </button>
            </header>

            <div className='flex-1 space-y-4 overflow-y-auto px-4 py-4'>
              <label className='relative block'>
                <HiOutlineMagnifyingGlass className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400' />
                <input
                  value={draftSearchInput}
                  onChange={event => setDraftSearchInput(event.target.value)}
                  placeholder={t('catalog.mobileSearchPlaceholder')}
                  aria-label={t('catalog.mobileSearchLabel')}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'
                />
              </label>

              {renderCategoryTree(
                draftCategory,
                draftExpandedParents,
                setDraftCategory,
                toggleDraftParent
              )}

              <div className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>
                  {t('catalog.maxPrice')}:{' '}
                  {formatPrice(draftMaxPrice, i18n.language)} {products[0].currency}
                </label>
                <input
                  type='range'
                  min={String(MIN_PRICE)}
                  max={String(MAX_PRICE)}
                  step={String(PRICE_STEP)}
                  value={draftMaxPrice}
                  onChange={event => setDraftMaxPrice(Number(event.target.value))}
                  className='w-full accent-blue-600'
                />
                <div className='mt-1 flex items-center justify-between text-xs text-slate-500'>
                  <span>
                    {formatPrice(MIN_PRICE, i18n.language)} {products[0].currency}
                  </span>
                  <span>
                    {formatPrice(MAX_PRICE, i18n.language)} {products[0].currency}
                  </span>
                </div>
              </div>
            </div>

            <footer className='space-y-2 border-t border-slate-200 bg-white px-4 py-3'>
              <button
                type='button'
                onClick={applyMobileFilters}
                className='w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white'
              >
                {t('catalog.applyFilters')} ({draftResultCount})
              </button>
              <button
                type='button'
                onClick={resetDraftFilters}
                className='w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700'
              >
                {t('catalog.resetFilters')}
              </button>
            </footer>
          </aside>
        </div>
      ) : null}
    </div>
  )
}

export default Products
