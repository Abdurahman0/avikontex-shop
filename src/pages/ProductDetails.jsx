import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiHeart, HiOutlineHeart, HiOutlineShoppingCart } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import EmptyState from '../components/common/EmptyState'
import ProductCard from '../components/catalog/ProductCard'
import { getLocalizedProduct, products } from '../data/products'
import { useShopStore } from '../store/shopStore'
import { animateToCart } from '../utils/animateToCart'
import { formatPrice } from '../utils/formatPrice'
import { getOptimizedImageUrl } from '../utils/getOptimizedImageUrl'

function ProductDetails() {
  const { t, i18n } = useTranslation()
  const { slug } = useParams()
  const imageRef = useRef(null)
  const product = useMemo(() => products.find(item => item.slug === slug), [slug])
  const isWishlisted = useShopStore(state => (product ? state.wishlist.includes(product.id) : false))
  const cartQuantity = useShopStore(state => (product ? state.cart[product.id] || 0 : 0))
  const toggleWishlist = useShopStore(state => state.toggleWishlist)
  const addToCart = useShopStore(state => state.addToCart)
  const updateCartQuantity = useShopStore(state => state.updateCartQuantity)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0])
    }
  }, [product])

  const optimizedGalleryImages = useMemo(() => {
    if (!product) {
      return []
    }

    return product.images.map(image => ({
      original: image,
      thumbnail: getOptimizedImageUrl(image, { width: 220, height: 220 }),
      main: getOptimizedImageUrl(image, { width: 1200, height: 1400 }),
    }))
  }, [product])

  const relatedProducts = useMemo(() => {
    if (!product) {
      return []
    }

    const otherProducts = products.filter(item => item.id !== product.id)
    const sameCategory = otherProducts
      .filter(item => item.categoryKey === product.categoryKey)
      .sort((first, second) => second.rating - first.rating)

    const featuredFallback = otherProducts
      .filter(item => item.categoryKey !== product.categoryKey)
      .sort((first, second) => Number(second.featured) - Number(first.featured))

    return [...sameCategory, ...featuredFallback].slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <EmptyState
        title={t('productDetails.notFoundTitle')}
        description={t('productDetails.notFoundDescription')}
        action={
          <Link to='/products' className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'>
            {t('productDetails.backToCatalog')}
          </Link>
        }
      />
    )
  }

  const localizedProduct = getLocalizedProduct(product, t)
  const activeImage = selectedImage || product.images[0]
  const activeImageSet = optimizedGalleryImages.find(image => image.original === activeImage)
  const activeMainImage = activeImageSet?.main || getOptimizedImageUrl(activeImage, { width: 1200, height: 1400 })

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
    <div className='space-y-10'>
      <div className='grid gap-6 xl:grid-cols-[1.1fr_1fr]'>
        <div className='space-y-2 rounded-2xl border border-slate-200 bg-white p-2 sm:p-3'>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <div className='order-2 grid grid-cols-4 gap-2 sm:order-1 sm:w-24 sm:grid-cols-1 sm:auto-rows-max sm:content-start sm:self-start'>
              {optimizedGalleryImages.map(image => (
                <button
                  key={image.original}
                  type='button'
                  onClick={() => setSelectedImage(image.original)}
                  className={`aspect-square overflow-hidden rounded-lg border transition ${
                    activeImage === image.original
                      ? 'border-emerald-500 ring-2 ring-emerald-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={image.thumbnail}
                    alt={localizedProduct.name}
                    className='h-full w-full object-cover'
                    loading='lazy'
                    decoding='async'
                  />
                </button>
              ))}
            </div>
            <div className='order-1 flex-1 sm:order-2'>
              <img
                ref={imageRef}
                src={activeMainImage}
                alt={localizedProduct.name}
                className='h-80 w-full rounded-xl object-cover sm:h-96 lg:h-[540px]'
                loading='eager'
                decoding='async'
                fetchPriority='high'
              />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 xl:sticky xl:top-24 xl:h-fit'>
          <p className='text-xs font-semibold uppercase tracking-wide text-emerald-700'>
            {localizedProduct.categoryLabel}
          </p>
          <h1 className='mt-2 text-2xl font-bold text-slate-900 sm:text-3xl'>{localizedProduct.name}</h1>
          <p className='mt-1 text-sm text-slate-500'>
            {t('common.rating')}: {product.rating}
          </p>

          <div className='mt-4 flex flex-wrap items-end gap-3'>
            <p className='text-2xl font-bold text-slate-900 sm:text-3xl'>
              {formatPrice(product.price, i18n.language)} {t('common.currency')}
            </p>
            {product.oldPrice ? (
              <p className='pb-1 text-lg font-semibold text-red-600 decoration-2 decoration-red-600 line-through'>
                {formatPrice(product.oldPrice, i18n.language)}
              </p>
            ) : null}
          </div>

          <p className='mt-4 text-sm leading-6 text-slate-600'>{localizedProduct.description}</p>

          <div className='mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700'>
            <p>
              <span className='font-semibold'>{t('productDetails.material')}:</span>{' '}
              {localizedProduct.specs.material}
            </p>
            <p>
              <span className='font-semibold'>{t('productDetails.fit')}:</span> {localizedProduct.specs.fit}
            </p>
            <p>
              <span className='font-semibold'>{t('productDetails.origin')}:</span>{' '}
              {localizedProduct.specs.origin}
            </p>
            <p>
              <span className='font-semibold'>{t('productDetails.stock')}:</span>{' '}
              {product.stock ? product.stock : t('common.outOfStock')}
            </p>
          </div>

          <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
            {product.stock === 0 ? (
              <button
                type='button'
                disabled
                className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-300 px-4 py-2 text-sm font-semibold text-white sm:w-auto'
              >
                <HiOutlineShoppingCart className='text-lg' />
                {t('common.outOfStock')}
              </button>
            ) : cartQuantity > 0 ? (
              <div className='inline-flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white px-2 py-1 shadow-sm sm:w-auto sm:min-w-44'>
                <button
                  type='button'
                  onClick={onDecrement}
                  className='h-7 w-7 rounded-full text-base font-semibold text-emerald-800 transition hover:bg-emerald-100 active:scale-95 sm:h-8 sm:w-8'
                >
                  -
                </button>
                <span className='min-w-8 text-center text-sm font-semibold text-emerald-900'>
                  {cartQuantity}
                </span>
                <button
                  type='button'
                  onClick={event => onIncrement(event.currentTarget)}
                  className='h-7 w-7 rounded-full text-base font-semibold text-emerald-800 transition hover:bg-emerald-100 active:scale-95 sm:h-8 sm:w-8'
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={event => onIncrement(event.currentTarget)}
                className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto'
              >
                <HiOutlineShoppingCart className='text-lg' />
                {t('productCard.addToCart')}
              </button>
            )}

            <button
              type='button'
              onClick={() => toggleWishlist(product.id)}
              className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-500 hover:text-rose-600 sm:w-auto'
            >
              {isWishlisted ? (
                <HiHeart className='text-lg text-rose-600' />
              ) : (
                <HiOutlineHeart className='text-lg' />
              )}
              {isWishlisted ? t('productDetails.saved') : t('productDetails.save')}
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length ? (
        <section className='space-y-4 [contain-intrinsic-size:900px] [content-visibility:auto]'>
          <div className='mb-4 flex flex-wrap items-end justify-between gap-3'>
            <div>
              <h2 className='text-xl font-bold text-slate-900 sm:text-2xl'>
                {t('productDetails.relatedTitle')}
              </h2>
              <p className='mt-1 text-sm text-slate-500'>{t('productDetails.relatedDescription')}</p>
            </div>
            <Link
              to='/products'
              className='rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700'
            >
              {t('common.viewAll')}
            </Link>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default ProductDetails
