import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import PropTypes from 'prop-types'

export default function AuthShell({ eyebrow, title, description, children }) {
  const { t } = useTranslation()

  return (
    <section className='relative isolate w-full max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] lg:h-full'>
      <div className='absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-500' />
      <div className='grid min-h-[680px] min-w-0 lg:h-full lg:min-h-0 lg:grid-cols-[0.78fr_1.22fr]'>
        <aside className='relative hidden h-full overflow-hidden bg-[#062844] text-white lg:block'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.20),transparent_31%),radial-gradient(circle_at_90%_70%,rgba(59,130,246,0.22),transparent_36%),linear-gradient(155deg,#062844_0%,#07395a_55%,#064e4b_115%)]' />
            <div className='absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:32px_32px]' />
            <div className='absolute -right-28 top-10 h-72 w-72 rounded-full border-[42px] border-cyan-200/[0.06]' />
            <div className='absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl' />
          </div>

          <div className='relative z-10 mx-auto flex h-full max-w-lg flex-col justify-between gap-7 px-9 py-8 xl:px-12 xl:py-10'>
            <Link
              to='/'
              className='inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-2 pr-4 backdrop-blur-md transition hover:bg-white/[0.11]'
            >
              <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-black text-blue-800 shadow-lg shadow-slate-950/15'>
                {t('brand.shortName')}
              </span>
              <span>
                <span className='block text-sm font-black tracking-[0.18em]'>{t('brand.name')}</span>
                <span className='block text-[11px] text-cyan-100'>{t('brand.tagline')}</span>
              </span>
            </Link>

            <div>
              <span className='inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200'>
                <HiOutlineSparkles className='text-base' />
                {t('auth.aside.eyebrow')}
              </span>
              <h2 className='mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] xl:text-[2.65rem]'>
                {t('auth.aside.title')}
              </h2>
              <p className='mt-4 max-w-md text-sm leading-6 text-blue-100/85'>
                {t('auth.aside.description')}
              </p>

              <div className='mt-7 space-y-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md'>
                {['orders', 'documents', 'security'].map(item => (
                  <div key={item} className='flex items-center gap-3 text-sm text-blue-50'>
                    <HiOutlineCheckCircle className='shrink-0 text-xl text-cyan-300' />
                    <span>{t(`auth.aside.benefits.${item}`)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-2xl border border-emerald-200/15 bg-emerald-300/[0.08] p-4 text-xs leading-5 text-blue-100'>
              <HiOutlineShieldCheck className='mt-0.5 shrink-0 text-xl text-emerald-300' />
              <span>{t('auth.aside.security')}</span>
            </div>
          </div>
        </aside>

        <div className='auth-form-scroll flex min-w-0 items-start justify-center px-5 py-8 sm:px-10 sm:py-12 lg:h-full lg:overflow-y-auto lg:overscroll-contain xl:px-16'>
          <div className='min-w-0 w-full max-w-3xl'>
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
