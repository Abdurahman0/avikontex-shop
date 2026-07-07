import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  HiChevronDown,
  HiChevronRight,
  HiOutlineArrowPath,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from 'react-icons/hi2'
import ProductGrid from '../components/catalog/ProductGrid'
import EmptyState from '../components/common/EmptyState'
import HandmadeSelect from '../components/common/HandmadeSelect'
import { useCatalogStore } from '../store/catalogStore'

function TaxonomyOption({ item, selected, onSelect, depth = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children.length > 0

  return (
    <div>
      <div className='flex items-center gap-1'>
        {hasChildren ? (
          <button
            type='button'
            onClick={() => setExpanded(value => !value)}
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100'
            aria-label={item.label}
          >
            {expanded ? <HiChevronDown /> : <HiChevronRight />}
          </button>
        ) : (
          <span className='w-8 shrink-0' />
        )}
        <button
          type='button'
          onClick={() => onSelect(item.value)}
          className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
            selected === item.value
              ? 'bg-blue-700 font-bold text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          style={{ paddingLeft: `${12 + depth * 8}px` }}
        >
          <span className='truncate'>{item.label}</span>
          {item.count !== null ? (
            <span className={`text-xs ${selected === item.value ? 'text-blue-100' : 'text-slate-400'}`}>
              {item.count}
            </span>
          ) : null}
        </button>
      </div>
      {expanded && hasChildren ? (
        <div className='ml-3 border-l border-slate-200 pl-1'>
          {item.children.map(child => (
            <TaxonomyOption
              key={child.id}
              item={child}
              selected={selected}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

TaxonomyOption.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    count: PropTypes.number,
    children: PropTypes.array.isRequired,
  }).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  depth: PropTypes.number,
}

function FilterPanel({ filters, setFilter, groups, segments, reset, t }) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <HiOutlineFunnel className='text-xl text-blue-700' />
          <h2 className='font-bold text-slate-950'>{t('catalog.filtersTitle')}</h2>
        </div>
        <button type='button' onClick={reset} className='text-xs font-bold text-blue-700 hover:text-blue-900'>
          {t('catalog.resetFilters')}
        </button>
      </div>

      <div>
        <p className='mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500'>
          {t('catalog.categoryLabel')}
        </p>
        <button
          type='button'
          onClick={() => setFilter('group', '')}
          className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${
            !filters.group ? 'bg-blue-700 font-bold text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {t('categories.all')}
        </button>
        <div className='max-h-72 space-y-1 overflow-y-auto pr-1'>
          {groups.map(item => (
            <TaxonomyOption
              key={item.id}
              item={item}
              selected={filters.group}
              onSelect={value => setFilter('group', value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className='mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500'>
          {t('catalog.segmentLabel')}
        </p>
        <div className='flex max-h-40 flex-wrap gap-2 overflow-y-auto'>
          <button
            type='button'
            onClick={() => setFilter('segment', '')}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              !filters.segment ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 text-slate-600'
            }`}
          >
            {t('categories.all')}
          </button>
          {segments.map(item => (
            <button
              key={item.id}
              type='button'
              onClick={() => setFilter('segment', item.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filters.segment === item.value
                  ? 'border-blue-700 bg-blue-700 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-blue-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className='mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500'>
          {t('catalog.priceRange')}
        </p>
        <div className='grid grid-cols-2 gap-2'>
          <label>
            <span className='sr-only'>{t('catalog.minPrice')}</span>
            <input
              type='number'
              min='0'
              value={filters.minPrice}
              onChange={event => setFilter('minPrice', event.target.value)}
              placeholder={t('catalog.minPrice')}
              className='w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600'
            />
          </label>
          <label>
            <span className='sr-only'>{t('catalog.maxPrice')}</span>
            <input
              type='number'
              min='0'
              value={filters.maxPrice}
              onChange={event => setFilter('maxPrice', event.target.value)}
              placeholder={t('catalog.maxPrice')}
              className='w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600'
            />
          </label>
        </div>
      </div>

      <label className='flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 p-3'>
        <span className='text-sm font-semibold text-slate-700'>{t('catalog.inStockOnly')}</span>
        <input
          type='checkbox'
          checked={filters.inStock}
          onChange={event => setFilter('inStock', event.target.checked)}
          className='h-4 w-4 accent-blue-700'
        />
      </label>
    </div>
  )
}

FilterPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  segments: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const defaultFilters = {
  search: '',
  group: '',
  segment: '',
  minPrice: '',
  maxPrice: '',
  inStock: false,
  sort: 'name-asc',
}

export default function Products() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const products = useCatalogStore(state => state.products)
  const groups = useCatalogStore(state => state.groups)
  const segments = useCatalogStore(state => state.segments)
  const status = useCatalogStore(state => state.status)
  const source = useCatalogStore(state => state.source)
  const total = useCatalogStore(state => state.total)
  const hasMore = useCatalogStore(state => state.hasMore)
  const loadProducts = useCatalogStore(state => state.loadProducts)
  const loadFilters = useCatalogStore(state => state.loadFilters)
  const loadMore = useCatalogStore(state => state.loadMore)
  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: (searchParams.get('q') || '').trim(),
  })
  const [draftFilters, setDraftFilters] = useState(filters)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const sortOptions = useMemo(
    () => [
      { value: 'name-asc', label: t('catalog.sortNameAsc') },
      { value: 'name-desc', label: t('catalog.sortNameDesc') },
      { value: 'code-asc', label: t('catalog.sortCodeAsc') },
      { value: 'code-desc', label: t('catalog.sortCodeDesc') },
    ],
    [t]
  )

  const setFilter = (name, value) => setFilters(current => ({ ...current, [name]: value }))
  const setDraftFilter = (name, value) =>
    setDraftFilters(current => ({ ...current, [name]: value }))
  const reset = () => setFilters(defaultFilters)

  useEffect(() => {
    const [sortBy, sortOrder] = filters.sort.split('-')
    const timer = window.setTimeout(() => {
      loadProducts({
        search: filters.search.trim(),
        group: filters.group,
        segment: filters.segment,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        in_stock: filters.inStock ? true : undefined,
        has_price: true,
        sortBy,
        sortOrder,
        limit: 24,
      })
    }, 350)
    return () => window.clearTimeout(timer)
  }, [filters, loadProducts])

  useEffect(() => {
    loadFilters()
  }, [loadFilters])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  return (
    <div className='space-y-5'>
      <section className='rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-sky-700 px-6 py-8 text-white sm:px-8'>
        <p className='text-xs font-bold uppercase tracking-[0.2em] text-blue-200'>{t('catalog.totalCatalogLabel')}</p>
        <h1 className='mt-2 text-3xl font-bold sm:text-4xl'>{t('catalog.title')}</h1>
        <p className='mt-3 max-w-3xl text-sm leading-6 text-blue-100'>{t('catalog.description')}</p>
      </section>

      {source !== 'live' ? (
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
          <span>{t('catalog.apiUnavailable')}</span>
        </div>
      ) : null}

      <div className='flex gap-5 lg:items-start'>
        <aside className='sticky top-24 hidden max-h-[calc(100vh-7rem)] w-80 shrink-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block'>
          <FilterPanel filters={filters} setFilter={setFilter} groups={groups} segments={segments} reset={reset} t={t} />
        </aside>

        <div className='min-w-0 flex-1'>
          <div className='mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center'>
            <label className='flex flex-1 items-center rounded-xl border border-slate-300 bg-slate-50 px-3 focus-within:border-blue-600 focus-within:bg-white'>
              <HiOutlineMagnifyingGlass className='text-xl text-slate-500' />
              <input
                value={filters.search}
                onChange={event => setFilter('search', event.target.value)}
                placeholder={t('catalog.mobileSearchPlaceholder')}
                className='w-full bg-transparent px-2 py-2.5 text-sm outline-none'
              />
            </label>
            <button
              type='button'
              onClick={() => {
                setDraftFilters(filters)
                setIsMobileOpen(true)
              }}
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 lg:hidden'
            >
              <HiOutlineFunnel className='text-lg' />
              {t('catalog.mobileFilterButton')}
            </button>
            <div className='w-full sm:w-56'>
              <HandmadeSelect
                value={filters.sort}
                options={sortOptions}
                onChange={value => setFilter('sort', value)}
                ariaLabel={t('catalog.sortLabel')}
              />
            </div>
          </div>

          <div className='mb-4 flex items-center justify-between gap-3'>
            <p className='text-sm text-slate-600'>
              {t('catalog.resultsCount', { count: total || products.length })}
            </p>
            {source === 'live' ? (
              <span className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700'>
                <span className='h-2 w-2 rounded-full bg-emerald-500' />
                {t('catalog.liveData')}
              </span>
            ) : null}
          </div>

          {status === 'loading' ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className='h-[520px] animate-pulse rounded-2xl border border-slate-200 bg-white' />
              ))}
            </div>
          ) : products.length ? (
            <>
              <ProductGrid products={products} />
              {hasMore ? (
                <button
                  type='button'
                  onClick={loadMore}
                  className='mx-auto mt-7 flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50'
                >
                  <HiOutlineArrowPath />
                  {t('catalog.loadMoreProducts')}
                </button>
              ) : null}
            </>
          ) : (
            <EmptyState
              title={t('catalog.noProductsTitle')}
              description={t('catalog.noProductsDescription')}
            />
          )}
        </div>
      </div>

      {isMobileOpen ? (
        <div className='fixed inset-0 z-[90] bg-slate-950/45 lg:hidden' role='dialog' aria-modal='true'>
          <div className='absolute inset-y-0 right-0 w-[min(92vw,390px)] overflow-y-auto bg-white p-5 shadow-2xl'>
            <div className='mb-5 flex items-center justify-between'>
              <h2 className='text-lg font-bold text-slate-950'>{t('catalog.filtersTitle')}</h2>
              <button
                type='button'
                onClick={() => setIsMobileOpen(false)}
                className='rounded-full border border-slate-200 p-2 text-slate-600'
                aria-label={t('catalog.closeFilters')}
              >
                <HiOutlineXMark className='text-xl' />
              </button>
            </div>
            <FilterPanel
              filters={draftFilters}
              setFilter={setDraftFilter}
              groups={groups}
              segments={segments}
              reset={() => setDraftFilters(defaultFilters)}
              t={t}
            />
            <button
              type='button'
              onClick={() => {
                setFilters(draftFilters)
                setIsMobileOpen(false)
              }}
              className='mt-6 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white'
            >
              {t('catalog.applyFilters')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
