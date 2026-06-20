import { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HiHeart, HiOutlineHeart, HiOutlineShoppingCart } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import { useShopStore } from '../../store/shopStore'
import { getLocalizedProduct } from '../../data/products'
import { animateToCart } from '../../utils/animateToCart'
import { formatPrice } from '../../utils/formatPrice'
import { getOptimizedImageUrl } from '../../utils/getOptimizedImageUrl'

function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const imageRef = useRef(null)
  const isWishlisted = useShopStore(state => state.wishlist.includes(product.id))
  const cartQuantity = useShopStore(state => state.cart[product.id] || 0)
  const addToCart = useShopStore(state => state.addToCart)
  const updateCartQuantity = useShopStore(state => state.updateCartQuantity)
  const toggleWishlist = useShopStore(state => state.toggleWishlist)
  const localizedProduct = getLocalizedProduct(product, t)
  const imageSrc = getOptimizedImageUrl(product.images[0], { width: 760, height: 760 })

  const onIncrement = sourceElement => {
    const added = addToCart(product.id, 1)
    if (added) {
      animateToCart(sourceElement || imageRef.current, product.images[0])
    }
  }

  const onDecrement = () => {
    updateCartQuantity(product.id, cartQuantity - 1)
  }

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm [contain-intrinsic-size:560px] [content-visibility:auto]'>
      <div className='relative'>
        <Link to={`/products/${product.slug}`}>
          <img
            ref={imageRef}
            src={imageSrc}
            alt={localizedProduct.name}
            className='h-64 w-full object-cover sm:h-72'
            loading='lazy'
            decoding='async'
            fetchpriority='low'
          />
        </Link>
        <button
          type='button'
          onClick={() => toggleWishlist(product.id)}
          className='absolute right-3 top-3 rounded-full bg-white/95 p-2 text-slate-700 shadow transition hover:text-rose-600'
          aria-label={t('productCard.toggleWishlist')}
        >
          {isWishlisted ? (
            <HiHeart className='text-xl text-rose-600' />
          ) : (
            <HiOutlineHeart className='text-xl' />
          )}
        </button>
      </div>

      <div className='flex h-full flex-col p-4'>
        <p className='text-xs font-semibold uppercase tracking-wide text-blue-700'>
          {localizedProduct.categoryLabel}
        </p>
        <Link
          to={`/products/${product.slug}`}
          className='mt-1 line-clamp-2 text-base font-semibold text-slate-900'
        >
          {localizedProduct.name}
        </Link>

        <div className='mt-2 flex items-center gap-2'>
          <p className='text-lg font-bold text-slate-900'>
            {formatPrice(product.price, i18n.language)} {t('common.currency')}
          </p>
          {product.oldPrice ? (
            <p className='text-sm font-semibold text-red-600 decoration-2 decoration-red-600 line-through'>
              {formatPrice(product.oldPrice, i18n.language)}
            </p>
          ) : null}
        </div>

        <p className='mt-1 text-sm text-slate-500'>
          {t('common.rating')}: {product.rating}
        </p>

        {product.stock === 0 ? (
          <button
            type='button'
            disabled
            className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400'
          >
            <HiOutlineShoppingCart className='text-lg' />
            {t('common.outOfStock')}
          </button>
        ) : cartQuantity > 0 ? (
          <div className='mt-4 inline-flex w-full items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white px-2 py-1 shadow-sm'>
            <button
              type='button'
              onClick={onDecrement}
              className='h-7 w-7 rounded-full text-base font-semibold text-blue-800 transition hover:bg-blue-100 active:scale-95 sm:h-8 sm:w-8'
            >
              -
            </button>
            <span className='min-w-8 text-center text-sm font-semibold text-blue-900'>
              {cartQuantity}
            </span>
            <button
              type='button'
              onClick={event => onIncrement(event.currentTarget)}
              className='h-7 w-7 rounded-full text-base font-semibold text-blue-800 transition hover:bg-blue-100 active:scale-95 sm:h-8 sm:w-8'
            >
              +
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={event => onIncrement(event.currentTarget)}
            className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-blue-600 hover:text-blue-700'
          >
            <HiOutlineShoppingCart className='text-lg' />
            {t('productCard.addToCart')}
          </button>
        )}
      </div>
    </article>
  )
}

export default memo(ProductCard)
