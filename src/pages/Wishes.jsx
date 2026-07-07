import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/catalog/ProductGrid'
import EmptyState from '../components/common/EmptyState'
import { getProductById, useShopStore } from '../store/shopStore'

function Wishes() {
  const { t } = useTranslation()
  const wishlist = useShopStore(state => state.wishlist)
  const shopStatus = useShopStore(state => state.status)
  const wishedProducts = wishlist.map(getProductById).filter(Boolean)

  if (!wishedProducts.length && (shopStatus === 'idle' || shopStatus === 'loading')) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center gap-3 text-sm font-semibold text-slate-500'>
        <span className='h-6 w-6 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700' />
        {t('common.loading')}
      </div>
    )
  }

  if (!wishedProducts.length) {
    return (
      <EmptyState
        title={t('wishlist.emptyTitle')}
        description={t('wishlist.emptyDescription')}
        action={
          <Link to='/products' className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'>
            {t('wishlist.emptyAction')}
          </Link>
        }
      />
    )
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold text-slate-900'>{t('wishlist.title')}</h1>
      <ProductGrid products={wishedProducts} />
    </div>
  )
}

export default Wishes
