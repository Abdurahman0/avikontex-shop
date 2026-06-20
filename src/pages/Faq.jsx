import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCreditCard,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineTruck,
} from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'

const fallbackCategoryByIndex = ['orders', 'payment', 'orders', 'shipping', 'products']

const categoryIconMap = {
  orders: HiOutlineShoppingBag,
  shipping: HiOutlineTruck,
  payment: HiOutlineCreditCard,
  products: HiOutlineChatBubbleLeftRight,
}

function Faq() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const items = t('faq.items', { returnObjects: true })

  const categorizedItems = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        category: item.category || fallbackCategoryByIndex[index] || 'orders',
      })),
    [items]
  )

  const categories = useMemo(
    () => [
      { key: 'all', label: t('categories.all') },
      { key: 'orders', label: t('faq.categories.orders') },
      { key: 'shipping', label: t('faq.categories.shipping') },
      { key: 'payment', label: t('faq.categories.payment') },
      { key: 'products', label: t('faq.categories.products') },
    ],
    [t]
  )

  const filteredItems = useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase()

    return categorizedItems.filter(item => {
      const categoryMatches = activeCategory === 'all' || item.category === activeCategory
      if (!categoryMatches) {
        return false
      }

      if (!loweredQuery) {
        return true
      }

      return `${item.q} ${item.a}`.toLowerCase().includes(loweredQuery)
    })
  }, [activeCategory, categorizedItems, searchQuery])

  return (
    <div className='mx-auto w-full max-w-5xl space-y-6'>
      <section className='rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-100 p-5 shadow-sm sm:p-6'>
        <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl'>{t('faq.title')}</h1>
        <p className='mt-2 max-w-3xl text-sm text-slate-600 sm:text-base'>{t('faq.description')}</p>

        <div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {categories
            .filter(category => category.key !== 'all')
            .map(category => {
              const Icon = categoryIconMap[category.key] || HiOutlineChatBubbleLeftRight
              return (
                <article
                  key={category.key}
                  className='rounded-2xl border border-slate-200 bg-white/85 p-3 text-sm text-slate-700'
                >
                  <Icon className='mb-2 text-xl text-blue-700' />
                  <p className='font-semibold text-slate-900'>{category.label}</p>
                </article>
              )
            })}
        </div>
      </section>

      <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-2'>
          {categories.map(category => {
            const isActive = category.key === activeCategory
            return (
              <button
                key={category.key}
                type='button'
                onClick={() => setActiveCategory(category.key)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                {category.label}
              </button>
            )
          })}
        </div>

        <div className='mt-3 flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 focus-within:border-blue-500 focus-within:bg-white'>
          <HiOutlineMagnifyingGlass className='text-lg text-slate-500' />
          <input
            type='search'
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder={t('faq.searchPlaceholder')}
            className='w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none'
          />
        </div>
      </section>

      <section className='space-y-3'>
        {filteredItems.length ? (
          filteredItems.map((item, index) => {
            const isOpen = index === openIndex

            return (
              <article key={item.q} className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className='flex w-full items-center justify-between gap-3 p-4 text-left sm:p-5'
                >
                  <span className='font-semibold text-slate-900'>{item.q}</span>
                  {isOpen ? (
                    <HiChevronUp className='shrink-0 text-xl text-slate-500' />
                  ) : (
                    <HiChevronDown className='shrink-0 text-xl text-slate-500' />
                  )}
                </button>
                {isOpen ? <p className='px-4 pb-4 text-sm leading-6 text-slate-600 sm:px-5'>{item.a}</p> : null}
              </article>
            )
          })
        ) : (
          <article className='rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500'>
            {t('faq.noResults')}
          </article>
        )}
      </section>

      <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <h2 className='text-lg font-semibold text-slate-900'>{t('faq.helpTitle')}</h2>
        <p className='mt-1 text-sm text-slate-600'>{t('faq.helpDescription')}</p>
        <div className='mt-3'>
          <Link
            to='/contact'
            className='inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800'
          >
            {t('faq.helpButton')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Faq
