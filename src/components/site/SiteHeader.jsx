import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineMagnifyingGlass,
  HiChevronDown,
} from 'react-icons/hi2'
import { UZ, RU, US } from 'country-flag-icons/react/3x2'
import { useTranslation } from 'react-i18next'
import { useShopStore } from '../../store/shopStore'

const navLinks = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/products', labelKey: 'nav.catalog' },
  { to: '/orders', labelKey: 'nav.orders' },
  { to: '/faq', labelKey: 'nav.faq' },
  { to: '/contact', labelKey: 'nav.contact' },
]

function IconBadge({ count }) {
  if (!count) {
    return null
  }

  return (
    <span className='absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white'>
      {count > 99 ? '99+' : count}
    </span>
  )
}

function SiteHeader() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const languageMenuRef = useRef(null)
  const lastScrollYRef = useRef(0)
  const headerVisibleRef = useRef(true)
  const cartCount = useShopStore(state =>
    Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0)
  )
  const wishlistCount = useShopStore(state => state.wishlist.length)

  const languageOptions = useMemo(
    () => [
      { code: 'uz', Flag: UZ, fallbackLabel: 'Uzbek' },
      { code: 'ru', Flag: RU, fallbackLabel: 'Russian' },
      { code: 'en', Flag: US, fallbackLabel: 'English' },
    ],
    []
  )

  const currentLanguage =
    languageOptions.find(
      option => option.code === (i18n.resolvedLanguage || i18n.language || 'uz').slice(0, 2)
    ) || languageOptions[0]

  useEffect(() => {
    const onClickOutside = event => {
      if (!languageMenuRef.current || languageMenuRef.current.contains(event.target)) {
        return
      }
      setIsLanguageMenuOpen(false)
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  useEffect(() => {
    let ticking = false
    lastScrollYRef.current = window.scrollY || 0

    const onScroll = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY || 0
        const lastY = lastScrollYRef.current
        const delta = currentY - lastY
        let nextVisibility = headerVisibleRef.current

        if (currentY <= 20) {
          nextVisibility = true
        } else if (delta > 8) {
          nextVisibility = false
        } else if (delta < -8) {
          nextVisibility = true
        }

        if (nextVisibility !== headerVisibleRef.current) {
          headerVisibleRef.current = nextVisibility
          setIsHeaderVisible(nextVisibility)
          if (!nextVisibility) {
            setIsLanguageMenuOpen(false)
          }
        }

        lastScrollYRef.current = currentY
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onSearchSubmit = event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = String(formData.get('search') || '').trim()
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
  }

  const setLanguage = language => {
    i18n.changeLanguage(language)
    setIsLanguageMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 overflow-visible border-b border-slate-200 bg-white/95 transition-transform duration-300 will-change-transform ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-4 overflow-visible px-4 py-3 sm:px-6 lg:px-8'>
        <NavLink to='/' className='flex items-center gap-3'>
          <span className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white'>
            AV
          </span>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-blue-700'>
              {t('brand.name')}
            </p>
            <p className='text-sm text-slate-500'>{t('brand.tagline')}</p>
          </div>
        </NavLink>

        <form onSubmit={onSearchSubmit} className='order-3 w-full sm:order-none sm:flex-1'>
          <div className='flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 focus-within:border-blue-500 focus-within:bg-white'>
            <HiOutlineMagnifyingGlass className='text-xl text-slate-500' />
            <input
              name='search'
              type='search'
              placeholder={t('nav.searchPlaceholder')}
              aria-label={t('nav.searchAria')}
              className='w-full bg-transparent px-2 py-2.5 text-sm outline-none'
            />
          </div>
        </form>

        <div className='relative z-[70]' ref={languageMenuRef}>
          <button
            type='button'
            onClick={() => setIsLanguageMenuOpen(previous => !previous)}
            className='inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700'
            aria-expanded={isLanguageMenuOpen}
            aria-label={t('nav.language')}
          >
            <currentLanguage.Flag className='h-4 w-5 rounded-[2px] object-cover' />
            <span>{currentLanguage.code.toUpperCase()}</span>
            <HiChevronDown className='text-base text-slate-500' />
          </button>

          {isLanguageMenuOpen ? (
            <div className='absolute right-0 top-[calc(100%+8px)] z-[80] w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg'>
              {languageOptions.map(option => (
                <button
                  key={option.code}
                  type='button'
                  onClick={() => setLanguage(option.code)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                    currentLanguage.code === option.code
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700'
                  }`}
                >
                  <option.Flag className='h-4 w-5 rounded-[2px] object-cover' />
                  <span>{t(`language.${option.code}`, { defaultValue: option.fallbackLabel })}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <nav className='hidden items-center gap-5 text-sm font-medium lg:flex'>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'text-blue-700' : 'text-slate-600 transition hover:text-slate-900'
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-2'>
          <NavLink
            to='/wishes'
            className='relative rounded-full border border-slate-300 p-2 text-slate-700 transition hover:border-blue-600 hover:text-blue-700'
            aria-label={t('nav.wishlist')}
          >
            <HiOutlineHeart className='text-xl' />
            <IconBadge count={wishlistCount} />
          </NavLink>
          <NavLink
            to='/cart'
            data-cart-icon='true'
            className='relative rounded-full border border-slate-300 p-2 text-slate-700 transition hover:border-blue-600 hover:text-blue-700'
            aria-label={t('nav.cart')}
          >
            <HiOutlineShoppingBag className='text-xl' />
            <IconBadge count={cartCount} />
          </NavLink>
        </div>
      </div>

      <nav className='mx-auto flex w-full max-w-[1600px] items-center gap-5 overflow-x-auto overflow-y-hidden whitespace-nowrap px-4 pb-3 text-sm font-medium text-slate-600 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:hidden'>
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? 'shrink-0 whitespace-nowrap text-blue-700'
                : 'shrink-0 whitespace-nowrap text-slate-600'
            }
          >
            {t(link.labelKey)}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default SiteHeader
