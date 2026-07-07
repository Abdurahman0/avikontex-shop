import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiOutlineCheckCircle, HiOutlineShieldCheck } from 'react-icons/hi2'
import PropTypes from 'prop-types'

export default function AuthShell({ eyebrow, title, description, children }) {
  const { t } = useTranslation()

  return (
    <section className='relative isolate overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]'>
      <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-500' />
      <div className='grid min-h-[680px] lg:grid-cols-[0.78fr_1.22fr]'>
        <aside className='relative hidden overflow-hidden bg-[#082b4c] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14'>
          <div className='absolute -right-24 -top-20 h-80 w-80 rounded-full border-[54px] border-white/[0.06]' />
          <div className='absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-2xl' />

          <div className='relative'>
            <Link to='/' className='inline-flex items-center gap-3'>
              <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-black text-blue-800'>
                {t('brand.shortName')}
              </span>
              <span>
                <span className='block text-sm font-bold tracking-[0.18em]'>{t('brand.name')}</span>
                <span className='block text-xs text-blue-100'>{t('brand.tagline')}</span>
              </span>
            </Link>
          </div>

          <div className='relative max-w-md'>
            <p className='mb-4 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300'>
              {t('auth.aside.eyebrow')}
            </p>
            <h2 className='text-4xl font-semibold leading-tight'>{t('auth.aside.title')}</h2>
            <p className='mt-5 leading-7 text-blue-100'>{t('auth.aside.description')}</p>
            <div className='mt-8 space-y-4'>
              {['orders', 'documents', 'security'].map(item => (
                <div key={item} className='flex items-center gap-3 text-sm text-blue-50'>
                  <HiOutlineCheckCircle className='shrink-0 text-xl text-cyan-300' />
                  <span>{t(`auth.aside.benefits.${item}`)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='relative flex items-center gap-3 text-xs text-blue-200'>
            <HiOutlineShieldCheck className='text-xl text-cyan-300' />
            <span>{t('auth.aside.security')}</span>
          </div>
        </aside>

        <div className='flex items-start justify-center px-5 py-8 sm:px-10 sm:py-12 xl:px-16'>
          <div className='w-full max-w-3xl'>
            <div className='mb-8'>
              <p className='text-xs font-bold uppercase tracking-[0.2em] text-blue-700'>{eyebrow}</p>
              <h1 className='mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl'>
                {title}
              </h1>
              <p className='mt-3 max-w-2xl leading-7 text-slate-600'>{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

AuthShell.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
