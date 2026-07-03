import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  HiHeart,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineIdentification,
  HiOutlineShoppingCart,
  HiOutlineTag,
} from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import EmptyState from '../components/common/EmptyState'
import ProductCard from '../components/catalog/ProductCard'
import { getLocalizedProduct, products } from '../data/products'
import { useShopStore } from '../store/shopStore'
import { animateToCart } from '../utils/animateToCart'
import { formatOrderDate } from '../utils/formatOrderDate'
import { formatPrice } from '../utils/formatPrice'
import { getOptimizedImageUrl } from '../utils/getOptimizedImageUrl'

function ProductDetails() {
  const { t, i18n } = useTranslation()
  const { slug } = useParams()
  const imageRef = useRef(null)
  const product = useMemo(() => products.find(item => item.slug === slug), [slug])
  const isWishlisted = useShopStore(state =>
    product ? state.wishlist.includes(product.id) : false
  )
  const cartQuantity = useShopStore(state => (product ? state.cart[product.id] || 0 : 0))
  const toggleWishlist = useShopStore(state => state.toggleWishlist)
  const addToCart = useShopStore(state => state.addToCart)
  const updateCartQuantity = useShopStore(state => state.updateCartQuantity)
  const [selectedImage, setSelectedImage] = useState('')
  const [failedImages, setFailedImages] = useState({})

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0])
      setFailedImages({})
    }
  }, [product])

  const optimizedGalleryImages = useMemo(() => {
    if (!product) {
      return []
    }

    return product.images.map((image, index) => ({
      original: image,
      isFrontendOnly: index > 0,
      thumbnail: getOptimizedImageUrl(image, { width: 220, height: 220 }),
      main: getOptimizedImageUrl(image, { width: 1200, height: 1200 }),
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
          <Link
            to='/products'
            className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'
          >
            {t('productDetails.backToCatalog')}
          </Link>
        }
      />
    )
  }

  const localizedProduct = getLocalizedProduct(product, t)
  const activeImage = selectedImage || product.images[0]
  const activeImageSet = optimizedGalleryImages.find(image => image.original === activeImage)
  const activeMainImage =
    activeImageSet?.main || getOptimizedImageUrl(activeImage, { width: 1200, height: 1200 })
  const fallbackImage = getOptimizedImageUrl(product.frontendOnly.fallbackImage, {
    width: 1200,
    height: 1200,
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

  const handleImageError = (event, image) => {
    if (event.currentTarget.src !== fallbackImage) {
      setFailedImages(current => ({ ...current, [image]: true }))
      event.currentTarget.src = fallbackImage
    }
  }

  const backendDetails = [
    {
      key: 'code',
      label: t('productData.code'),
      value: localizedProduct.specs.code,
      icon: HiOutlineIdentification,
    },
    {
      key: 'article',
      label: t('productData.article'),
      value: localizedProduct.specs.article,
      icon: HiOutlineTag,
    },
    {
      key: 'manufacturer',
      label: t('productData.manufacturer'),
      value: localizedProduct.specs.manufacturer,
      icon: HiOutlineBuildingOffice2,
    },
    {
      key: 'country',
      label: t('productData.country'),
      value: localizedProduct.specs.country,
      icon: HiOutlineGlobeAlt,
    },
    {
      key: 'unit',
      label: t('productData.unit'),
      value: localizedProduct.specs.unit,
      icon: HiOutlineTag,
    },
    {
      key: 'priceSince',
      label: t('productData.priceSince'),
      value: formatOrderDate(product.priceSince, i18n.language),
      icon: HiOutlineCalendarDays,
    },
  ]

  return (
    <div className='space-y-10'>
      <div className='grid items-start gap-6 xl:grid-cols-[1.08fr_0.92fr]'>
        <section className='space-y-2 rounded-2xl border border-slate-200 bg-white p-2 sm:p-3'>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <div className='order-2 grid grid-cols-4 gap-2 sm:order-1 sm:w-24 sm:grid-cols-1 sm:auto-rows-max sm:content-start sm:self-start'>
              {optimizedGalleryImages.map(image => (
                <button
                  key={image.original}
                  type='button'
                  onClick={() => setSelectedImage(image.original)}
                  className={`aspect-square overflow-hidden rounded-lg border transition ${
                    activeImage === image.original
                      ? 'border-blue-500 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={image.thumbnail}
                    alt={localizedProduct.name}
                    className='h-full w-full object-cover'
                    loading='lazy'
                    decoding='async'
                  onError={event => handleImageError(event, image.original)}
                />
                  {image.isFrontendOnly || failedImages[image.original] ? (
                    <span className='absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-violet-600 ring-2 ring-white' />
                  ) : null}
                </button>
              ))}
            </div>

            <div className='relative order-1 min-w-0 flex-1 sm:order-2'>
              <img
                ref={imageRef}
                src={activeMainImage}
                alt={localizedProduct.name}
                className='h-80 w-full rounded-xl object-cover sm:h-96 lg:h-[540px]'
                loading='eager'
                decoding='async'
                fetchPriority='high'
                onError={event => handleImageError(event, activeImage)}
              />
              {activeImageSet?.isFrontendOnly || failedImages[activeImage] ? (
                <span className='absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full bg-violet-600 ring-2 ring-white' />
              ) : null}
            </div>
          </div>
        </section>

        <section className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 xl:sticky xl:top-24'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700'>
              {localizedProduct.categoryLabel}
            </span>
            <span className='rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-600'>
              {product.code}
            </span>
          </div>

          <h1 className='mt-4 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl'>
            {localizedProduct.name}
          </h1>
          <p className='mt-2 text-sm font-medium text-slate-500'>{product.segment}</p>

          <div className='mt-5 flex flex-wrap items-end gap-3 border-y border-slate-100 py-5'>
            <p className='text-3xl font-black tracking-tight text-slate-950 sm:text-4xl'>
              {formatPrice(product.price, i18n.language)}
            </p>
            <span className='mb-1 inline-flex items-center gap-1.5 text-sm font-black text-slate-700'>
              <span className='h-2 w-2 rounded-full bg-violet-600' />
              {product.currency}
            </span>
            {product.oldPrice ? (
              <p className='mb-1 inline-flex items-center gap-1.5 text-lg font-bold text-slate-500'>
                <span className='h-2 w-2 rounded-full bg-violet-600' />
                <span className='decoration-2 line-through'>
                  {formatPrice(product.oldPrice, i18n.language)}
                </span>
              </p>
            ) : null}
          </div>

          <p className='mt-5 text-sm leading-7 text-slate-600'>{localizedProduct.description}</p>

          <div className='mt-6 grid gap-2 sm:grid-cols-2'>
            {backendDetails.map(detail => {
              const Icon = detail.icon
              return (
                <div key={detail.key} className='rounded-xl border border-slate-200 bg-slate-50/70 p-3'>
                  <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500'>
                    <Icon className='text-base text-blue-600' />
                    {detail.label}
                  </div>
                  <p className='mt-1.5 text-sm font-bold leading-5 text-slate-900'>{detail.value}</p>
                </div>
              )
            })}
          </div>

          <div className='mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <div className='grid grid-cols-2 gap-2 text-sm sm:grid-cols-4'>
              <div className='rounded-xl bg-white/80 p-2.5'>
                <p className='inline-flex items-center gap-1.5 text-xs text-slate-500'>
                  <span className='h-2 w-2 rounded-full bg-violet-600' />
                  {t('common.rating')}
                </p>
                <p className='mt-1 font-black text-slate-900'>{product.rating}</p>
              </div>
              <div className='rounded-xl bg-white/80 p-2.5'>
                <p className='inline-flex items-center gap-1.5 text-xs text-slate-500'>
                  <span className='h-2 w-2 rounded-full bg-violet-600' />
                  {t('productData.stock')}
                </p>
                <p className='mt-1 font-black text-slate-900'>{product.stock}</p>
              </div>
              <div className='rounded-xl bg-white/80 p-2.5'>
                <p className='inline-flex items-center gap-1.5 text-xs text-slate-500'>
                  <span className='h-2 w-2 rounded-full bg-violet-600' />
                  {t('productData.currency')}
                </p>
                <p className='mt-1 font-black text-slate-900'>{product.currency}</p>
              </div>
              <div className='rounded-xl bg-white/80 p-2.5'>
                <p className='inline-flex items-center gap-1.5 text-xs text-slate-500'>
                  <span className='h-2 w-2 rounded-full bg-violet-600' />
                  {t('productData.frontend.featuredLabel')}
                </p>
                <p className='mt-1 font-black text-slate-900'>
                  {product.featured ? t('common.yes') : t('common.no')}
                </p>
              </div>
            </div>
          </div>

          <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
            {product.stock === 0 ? (
              <button
                type='button'
                disabled
                className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-300 px-5 py-3 text-sm font-bold text-white sm:w-auto'
              >
                <HiOutlineShoppingCart className='text-lg' />
                {t('common.outOfStock')}
              </button>
            ) : cartQuantity > 0 ? (
              <div className='inline-flex w-full items-center justify-between rounded-full border border-blue-200 bg-gradient-to-b from-blue-50 to-white px-1.5 py-1.5 shadow-sm sm:w-auto sm:min-w-48'>
                <button
                  type='button'
                  onClick={onDecrement}
                  aria-label={t('productCard.decreaseQuantity')}
                  className='h-9 w-9 rounded-full bg-white text-lg font-black text-blue-800 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-100 active:scale-95'
                >
                  -
                </button>
                <span className='min-w-10 text-center text-base font-black text-blue-900'>
                  {cartQuantity}
                </span>
                <button
                  type='button'
                  onClick={event => onIncrement(event.currentTarget)}
                  aria-label={t('productCard.increaseQuantity')}
                  className='h-9 w-9 rounded-full bg-blue-700 text-lg font-black text-white shadow-sm transition hover:bg-blue-800 active:scale-95'
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={event => onIncrement(event.currentTarget)}
                className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 sm:w-auto'
              >
                <HiOutlineShoppingCart className='text-lg' />
                {t('productCard.addToCart')}
              </button>
            )}

            <button
              type='button'
              onClick={() => toggleWishlist(product.id)}
              className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-rose-500 hover:text-rose-600 sm:w-auto'
            >
              {isWishlisted ? (
                <HiHeart className='text-lg text-rose-600' />
              ) : (
                <HiOutlineHeart className='text-lg' />
              )}
              {isWishlisted ? t('productDetails.saved') : t('productDetails.save')}
            </button>
          </div>
        </section>
      </div>

      {relatedProducts.length ? (
        <section className='space-y-4 [contain-intrinsic-size:900px] [content-visibility:auto]'>
          <div className='mb-4 flex flex-wrap items-end justify-between gap-3'>
            <div>
              <h2 className='text-xl font-bold text-slate-900 sm:text-2xl'>
                {t('productDetails.relatedTitle')}
              </h2>
              <p className='mt-1 text-sm text-slate-500'>
                {t('productDetails.relatedDescription')}
              </p>
            </div>
            <Link
              to='/products'
              className='rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-700'
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
