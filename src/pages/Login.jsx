import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiArrowRight, HiOutlineBuildingOffice2, HiOutlineUser } from 'react-icons/hi2'
import AuthShell from '../components/auth/AuthShell'
import FormField from '../components/auth/FormField'
import { useAuthStore } from '../store/authStore'
import { getSafeReturnPath } from '../utils/authForm'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useAuthStore(state => state.login)
  const [accountType, setAccountType] = useState('person')
  const [values, setValues] = useState({ login: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    const nextErrors = {}
    if (!values.login.trim()) nextErrors.login = t('auth.validation.required')
    if (!values.password) nextErrors.password = t('auth.validation.required')
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    try {
      await login({ login: values.login.trim(), password: values.password })
      navigate(getSafeReturnPath(searchParams.get('returnTo')), { replace: true })
    } catch (error) {
      setErrors({
        ...error.fieldErrors,
        form: error.status ? t('auth.login.invalidCredentials') : t('auth.errors.requestFailed'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow={t('auth.login.eyebrow')}
      title={t('auth.login.title')}
      description={t('auth.login.description')}
    >
      <div className='mb-7 grid grid-cols-2 gap-3' role='group' aria-label={t('auth.login.accountType')}>
        {[
          { value: 'person', icon: HiOutlineUser },
          { value: 'company', icon: HiOutlineBuildingOffice2 },
        ].map(option => {
          const Icon = option.icon
          const isSelected = accountType === option.value

          return (
            <button
              key={option.value}
              type='button'
              aria-pressed={isSelected}
              onClick={() => setAccountType(option.value)}
              className={`rounded-xl border p-3 text-left transition ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <Icon className={`mb-2 text-xl ${isSelected ? 'text-blue-700' : 'text-slate-600'}`} />
              <p className='text-sm font-semibold text-slate-900'>{t(`auth.types.${option.value}`)}</p>
              <p className='mt-1 text-xs leading-5 text-slate-500'>{t(`auth.login.${option.value}Hint`)}</p>
            </button>
          )
        })}
      </div>

      {errors.form ? (
        <div role='alert' className='mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {errors.form}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className='space-y-5' noValidate>
        <FormField
          label={t('auth.fields.login')}
          placeholder={t('auth.placeholders.login')}
          autoComplete='username'
          value={values.login}
          error={errors.login}
          onChange={event => setValues(current => ({ ...current, login: event.target.value }))}
        />
        <FormField
          label={t('auth.fields.password')}
          type='password'
          placeholder={t('auth.placeholders.password')}
          autoComplete='current-password'
          value={values.password}
          error={errors.password}
          data-visibility-label={t('auth.actions.togglePassword')}
          onChange={event => setValues(current => ({ ...current, password: event.target.value }))}
        />

        <button
          type='submit'
          disabled={isSubmitting}
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isSubmitting ? t('auth.actions.signingIn') : t('auth.actions.signIn')}
          {!isSubmitting ? <HiArrowRight className='text-lg' /> : null}
        </button>
      </form>

      <div className='mt-7 border-t border-slate-200 pt-6 text-center text-sm text-slate-600'>
        {t('auth.login.noAccount')}{' '}
        <Link to={`/register?type=${accountType}`} className='font-bold text-blue-700 hover:text-blue-900'>
          {t('auth.actions.createAccount')}
        </Link>
      </div>
    </AuthShell>
  )
}
