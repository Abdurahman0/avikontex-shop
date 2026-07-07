import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import PropTypes from 'prop-types'

export default function RequireAuth({ children }) {
  const { t } = useTranslation()
  const location = useLocation()
  const status = useAuthStore(state => state.status)

  if (status === 'idle' || status === 'loading') {
    return (
      <div className='flex min-h-[45vh] items-center justify-center'>
        <div className='flex items-center gap-3 text-sm font-medium text-slate-600'>
          <span className='h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700' />
          {t('common.loading')}
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    const returnTo = `${location.pathname}${location.search}`
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />
  }

  return children
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
}
