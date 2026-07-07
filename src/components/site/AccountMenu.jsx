import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HiChevronDown,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineUserCircle,
} from 'react-icons/hi2'
import { useAuthStore } from '../../store/authStore'

export default function AccountMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthStore(state => state.user)
  const status = useAuthStore(state => state.status)
  const logout = useAuthStore(state => state.logout)
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username

  useEffect(() => {
    const onClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (status === 'idle' || status === 'loading') {
    return <span className='h-10 w-10 animate-pulse rounded-full border border-slate-200 bg-slate-100' />
  }

  if (status !== 'authenticated') {
    return (
      <Link
        to='/login'
        className='inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 px-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700 xl:rounded-xl xl:px-3'
        aria-label={t('auth.actions.signIn')}
      >
        <HiOutlineUser className='text-xl' />
        <span className='hidden xl:inline'>{t('auth.actions.signIn')}</span>
      </Link>
    )
  }

  return (
    <div ref={menuRef} className='relative z-[70]'>
      <button
        type='button'
        onClick={() => setIsOpen(value => !value)}
        className='inline-flex h-10 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-2 text-sm font-semibold text-blue-800 transition hover:border-blue-400 xl:rounded-xl xl:px-3'
        aria-expanded={isOpen}
        aria-label={t('auth.actions.account')}
      >
        <HiOutlineUserCircle className='text-xl' />
        <span className='hidden max-w-28 truncate xl:inline'>{displayName}</span>
        <HiChevronDown className='hidden text-sm xl:block' />
      </button>

      {isOpen ? (
        <div className='absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl'>
          <div className='border-b border-slate-100 px-3 py-3'>
            <p className='truncate text-sm font-bold text-slate-950'>{displayName}</p>
            <p className='mt-0.5 truncate text-xs text-slate-500'>{user?.email || user?.username}</p>
          </div>
          <Link onClick={() => setIsOpen(false)} to='/account' className='mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50'>
            <HiOutlineUser className='text-lg text-blue-700' />
            {t('auth.actions.account')}
          </Link>
          <Link onClick={() => setIsOpen(false)} to='/orders' className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50'>
            <HiOutlineShoppingBag className='text-lg text-blue-700' />
            {t('nav.orders')}
          </Link>
          <button
            type='button'
            onClick={() => {
              logout()
              setIsOpen(false)
              navigate('/')
            }}
            className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50'
          >
            <HiOutlineArrowRightOnRectangle className='text-lg' />
            {t('auth.actions.logout')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
