import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/catalog/ProductGrid'
import { products } from '../data/products'

function Main() {
  const { t } = useTranslation()
  const featuredProducts = useMemo(
    () => products.filter(product => product.featured).slice(0, 8),
    []
  )

  return (
    <div className='space-y-10'>
      <section className='overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 px-6 py-12 text-white sm:px-10'>
        <p className='text-sm uppercase tracking-[0.3em] text-emerald-200'>{t('home.badge')}</p>
        <h1 className='mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl'>
          {t('home.title')}
        </h1>
        <p className='mt-4 max-w-2xl text-sm text-emerald-100 sm:text-base'>
          {t('home.description')}
        </p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Link
            to='/products'
            className='rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100'
          >
            {t('home.browseButton')}
          </Link>
          <Link
            to='/track-order/last'
            className='rounded-xl border border-emerald-200 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700'
          >
            {t('home.trackButton')}
          </Link>
        </div>
      </section>

      <section>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-slate-900'>{t('home.featuredTitle')}</h2>
          <Link to='/products' className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'>
            {t('common.viewAll')}
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  )
}

export default Main
