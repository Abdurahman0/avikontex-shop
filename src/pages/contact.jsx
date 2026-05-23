import { Link } from 'react-router-dom'
import {
  HiOutlineArrowUpRight,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePaperAirplane,
  HiOutlinePhone,
} from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'

function Contact() {
  const { t } = useTranslation()

  return (
    <div className='mx-auto w-full max-w-6xl space-y-6'>
      <section className='rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-5 shadow-sm sm:p-6'>
        <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl'>{t('contact.title')}</h1>
        <p className='mt-2 max-w-3xl text-sm text-slate-600 sm:text-base'>{t('contact.description')}</p>

        <div className='mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-800'>
          <HiOutlineClock className='text-base' />
          <span>{t('contact.responseTime')}</span>
        </div>
      </section>

      <section className='grid gap-4 lg:grid-cols-[1.2fr_1fr]'>
        <div className='space-y-4'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <article className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
              <div className='inline-flex rounded-full bg-emerald-100 p-2 text-emerald-700'>
                <HiOutlinePhone className='text-lg' />
              </div>
              <p className='mt-3 text-xs uppercase tracking-wide text-slate-500'>{t('contact.phone')}</p>
              <a
                href='tel:+998900000001'
                className='mt-1 inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-emerald-700'
              >
                +998 90 000 00 01
                <HiOutlineArrowUpRight className='text-sm' />
              </a>
            </article>

            <article className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
              <div className='inline-flex rounded-full bg-cyan-100 p-2 text-cyan-700'>
                <HiOutlineEnvelope className='text-lg' />
              </div>
              <p className='mt-3 text-xs uppercase tracking-wide text-slate-500'>{t('contact.email')}</p>
              <a
                href='mailto:info@avikontex.uz'
                className='mt-1 inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-emerald-700'
              >
                info@avikontex.uz
                <HiOutlineArrowUpRight className='text-sm' />
              </a>
            </article>

            <article className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
              <div className='inline-flex rounded-full bg-violet-100 p-2 text-violet-700'>
                <HiOutlinePaperAirplane className='text-lg' />
              </div>
              <p className='mt-3 text-xs uppercase tracking-wide text-slate-500'>{t('contact.telegram')}</p>
              <a
                href='https://t.me/avikontex'
                target='_blank'
                rel='noreferrer'
                className='mt-1 inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-emerald-700'
              >
                @avikontex
                <HiOutlineArrowUpRight className='text-sm' />
              </a>
            </article>

            <article className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
              <div className='inline-flex rounded-full bg-amber-100 p-2 text-amber-700'>
                <HiOutlineMapPin className='text-lg' />
              </div>
              <p className='mt-3 text-xs uppercase tracking-wide text-slate-500'>{t('contact.address')}</p>
              <a
                href='https://maps.google.com/?q=Tashkent,Uzbekistan'
                target='_blank'
                rel='noreferrer'
                className='mt-1 inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-emerald-700'
              >
                {t('contact.addressValue')}
                <HiOutlineArrowUpRight className='text-sm' />
              </a>
            </article>
          </div>

          <article className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <h2 className='text-lg font-semibold text-slate-900'>{t('contact.hoursTitle')}</h2>
            <div className='mt-3 space-y-2 text-sm text-slate-600'>
              <p>{t('contact.hoursWeekdays')}</p>
              <p>{t('contact.hoursWeekend')}</p>
            </div>
          </article>
        </div>

        <div className='space-y-4'>
          <article className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='inline-flex rounded-full bg-slate-100 p-2 text-slate-700'>
              <HiOutlineChatBubbleLeftRight className='text-lg' />
            </div>
            <h2 className='mt-3 text-lg font-semibold text-slate-900'>{t('contact.needHelpTitle')}</h2>
            <p className='mt-1 text-sm text-slate-600'>{t('contact.needHelpDescription')}</p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <a
                href='tel:+998900000001'
                className='inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800'
              >
                {t('contact.callAction')}
              </a>
              <a
                href='mailto:info@avikontex.uz'
                className='inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700'
              >
                {t('contact.emailAction')}
              </a>
            </div>
          </article>

          <article className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <h2 className='text-lg font-semibold text-slate-900'>{t('contact.faqTitle')}</h2>
            <p className='mt-1 text-sm text-slate-600'>{t('contact.faqDescription')}</p>
            <Link
              to='/faq'
              className='mt-4 inline-flex items-center gap-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700'
            >
              {t('contact.faqAction')}
              <HiOutlineArrowUpRight className='text-sm' />
            </Link>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Contact
