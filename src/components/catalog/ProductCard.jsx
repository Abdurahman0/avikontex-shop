import { memo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiHeart,
  HiOutlineBuildingOffice2,
  HiOutlineHeart,
  HiOutlinePhoto,
  HiOutlineShoppingCart,
} from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import { useShopStore } from '../../store/shopStore'
import { getLocalizedProduct } from '../../data/products'
import { animateToCart } from '../../utils/animateToCart'
import { formatPrice } from '../../utils/formatPrice'
import { getOptimizedImageUrl } from '../../utils/getOptimizedImageUrl'
import { productPropType } from '../../propTypes/product'

function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const imageRef = useRef(null)
  const isWishlisted = useShopStore(state => state.wishlist.includes(product.id))
  const cartQuantity = useShopStore(state => state.cart[product.id] || 0)
  const isCartLoading = useShopStore(state => Boolean(state.cartMutations[product.id]))
  const isWishlistLoading = useShopStore(state => Boolean(state.wishlistMutations[product.id]))
  const addToCart = useShopStore(state => state.addToCart)
  const updateCartQuantity = useShopStore(state => state.updateCartQuantity)
  const toggleWishlist = useShopStore(state => state.toggleWishlist)
  const [imageFailed, setImageFailed] = useState(false)
  const localizedProduct = getLocalizedProduct(product, t)
  const primaryImage = product.images[0] || ''
  const imageSrc = getOptimizedImageUrl(primaryImage, { width: 760, height: 760 })
  const hasFiniteStock = Number.isFinite(product.stock)
  const isOutOfStock = hasFiniteStock && product.stock < 1
  const isAtStockLimit = hasFiniteStock && cartQuantity >= product.stock
  const canIncrement = !isCartLoading && !isAtStockLimit
  const incrementDisabledClass = isCartLoading
    ? 'disabled:cursor-wait disabled:opacity-60'
    : 'disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-100'

  const onIncrement = async sourceElement => {
    if (!canIncrement) return
    const added = await addToCart(product.id, 1, product)
    if (added && primaryImage) {
      animateToCart(sourceElement || imageRef.current, primaryImage)
    }
  }

  const onDecrement = async () => {
    await updateCartQuantity(product.id, cartQuantity - 1)
  }

  const handleImageError = () => setImageFailed(true)
  const visibleImage = imageFailed ? '' : imageSrc

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg [contain-intrinsic-size:610px] [content-visibility:auto]'>
      <div className='relative'>
        <Link to={`/products/${product.slug}`} className='block'>
          {visibleImage ? (
            <img
              ref={imageRef}
              src={visibleImage}
              alt={localizedProduct.name}
              className='h-64 w-full object-cover sm:h-72'
              loading='lazy'
              decoding='async'
              fetchPriority='low'
              onError={handleImageError}
            />
          ) : (
            <div className='flex h-64 w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 sm:h-72'>
              <HiOutlinePhoto className='text-4xl' />
              <span className='text-xs font-semibold'>{t('productData.noImage')}</span>
            </div>
          )}
        </Link>

        <button
          type='button'
          onClick={() => toggleWishlist(product.id, product)}
          disabled={isWishlistLoading}
          className='absolute right-3 top-3 rounded-full border border-white/80 bg-white/95 p-2 text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-600 disabled:cursor-wait disabled:opacity-70'
          aria-label={t('productCard.toggleWishlist')}
        >
          {isWishlistLoading ? (
            <span className='block h-5 w-5 animate-spin rounded-full border-2 border-rose-100 border-t-rose-600' />
          ) : isWishlisted ? (
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
          {product.currency ? (
            <span className='mb-0.5 text-xs font-bold text-slate-700'>{product.currency}</span>
          ) : null}
        </div>

        <div className='mt-auto pt-3'>
          <div className='rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700'>
            <div className='text-sm font-bold'>
              {t('productData.stock')}: {product.stock ?? t('productData.notProvided')}
            </div>
          </div>

          {isOutOfStock ? (
            <button
              type='button'
              disabled
              className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400'
            >
              <HiOutlineShoppingCart className='text-lg' />
              {t('common.outOfStock')}
            </button>
          ) : cartQuantity > 0 ? (
            <div className='mt-4 inline-flex w-full items-center justify-between rounded-full border border-blue-200 bg-gradient-to-b from-blue-50 to-white px-1.5 py-1 shadow-sm'>
              <button
                type='button'
                onClick={onDecrement}
                disabled={isCartLoading}
                aria-label={t('productCard.decreaseQuantity')}
                className='h-8 w-8 rounded-full bg-white text-base font-bold text-blue-800 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-100 active:scale-95 disabled:cursor-wait disabled:opacity-60'
              >
                -
              </button>
              <span className='min-w-10 text-center text-sm font-black text-blue-900'>
                {isCartLoading ? (
                  <span className='mx-auto block h-4 w-4 animate-spin rounded-full border-2 border-blue-100 border-t-blue-700' />
                ) : (
                  cartQuantity
                )}
              </span>
              <button
                type='button'
                onClick={event => onIncrement(event.currentTarget)}
                disabled={!canIncrement}
                aria-label={t('productCard.increaseQuantity')}
                className={`h-8 w-8 rounded-full bg-blue-700 text-base font-bold text-white shadow-sm transition hover:bg-blue-800 active:scale-95 ${incrementDisabledClass}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type='button'
              onClick={event => onIncrement(event.currentTarget)}
              disabled={!canIncrement}
              className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 ${incrementDisabledClass}`}
            >
              {isCartLoading ? (
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
              ) : (
                <HiOutlineShoppingCart className='text-lg' />
              )}
              {t('productCard.addToCart')}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  product: productPropType.isRequired,
}

export default memo(ProductCard)
