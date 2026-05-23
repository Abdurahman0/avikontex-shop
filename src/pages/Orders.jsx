import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiCheckCircle } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import EmptyState from '../components/common/EmptyState'
import { getLocalizedProduct } from '../data/products'
import { getProductById, useShopStore } from '../store/shopStore'
import { formatOrderDate } from '../utils/formatOrderDate'
import { formatPrice } from '../utils/formatPrice'

const ORDER_STAGES = ['pending_confirmation', 'packed', 'shipped', 'delivered']

const STATUS_STYLES = {
  pending_confirmation: {
    chip: 'bg-amber-100 text-amber-800',
    bar: 'bg-amber-500',
  },
  packed: {
    chip: 'bg-cyan-100 text-cyan-800',
    bar: 'bg-cyan-500',
  },
  shipped: {
    chip: 'bg-indigo-100 text-indigo-800',
    bar: 'bg-indigo-500',
  },
  delivered: {
    chip: 'bg-emerald-100 text-emerald-800',
    bar: 'bg-emerald-500',
  },
}

function Orders() {
  const { t, i18n } = useTranslation()
  const orders = useShopStore(state => state.orders)
  const [activeStatus, setActiveStatus] = useState('all')

  const normalizedOrders = useMemo(
    () =>
      orders.map(order => {
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
        const stageIndex = Math.max(0, ORDER_STAGES.indexOf(order.statusKey))
        const progressPercent = Math.round(((stageIndex + 1) / ORDER_STAGES.length) * 100)

        const previewItems = order.items
          .map(item => {
            const baseProduct = getProductById(item.productId)
            if (!baseProduct) {
              return null
            }

            const localizedProduct = getLocalizedProduct(baseProduct, t)

            return {
              productId: item.productId,
              image: baseProduct.images[0],
              name: localizedProduct.name,
              quantity: item.quantity,
            }
          })
          .filter(Boolean)

        return {
          ...order,
          itemCount,
          progressPercent,
          createdAtFormatted: formatOrderDate(order.createdAt, i18n.language),
          previewItems,
        }
      }),
    [orders, t, i18n.language]
  )

  const visibleOrders = useMemo(() => {
    if (activeStatus === 'all') {
      return normalizedOrders
    }
    return normalizedOrders.filter(order => order.statusKey === activeStatus)
  }, [activeStatus, normalizedOrders])

  const summary = useMemo(
    () => ({
      totalOrders: normalizedOrders.length,
      totalItems: normalizedOrders.reduce((sum, order) => sum + order.itemCount, 0),
      totalSpent: normalizedOrders.reduce((sum, order) => sum + order.total, 0),
      deliveredCount: normalizedOrders.filter(order => order.statusKey === 'delivered').length,
    }),
    [normalizedOrders]
  )

  const statusFilters = useMemo(() => {
    const counts = ORDER_STAGES.reduce((accumulator, key) => {
      accumulator[key] = normalizedOrders.filter(order => order.statusKey === key).length
      return accumulator
    }, {})

    return [
      {
        key: 'all',
        label: t('categories.all'),
        count: normalizedOrders.length,
      },
      ...ORDER_STAGES.map(statusKey => ({
        key: statusKey,
        label: t(`status.${statusKey}`),
        count: counts[statusKey] || 0,
      })),
    ]
  }, [normalizedOrders, t])

  if (!orders.length) {
    return (
      <EmptyState
        title={t('orders.emptyTitle')}
        description={t('orders.emptyDescription')}
        action={
          <Link to='/products' className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'>
            {t('orders.emptyAction')}
          </Link>
        }
      />
    )
  }

  return (
    <div className='mx-auto w-full max-w-6xl space-y-6'>
      <section className='rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-5 shadow-sm sm:p-6'>
        <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl'>{t('orders.title')}</h1>
        <p className='mt-2 max-w-3xl text-sm text-slate-600 sm:text-base'>{t('orders.description')}</p>

        <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          <article className='rounded-2xl border border-slate-200 bg-white/85 p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>{t('orders.title')}</p>
            <p className='mt-2 text-2xl font-bold text-slate-900'>{summary.totalOrders}</p>
          </article>
          <article className='rounded-2xl border border-slate-200 bg-white/85 p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>{t('orders.itemsCount')}</p>
            <p className='mt-2 text-2xl font-bold text-slate-900'>{summary.totalItems}</p>
          </article>
          <article className='rounded-2xl border border-slate-200 bg-white/85 p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>{t('orders.total')}</p>
            <p className='mt-2 text-2xl font-bold text-slate-900'>
              {formatPrice(summary.totalSpent, i18n.language)} {t('common.currency')}
            </p>
          </article>
          <article className='rounded-2xl border border-slate-200 bg-white/85 p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-500'>{t('status.delivered')}</p>
            <p className='mt-2 inline-flex items-center gap-2 text-2xl font-bold text-emerald-700'>
              <HiCheckCircle className='text-xl' />
              {summary.deliveredCount}
            </p>
          </article>
        </div>
      </section>

      <section className='overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'>
        <div className='flex items-center gap-2 overflow-x-auto pb-1'>
          {statusFilters.map(filter => {
            const isActive = activeStatus === filter.key
            return (
              <button
                key={filter.key}
                type='button'
                onClick={() => setActiveStatus(filter.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className='space-y-4'>
        {visibleOrders.map(order => {
          const statusStyle = STATUS_STYLES[order.statusKey] || STATUS_STYLES.pending_confirmation

          return (
            <article
              key={order.id}
              className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5'
            >
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                  <p className='text-xs uppercase tracking-[0.12em] text-slate-500'>{t('orders.orderId')}</p>
                  <h2 className='mt-1 text-xl font-bold text-slate-900 sm:text-2xl'>{order.id}</h2>
                  <p className='mt-1 text-sm text-slate-500'>
                    {t('orders.createdAt')}: {order.createdAtFormatted}
                  </p>
                </div>

                <div className='flex flex-col items-start gap-2 sm:items-end'>
                  <p className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyle.chip}`}>
                    {t(`status.${order.statusKey}`)}
                  </p>
                  <p className='text-sm font-semibold text-slate-900'>
                    {formatPrice(order.total, i18n.language)} {t('common.currency')}
                  </p>
                </div>
              </div>

              <div className='mt-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4'>
                <div className='mb-2 flex items-center justify-between text-xs font-medium text-slate-500'>
                  <span>{t(`status.${order.statusKey}`)}</span>
                  <span>{order.progressPercent}%</span>
                </div>
                <div className='h-1.5 overflow-hidden rounded-full bg-slate-200'>
                  <div
                    className={`h-full rounded-full transition-all ${statusStyle.bar}`}
                    style={{ width: `${order.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className='mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
                {order.previewItems.slice(0, 3).map(item => (
                  <article
                    key={`${order.id}-${item.productId}`}
                    className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5'
                  >
                    <img src={item.image} alt={item.name} className='h-14 w-14 rounded-lg object-cover' />
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-semibold text-slate-900'>{item.name}</p>
                      <p className='text-xs text-slate-500'>
                        {t('tracking.itemQty')}: {item.quantity}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4'>
                <p className='text-sm text-slate-600'>
                  {t('orders.itemsCount')}: <span className='font-semibold text-slate-900'>{order.itemCount}</span>
                </p>

                <Link
                  to={`/track-order/${order.id}`}
                  className='inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800'
                >
                  {t('orders.trackButton')}
                </Link>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default Orders
