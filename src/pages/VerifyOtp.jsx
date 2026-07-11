import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiArrowRight, HiOutlineDevicePhoneMobile } from 'react-icons/hi2'
import AuthShell from '../components/auth/AuthShell'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { digitsOnly } from '../utils/authForm'

const RESEND_SECONDS = 60

export default function VerifyOtp() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const verifyOtp = useAuthStore(state => state.verifyOtp)
  const phone = location.state?.phone || sessionStorage.getItem('avikontex-pending-phone') || ''
  const devOtp = location.state?.devOtp || sessionStorage.getItem('avikontex-dev-otp') || ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [seconds, setSeconds] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (seconds <= 0) return undefined
    const timer = window.setInterval(() => setSeconds(value => value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [seconds])

  const onSubmit = async event => {
    event.preventDefault()
    if (code.length !== 6) {
      setError(t('auth.validation.otp'))
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      await verifyOtp({ phone, code })
      sessionStorage.removeItem('avikontex-pending-phone')
      sessionStorage.removeItem('avikontex-dev-otp')
      navigate('/account', { replace: true })
    } catch {
      setError(t('auth.otp.invalid'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resend = async () => {
    setIsResending(true)
    setError('')
    try {
      await authService.resendOtp(phone)
      setSeconds(RESEND_SECONDS)
    } catch {
      setError(t('auth.errors.requestFailed'))
    } finally {
      setIsResending(false)
    }
  }

  if (!phone) {
    return (
      <AuthShell
        eyebrow={t('auth.otp.eyebrow')}
        title={t('auth.otp.missingTitle')}
        description={t('auth.otp.missingDescription')}
      >
        <Link to='/register' className='inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white'>
          {t('auth.actions.createAccount')}
          <HiArrowRight />
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow={t('auth.otp.eyebrow')}
      title={t('auth.otp.title')}
      description={t('auth.otp.description', { phone })}
    >
      <div className='mx-auto max-w-md'>
        <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
          <HiOutlineDevicePhoneMobile className='text-3xl' />
        </div>
        {devOtp ? (
          <button
            type='button'
            onClick={() => {
              setCode(String(devOtp))
              setError('')
            }}
            className='mb-5 flex w-full items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left'
          >
            <span>
              <span className='block text-xs font-black uppercase tracking-wider text-amber-700'>{t('auth.otp.testCode')}</span>
              <span className='mt-1 block text-sm font-semibold text-amber-900'>{t('auth.otp.testCodeHint')}</span>
            </span>
            <span className='rounded-xl bg-white px-3 py-2 font-mono text-lg font-black tracking-widest text-amber-900 shadow-sm'>
              {devOtp}
            </span>
          </button>
        ) : null}
        <form onSubmit={onSubmit} noValidate>
          <label className='block text-sm font-semibold text-slate-700' htmlFor='otp-code'>
            {t('auth.fields.otp')}
          </label>
          <input
            id='otp-code'
            value={code}
            onChange={event => {
              setCode(digitsOnly(event.target.value, 6))
              setError('')
            }}
            inputMode='numeric'
            autoComplete='one-time-code'
            maxLength={6}
            autoFocus
            className={`mt-2 w-full rounded-2xl border bg-white px-5 py-4 text-center text-2xl font-bold tracking-[0.45em] outline-none ring-offset-2 transition ${
              error ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
            }`}
            aria-invalid={Boolean(error)}
          />
          {error ? <p className='mt-2 text-sm font-medium text-red-600'>{error}</p> : null}
          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:opacity-60'
          >
            {isSubmitting ? t('auth.actions.verifying') : t('auth.actions.verify')}
            {!isSubmitting ? <HiArrowRight className='text-lg' /> : null}
          </button>
        </form>

        <div className='mt-6 text-center text-sm text-slate-600'>
          {seconds > 0 ? (
            <span>{t('auth.otp.resendIn', { seconds })}</span>
          ) : (
            <button
              type='button'
              disabled={isResending}
              onClick={resend}
              className='font-bold text-blue-700 hover:text-blue-900 disabled:opacity-60'
            >
              {isResending ? t('auth.actions.sending') : t('auth.otp.resend')}
            </button>
          )}
        </div>
      </div>
    </AuthShell>
  )
}
