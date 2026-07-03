import { Link } from 'react-router-dom'
import { HiOutlineTrash } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import EmptyState from '../components/common/EmptyState'
import { getLocalizedProduct, products } from '../data/products'
import { useShopStore } from '../store/shopStore'
import { animateToCart } from '../utils/animateToCart'
import { formatPrice } from '../utils/formatPrice'

function Cart() {
  const { t, i18n } = useTranslation()
  const cart = useShopStore(state => state.cart)
  const addToCart = useShopStore(state => state.addToCart)
  const updateCartQuantity = useShopStore(state => state.updateCartQuantity)
  const removeFromCart = useShopStore(state => state.removeFromCart)

  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => {
      const product = products.find(item => item.id === id)
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
  const currency = cartItems[0]?.currency || t('common.currency')

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
        {cartItems.map(item => (
          <article
            key={item.id}
            className='flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4'
          >
            <img
              src={item.images[0]}
              alt={item.name}
              className='h-24 w-24 rounded-lg object-cover'
              onError={event => {
                if (event.currentTarget.src !== item.frontendOnly.fallbackImage) {
                  event.currentTarget.src = item.frontendOnly.fallbackImage
                }
              }}
            />
            <div className='min-w-0 flex-1'>
              <h2 className='font-semibold text-slate-900'>{item.name}</h2>
              <p className='text-sm text-slate-500'>{item.categoryLabel}</p>
              <p className='mt-1 text-sm font-semibold text-slate-900'>
                {formatPrice(item.price, i18n.language)}{' '}
                <span className='inline-flex items-center gap-1.5 text-slate-700'>
                  <span className='h-2 w-2 rounded-full bg-violet-600' />
                  {currency}
                </span>
              </p>
            </div>

            <div className='flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-b from-blue-50 to-white px-2 py-1 shadow-sm'>
              <button
                type='button'
                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                className='h-7 w-7 rounded-full text-base font-semibold text-blue-800 transition hover:bg-blue-100 active:scale-95 sm:h-8 sm:w-8'
              >
                -
              </button>
              <span className='w-8 text-center text-sm font-semibold text-blue-900'>{item.quantity}</span>
              <button
                type='button'
                onClick={event => {
                  const added = addToCart(item.id, 1)
                  if (added) {
                    animateToCart(event.currentTarget, item.images[0])
                  }
                }}
                className='h-7 w-7 rounded-full bg-blue-700 text-base font-semibold text-white transition hover:bg-blue-800 active:scale-95 sm:h-8 sm:w-8'
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
                onClick={() => removeFromCart(item.id)}
                className='mt-2 inline-flex items-center gap-1 text-sm text-rose-600 transition hover:text-rose-700'
              >
                <HiOutlineTrash /> {t('cart.remove')}
              </button>
            </div>
          </article>
        ))}
      </section>

      <aside className='h-fit rounded-2xl border border-slate-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-slate-900'>{t('cart.summary')}</h2>
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

        <Link
          to='/checkout'
          className='mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800'
        >
          {t('cart.checkout')}
        </Link>
      </aside>
    </div>
  )
}

export default Cart
