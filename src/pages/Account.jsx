import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HiArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineCheckBadge,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShoppingBag,
  HiOutlineUserCircle,
} from 'react-icons/hi2'
import { useAuthStore } from '../store/authStore'
import { getClientVerification, getVerificationTone } from '../utils/clientVerification'
import LegalEntityReviewPanel from '../components/account/LegalEntityReviewPanel'

export default function Account() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username
  const verification = getClientVerification(user)
  const isCompany = verification.requiresReview
  const verificationTone = getVerificationTone(verification.status)

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <section className='space-y-6'>
      <div className='overflow-hidden rounded-3xl bg-[#082b4c] px-6 py-8 text-white sm:px-10'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-4'>
            <span className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15'>
              {isCompany ? <HiOutlineBuildingOffice2 className='text-3xl' /> : <HiOutlineUserCircle className='text-4xl' />}
            </span>
            <div>
              <p className='text-sm text-blue-200'>{t(isCompany ? 'auth.types.company' : 'auth.types.person')}</p>
              <h1 className='mt-1 text-2xl font-semibold sm:text-3xl'>{displayName}</h1>
            </div>
          </div>
          <div className='flex flex-col items-start gap-3 sm:items-end'>
            {verification.requiresReview && verification.status ? (
              <span className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold ring-1 ring-white/15'>
                <HiOutlineCheckBadge className='text-lg' />
                {t(`verification.status.${verificationTone}`)}
              </span>
            ) : null}
            <button onClick={onLogout} className='self-start rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold transition hover:bg-white/10 sm:self-auto'>
              {t('auth.actions.logout')}
            </button>
          </div>
        </div>
      </div>

      {verification.requiresReview ? <LegalEntityReviewPanel verification={verification} /> : null}

      <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <article className='rounded-2xl border border-slate-200 bg-white p-6'>
          <h2 className='text-lg font-bold text-slate-950'>{t('auth.account.contactTitle')}</h2>
          <div className='mt-5 divide-y divide-slate-100'>
            <div className='flex items-center gap-3 py-4'>
              <HiOutlineEnvelope className='text-xl text-blue-700' />
              <div>
                <p className='text-xs text-slate-500'>{t('auth.fields.email')}</p>
                <p className='mt-0.5 text-sm font-semibold text-slate-900'>{user?.email || t('auth.account.notProvided')}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 py-4'>
              <HiOutlinePhone className='text-xl text-blue-700' />
              <div>
                <p className='text-xs text-slate-500'>{t('auth.fields.phone')}</p>
                <p className='mt-0.5 text-sm font-semibold text-slate-900'>{user?.phone || user?.username || t('auth.account.notProvided')}</p>
              </div>
            </div>
          </div>
        </article>

        <Link to='/orders' className='group flex min-h-56 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg'>
          <span className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700'>
            <HiOutlineShoppingBag className='text-2xl' />
          </span>
          <span>
            <span className='block text-lg font-bold text-slate-950'>{t('auth.account.ordersTitle')}</span>
            <span className='mt-2 block text-sm leading-6 text-slate-500'>{t('auth.account.ordersDescription')}</span>
            <span className='mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700'>
              {t('auth.account.openOrders')}
              <HiArrowRight className='transition group-hover:translate-x-1' />
            </span>
          </span>
        </Link>
      </div>
    </section>
  )
}
