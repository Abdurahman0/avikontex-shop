import { useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation()

  return (
    <div className='space-y-6'>
      <section className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200'>
        <h1 className='text-3xl font-bold text-slate-900'>{t('about.title')}</h1>
        <p className='mt-3 text-sm leading-6 text-slate-600'>{t('about.description')}</p>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        <article className='rounded-2xl border border-slate-200 bg-white p-5'>
          <h2 className='font-semibold text-slate-900'>{t('about.card1Title')}</h2>
          <p className='mt-2 text-sm text-slate-600'>{t('about.card1Text')}</p>
        </article>
        <article className='rounded-2xl border border-slate-200 bg-white p-5'>
          <h2 className='font-semibold text-slate-900'>{t('about.card2Title')}</h2>
          <p className='mt-2 text-sm text-slate-600'>{t('about.card2Text')}</p>
        </article>
        <article className='rounded-2xl border border-slate-200 bg-white p-5'>
          <h2 className='font-semibold text-slate-900'>{t('about.card3Title')}</h2>
          <p className='mt-2 text-sm text-slate-600'>{t('about.card3Text')}</p>
        </article>
      </section>
    </div>
  )
}

export default About
