import { Link, useParams } from 'react-router-dom'
import { HiCheckCircle } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import EmptyState from '../components/common/EmptyState'
import { getLocalizedProduct } from '../data/products'
import { getProductById, useShopStore } from '../store/shopStore'
import { formatOrderDate } from '../utils/formatOrderDate'
import { formatPrice } from '../utils/formatPrice'

const ORDER_STAGES = ['pending_confirmation', 'packed', 'shipped', 'delivered']

function TrackOrder() {
  const { t, i18n } = useTranslation()
  const { orderId } = useParams()
  const orders = useShopStore(state => state.orders)

  const order = orderId === 'last' ? orders[0] : orders.find(item => item.id === orderId)

  if (!order) {
    return (
      <EmptyState
        title={t('tracking.notFoundTitle')}
        description={t('tracking.notFoundDescription')}
        action={
          <Link to='/products' className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'>
            {t('tracking.notFoundAction')}
          </Link>
        }
      />
    )
  }

  const createdDate = new Date(order.createdAt)
  const estimatedDate = new Date(createdDate)
  estimatedDate.setDate(createdDate.getDate() + 2)

  const currentStageIndex = Math.max(0, ORDER_STAGES.indexOf(order.statusKey))

  return (
    <div className='mx-auto max-w-5xl space-y-5'>
      <section className='rounded-2xl border border-slate-200 bg-white p-5 sm:p-6'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 sm:text-3xl'>{t('tracking.title')}</h1>
            <p className='mt-1 text-sm text-slate-500'>
              {t('tracking.orderId')}: {order.id}
            </p>
          </div>
          <p className='rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800'>
            {t(`status.${order.statusKey}`)}
          </p>
        </div>

        <div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <article className='rounded-xl bg-slate-50 p-3'>
            <p className='text-xs text-slate-500'>{t('tracking.customer')}</p>
            <p className='mt-1 text-sm font-semibold text-slate-900'>{order.customer.fullName}</p>
          </article>
          <article className='rounded-xl bg-slate-50 p-3'>
            <p className='text-xs text-slate-500'>{t('tracking.phone')}</p>
            <p className='mt-1 text-sm font-semibold text-slate-900'>{order.customer.phone}</p>
          </article>
          <article className='rounded-xl bg-slate-50 p-3'>
            <p className='text-xs text-slate-500'>{t('tracking.createdAt')}</p>
            <p className='mt-1 text-sm font-semibold text-slate-900'>
              {formatOrderDate(createdDate, i18n.language)}
            </p>
          </article>
          <article className='rounded-xl bg-slate-50 p-3'>
            <p className='text-xs text-slate-500'>{t('tracking.estimatedDelivery')}</p>
            <p className='mt-1 text-sm font-semibold text-slate-900'>
              {formatOrderDate(estimatedDate, i18n.language)}
            </p>
          </article>
        </div>

        <p className='mt-3 text-sm text-slate-600'>{order.customer.address}</p>
      </section>

      <section className='grid gap-5 lg:grid-cols-[1.2fr_1fr]'>
        <div className='rounded-2xl border border-slate-200 bg-white p-5'>
          <h2 className='text-lg font-semibold text-slate-900'>{t('tracking.progressTitle')}</h2>
          <ol className='mt-4 space-y-3'>
            {ORDER_STAGES.map((stageKey, index) => {
              const isDone = index <= currentStageIndex
              return (
                <li key={stageKey} className='flex items-start gap-3'>
                  <span
                    className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                      isDone
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    {isDone ? <HiCheckCircle className='text-sm' /> : index + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                      {t(`status.${stageKey}`)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-5'>
          <h2 className='text-lg font-semibold text-slate-900'>{t('tracking.itemsTitle')}</h2>
          <div className='mt-4 space-y-3'>
            {order.items.map(item => {
              const baseProduct = item.product || getProductById(item.productId)
              if (!baseProduct) {
                return null
              }

              const localizedProduct = getLocalizedProduct(baseProduct, t)

              return (
                <article
                  key={`${order.id}-${item.productId}`}
                  className='flex items-center gap-3 rounded-xl border border-slate-200 p-3'
                >
                  <img
                    src={baseProduct.images[0]}
                    alt={localizedProduct.name}
                    className='h-16 w-16 rounded-lg object-cover'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium text-slate-900'>{localizedProduct.name}</p>
                    <p className='text-xs text-slate-500'>
                      {t('tracking.itemQty')}: {item.quantity}
                    </p>
                  </div>
                  <p className='text-sm font-semibold text-slate-900'>
                    {formatPrice(item.unitPrice * item.quantity, i18n.language)}{' '}
                    {order.currency || t('common.currency')}
                  </p>
                </article>
              )
            })}
          </div>

          <div className='mt-4 border-t border-slate-200 pt-3 text-right text-base font-semibold text-slate-900'>
            {t('tracking.total')}: {formatPrice(order.total, i18n.language)}{' '}
            {order.currency || t('common.currency')}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrackOrder
