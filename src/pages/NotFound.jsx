import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFound() {
  const { t } = useTranslation()

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4'>
      <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
        <h1 className='text-3xl font-bold text-slate-900'>404</h1>
        <p className='mt-2 text-sm text-slate-600'>{t('notFound.title')}</p>
        <Link to='/' className='mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white'>
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  )
}

export default NotFound
