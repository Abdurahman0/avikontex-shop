import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ENTRY_NOTICE_KEY = 'avikontex-entry-notice-acknowledged'

function EntryNoticeModal() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const sections = t('entryNotice.sections', { returnObjects: true })

  useEffect(() => {
    const isAcknowledged = localStorage.getItem(ENTRY_NOTICE_KEY) === 'true'
    setIsVisible(!isAcknowledged)
  }, [])

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isVisible])

  const onConfirm = () => {
    if (!isChecked) {
      return
    }

    localStorage.setItem(ENTRY_NOTICE_KEY, 'true')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='entry-notice-title'
        className='w-full max-w-2xl rounded-[28px] border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-950/15 sm:p-8'
      >
        <span className='inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-blue-700'>
          {t('entryNotice.badge')}
        </span>
        <h2 id='entry-notice-title' className='mt-4 text-2xl font-bold text-slate-900 sm:text-3xl'>
          {t('entryNotice.title')}
        </h2>
        <div className='mt-5 max-h-[52vh] overflow-y-auto rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5'>
          <p className='text-sm leading-6 text-slate-700'>{t('entryNotice.description')}</p>

          <div className='mt-4 space-y-4'>
            {sections.map(section => (
              <section key={section.title} className='rounded-2xl bg-white/80 p-4'>
                <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-blue-700'>
                  {section.title}
                </h3>
                <p className='mt-2 text-sm leading-6 text-slate-700'>{section.body}</p>
              </section>
            ))}
          </div>
        </div>

        <label className='mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={event => setIsChecked(event.target.checked)}
            className='mt-0.5 h-4 w-4 rounded border-slate-300 accent-blue-600'
          />
          <span>{t('entryNotice.checkbox')}</span>
        </label>

        <button
          type='button'
          onClick={onConfirm}
          disabled={!isChecked}
          className='mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300'
        >
          {t('entryNotice.confirm')}
        </button>
      </div>
    </div>
  )
}

export default EntryNoticeModal
