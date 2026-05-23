import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/catalog/ProductGrid'
import EmptyState from '../components/common/EmptyState'
import { products } from '../data/products'
import { useShopStore } from '../store/shopStore'

function Wishes() {
  const { t } = useTranslation()
  const wishlist = useShopStore(state => state.wishlist)
  const wishedProducts = products.filter(product => wishlist.includes(product.id))

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
