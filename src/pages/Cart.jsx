import { Link } from 'react-router-dom'
import { HiOutlinePhoto, HiOutlineTrash } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import EmptyState from '../components/common/EmptyState'
import { getLocalizedProduct } from '../data/products'
import { getProductById, useShopStore } from '../store/shopStore'
import { useAuthStore } from '../store/authStore'
import { animateToCart } from '../utils/animateToCart'
import { getClientVerification, getVerificationTone } from '../utils/clientVerification'
import { formatPrice } from '../utils/formatPrice'

function Cart() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore(state => state.user)
  const cart = useShopStore(state => state.cart)
  const addToCart = useShopStore(state => state.addToCart)
  const updateCartQuantity = useShopStore(state => state.updateCartQuantity)
  const removeFromCart = useShopStore(state => state.removeFromCart)
  const shopStatus = useShopStore(state => state.status)
  const cartMutations = useShopStore(state => state.cartMutations)

  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => {
      const product = getProductById(id)
      if (!product) {
        return null
      }

      return {
        ...product,
        ...getLocalizedProduct(product, t),
        quantity,
      }
    })
    .filter(Boolean)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal >= 500 ? 0 : cartItems.length ? 15 : 0
  const total = subtotal + delivery
  const currency = cartItems[0]?.currency || ''
  const verification = getClientVerification(user)
  const verificationTone = getVerificationTone(verification.status)
  const verificationStyles = {
    pending: 'border-amber-200 bg-amber-50 text-amber-900',
    verified: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    rejected: 'border-rose-200 bg-rose-50 text-rose-800',
  }

  if (!cartItems.length && (shopStatus === 'idle' || shopStatus === 'loading')) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center gap-3 text-sm font-semibold text-slate-500'>
        <span className='h-6 w-6 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700' />
        {t('common.loading')}
      </div>
    )
  }

  if (!cartItems.length) {
    return (
      <EmptyState
        title={t('cart.emptyTitle')}
        description={t('cart.emptyDescription')}
        action={
          <Link to='/products' className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'>
            {t('cart.emptyAction')}
          </Link>
        }
      />
    )
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[1.7fr_1fr]'>
      <section className='space-y-3'>
        {cartItems.map(item => {
          const isItemLoading = Boolean(cartMutations[item.id])
          const hasFiniteStock = Number.isFinite(item.stock)
          const isAtStockLimit = hasFiniteStock && item.quantity >= item.stock
          const canIncrement = !isItemLoading && !isAtStockLimit
          const incrementDisabledClass = isItemLoading
            ? 'disabled:cursor-wait disabled:opacity-60'
            : 'disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-100'

          return (
            <article
              key={item.id}
              className='flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4'
            >
              {item.images[0] ? (
                <img src={item.images[0]} alt={item.name} className='h-24 w-24 rounded-lg object-cover' />
              ) : (
                <div className='flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-slate-400'>
                  <HiOutlinePhoto className='text-3xl' />
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <h2 className='font-semibold text-slate-900'>{item.name}</h2>
                <p className='text-sm text-slate-500'>{item.categoryLabel}</p>
                <p className='mt-1 text-sm font-semibold text-slate-900'>
                  {formatPrice(item.price, i18n.language)}{' '}
                  {currency ? <span className='text-slate-700'>{currency}</span> : null}
                </p>
              </div>

              <div className='flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-b from-blue-50 to-white px-2 py-1 shadow-sm'>
                <button
                  type='button'
                  disabled={isItemLoading}
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  className='h-7 w-7 rounded-full text-base font-semibold text-blue-800 transition hover:bg-blue-100 active:scale-95 disabled:cursor-wait disabled:opacity-60 sm:h-8 sm:w-8'
                >
                  -
                </button>
                <span className='w-8 text-center text-sm font-semibold text-blue-900'>
                  {isItemLoading ? (
                    <span className='mx-auto block h-4 w-4 animate-spin rounded-full border-2 border-blue-100 border-t-blue-700' />
                  ) : (
                    item.quantity
                  )}
                </span>
                <button
                  type='button'
                  disabled={!canIncrement}
                  onClick={async event => {
                    if (!canIncrement) return
                    const added = await addToCart(item.id, 1, item)
                    if (added && item.images[0]) {
                      animateToCart(event.currentTarget, item.images[0])
                    }
                  }}
                  className={`h-7 w-7 rounded-full bg-blue-700 text-base font-semibold text-white transition hover:bg-blue-800 active:scale-95 sm:h-8 sm:w-8 ${incrementDisabledClass}`}
                >
                  +
                </button>
              </div>

              <div className='ml-auto text-right'>
                <p className='font-semibold text-slate-900'>
                  {formatPrice(item.price * item.quantity, i18n.language)} {currency}
                </p>
                <button
                  type='button'
                  disabled={isItemLoading}
                  onClick={() => removeFromCart(item.id)}
                  className='mt-2 inline-flex items-center gap-1 text-sm text-rose-600 transition hover:text-rose-700 disabled:cursor-wait disabled:opacity-60'
                >
                  {isItemLoading ? (
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-rose-100 border-t-rose-600' />
                  ) : (
                    <HiOutlineTrash />
                  )}
                  {t('cart.remove')}
                </button>
              </div>
            </article>
          )
        })}
      </section>

      <aside className='h-fit rounded-2xl border border-slate-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-slate-900'>{t('cart.summary')}</h2>
        {verification.requiresReview && verification.status ? (
          <div className={`mt-4 rounded-xl border px-3 py-2 text-sm font-semibold ${verificationStyles[verificationTone]}`}>
            {verification.isBlocked
              ? t(`verification.${verificationTone}Description`, {
                  reason: verification.rejectionReason || t('verification.noReason'),
                })
              : t(`verification.${verificationTone}Title`)}
          </div>
        ) : null}
        <div className='mt-4 space-y-2 text-sm text-slate-600'>
          <div className='flex justify-between'>
            <span>{t('cart.subtotal')}</span>
            <span>
              {formatPrice(subtotal, i18n.language)} {currency}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>{t('cart.delivery')}</span>
            <span>
              {delivery
                ? `${formatPrice(delivery, i18n.language)} ${currency}`
                : t('common.free')}
            </span>
          </div>
          <div className='flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900'>
            <span>{t('cart.total')}</span>
            <span>
              {formatPrice(total, i18n.language)} {currency}
            </span>
          </div>
        </div>

        {verification.isBlocked ? (
          <button
            type='button'
            disabled
            className='mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-300 px-4 py-2 text-sm font-semibold text-white'
          >
            {t('cart.checkout')}
          </button>
        ) : (
          <Link
            to='/checkout'
            className='mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800'
          >
            {t('cart.checkout')}
          </Link>
        )}
      </aside>
    </div>
  )
}

export default Cart
