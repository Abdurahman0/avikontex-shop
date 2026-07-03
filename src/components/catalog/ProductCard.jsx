import { memo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiHeart,
  HiOutlineBuildingOffice2,
  HiOutlineHeart,
  HiOutlineShoppingCart,
} from 'react-icons/hi2'
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
  const [isUsingFallbackImage, setIsUsingFallbackImage] = useState(false)
  const localizedProduct = getLocalizedProduct(product, t)
  const imageSrc = getOptimizedImageUrl(product.images[0], { width: 760, height: 760 })
  const fallbackImage = getOptimizedImageUrl(product.frontendOnly.fallbackImage, {
    width: 760,
    height: 760,
  })

  const onIncrement = sourceElement => {
    const added = addToCart(product.id, 1)
    if (added) {
      animateToCart(sourceElement || imageRef.current, product.images[0])
    }
  }

  const onDecrement = () => {
    updateCartQuantity(product.id, cartQuantity - 1)
  }

  const handleImageError = event => {
    if (event.currentTarget.src !== fallbackImage) {
      setIsUsingFallbackImage(true)
      event.currentTarget.src = fallbackImage
    }
  }

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg [contain-intrinsic-size:610px] [content-visibility:auto]'>
      <div className='relative'>
        <Link to={`/products/${product.slug}`} className='block'>
          <img
            ref={imageRef}
            src={imageSrc}
            alt={localizedProduct.name}
            className='h-64 w-full object-cover sm:h-72'
            loading='lazy'
            decoding='async'
            fetchPriority='low'
            onError={handleImageError}
          />
        </Link>

        {product.featured ? (
          <span className='absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm'>
            <span className='h-2 w-2 rounded-full bg-violet-600' />
            {t('productData.frontend.featured')}
          </span>
        ) : null}

        {isUsingFallbackImage ? (
          <span className='absolute bottom-3 left-3 h-2.5 w-2.5 rounded-full bg-violet-600 ring-2 ring-white' />
        ) : null}

        <button
          type='button'
          onClick={() => toggleWishlist(product.id)}
          className='absolute right-3 top-3 rounded-full border border-white/80 bg-white/95 p-2 text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-600'
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
        <div className='flex items-start justify-between gap-2'>
          <p className='line-clamp-2 text-xs font-bold uppercase leading-5 tracking-[0.06em] text-blue-700'>
            {localizedProduct.categoryLabel}
          </p>
          <span className='shrink-0 rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600'>
            {product.code}
          </span>
        </div>

        <Link
          to={`/products/${product.slug}`}
          className='mt-2 line-clamp-2 text-base font-bold leading-6 text-slate-900 transition hover:text-blue-700'
        >
          {localizedProduct.name}
        </Link>

        <div className='mt-3 flex items-start gap-2 text-sm text-slate-500'>
          <HiOutlineBuildingOffice2 className='mt-0.5 shrink-0 text-base text-slate-400' />
          <span className='line-clamp-2'>{localizedProduct.specs.manufacturer}</span>
        </div>

        <div className='mt-4 flex flex-wrap items-end gap-x-2 gap-y-1'>
          <p className='text-xl font-black tracking-tight text-slate-950'>
            {formatPrice(product.price, i18n.language)}
          </p>
          <span className='mb-0.5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-700'>
            <span className='h-2 w-2 rounded-full bg-violet-600' />
            {product.currency}
          </span>
          {product.oldPrice ? (
            <p className='mb-0.5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500'>
              <span className='h-2 w-2 rounded-full bg-violet-600' />
              <span className='decoration-2 line-through'>
                {formatPrice(product.oldPrice, i18n.language)}
              </span>
            </p>
          ) : null}
        </div>

        <div className='mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700'>
          <div className='flex items-center justify-between gap-3 text-sm font-bold'>
            <span className='inline-flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-violet-600' />
              {t('common.rating')}: {product.rating}
            </span>
            <span className='inline-flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-violet-600' />
              {t('productData.stock')}: {product.stock}
            </span>
          </div>
        </div>

        {product.stock === 0 ? (
          <button
            type='button'
            disabled
            className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400'
          >
            <HiOutlineShoppingCart className='text-lg' />
            {t('common.outOfStock')}
          </button>
        ) : cartQuantity > 0 ? (
          <div className='mt-4 inline-flex w-full items-center justify-between rounded-full border border-blue-200 bg-gradient-to-b from-blue-50 to-white px-1.5 py-1 shadow-sm'>
            <button
              type='button'
              onClick={onDecrement}
              aria-label={t('productCard.decreaseQuantity')}
              className='h-8 w-8 rounded-full bg-white text-base font-bold text-blue-800 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-100 active:scale-95'
            >
              -
            </button>
            <span className='min-w-10 text-center text-sm font-black text-blue-900'>
              {cartQuantity}
            </span>
            <button
              type='button'
              onClick={event => onIncrement(event.currentTarget)}
              aria-label={t('productCard.increaseQuantity')}
              className='h-8 w-8 rounded-full bg-blue-700 text-base font-bold text-white shadow-sm transition hover:bg-blue-800 active:scale-95'
            >
              +
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={event => onIncrement(event.currentTarget)}
            className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800'
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
