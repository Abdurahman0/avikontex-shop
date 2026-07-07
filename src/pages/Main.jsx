import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/catalog/ProductGrid'
import EmptyState from '../components/common/EmptyState'
import { useCatalogStore } from '../store/catalogStore'

function Main() {
  const { t } = useTranslation()
  const products = useCatalogStore(state => state.products)
  const source = useCatalogStore(state => state.source)
  const loadProducts = useCatalogStore(state => state.loadProducts)
  const previewProducts = useMemo(() => products.slice(0, 8), [products])

  useEffect(() => {
    loadProducts({ has_price: true, limit: 8, sortBy: 'name', sortOrder: 'asc' })
  }, [loadProducts])

  return (
    <div className='space-y-10'>
      <section className='overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-sky-700 px-6 py-12 text-white sm:px-10'>
        <p className='text-sm uppercase tracking-[0.3em] text-blue-200'>{t('home.badge')}</p>
        <h1 className='mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl'>{t('home.title')}</h1>
        <p className='mt-4 max-w-2xl text-sm text-blue-100 sm:text-base'>{t('home.description')}</p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Link to='/products' className='rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-100'>
            {t('home.browseButton')}
          </Link>
          <Link to='/track-order/last' className='rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700'>
            {t('home.trackButton')}
          </Link>
        </div>
      </section>

      <section>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-slate-900'>{t('home.catalogPreviewTitle')}</h2>
          <Link to='/products' className='text-sm font-semibold text-blue-700 hover:text-blue-800'>{t('common.viewAll')}</Link>
        </div>
        {previewProducts.length ? (
          <ProductGrid products={previewProducts} />
        ) : (
          <EmptyState
            title={
              source === 'unavailable'
                ? t('catalog.apiUnavailable')
                : t('catalog.noProductsTitle')
            }
            description={
              source === 'unavailable'
                ? t('catalog.noProductsDescription')
                : t('catalog.noProductsDescription')
            }
          />
        )}
      </section>
    </div>
  )
}

export default Main
