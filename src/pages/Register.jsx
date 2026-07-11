import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  HiArrowRight,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineBuildingLibrary,
  HiOutlineChevronDown,
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlineUser,
} from 'react-icons/hi2'
import AuthShell from '../components/auth/AuthShell'
import FormField from '../components/auth/FormField'
import HandmadeDatePicker from '../components/common/HandmadeDatePicker'
import { unwrapPayload } from '../services/apiClient'
import { authService } from '../services/authService'
import { digitsOnly, normalizePhone, omitEmptyValues } from '../utils/authForm'

const initialValues = {
  first_name: '',
  last_name: '',
  middle_name: '',
  phone: '',
  email: '',
  password: '',
  confirm_password: '',
  passport_series: '',
  passport_number: '',
  pinfl: '',
  birth_date: '',
  gender: '',
  company_type: 'yatt',
  company_name: '',
  inn: '',
  settlement_account: '',
  bank: '',
  mfo: '',
  legal_address: '',
  real_address: '',
}

const companyRequiredFields = [
  'first_name',
  'last_name',
  'phone',
  'email',
  'password',
  'confirm_password',
  'passport_series',
  'passport_number',
  'pinfl',
  'birth_date',
  'gender',
  'company_name',
  'inn',
]

const personRequiredFields = [
  'first_name',
  'last_name',
  'phone',
  'email',
  'password',
  'confirm_password',
]

function ChoiceButtons({ label, name, value, options, onChange, error }) {
  return (
    <div>
      <p className='mb-1.5 text-sm font-semibold text-slate-700'>{label}</p>
      <div className='grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5'>
        {options.map(option => (
          <button
            key={option.value}
            type='button'
            onClick={() => onChange(name, option.value)}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              value === option.value
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error ? <p className='mt-1.5 text-xs font-medium text-red-600'>{error}</p> : null}
    </div>
  )
}

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <fieldset className='min-w-0 max-w-full rounded-2xl border border-slate-200 p-4 sm:p-6'>
      <legend className='max-w-full px-2'>
        <span className='flex items-center gap-2 text-base font-bold text-slate-950'>
          <Icon className='text-xl text-blue-700' />
          {title}
        </span>
      </legend>
      {description ? <p className='mb-5 text-sm text-slate-500'>{description}</p> : null}
      {children}
    </fieldset>
  )
}

ChoiceButtons.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
}

FormSection.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedType = searchParams.get('type')
  const [accountType, setAccountType] = useState(
    ['yatt', 'mchj'].includes(requestedType)
      ? requestedType
      : requestedType === 'company'
        ? 'mchj'
        : 'jismoniy'
  )
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const genderOptions = useMemo(
    () => [
      { value: 'male', label: t('auth.options.male') },
      { value: 'female', label: t('auth.options.female') },
    ],
    [t]
  )
  const isBusiness = ['yatt', 'mchj'].includes(accountType)
  const isYatt = accountType === 'yatt'
  const today = new Date()
  const maxBirthDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const initialBirthView = `${today.getFullYear() - 25}-01-01`

  const setValue = (name, value) => {
    setValues(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: undefined, form: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    const requiredFields = isBusiness ? companyRequiredFields : personRequiredFields
    requiredFields.forEach(field => {
      if (!String(values[field] || '').trim()) nextErrors[field] = t('auth.validation.required')
    })
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = t('auth.validation.email')
    }
    if (values.phone && !/^\+998\d{9}$/.test(normalizePhone(values.phone))) {
      nextErrors.phone = t('auth.validation.phone')
    }
    if (values.password && values.password.length < 6) {
      nextErrors.password = t('auth.validation.passwordLength')
    }
    if (values.confirm_password && values.password !== values.confirm_password) {
      nextErrors.confirm_password = t('auth.validation.passwordMatch')
    }
    if (isBusiness && values.passport_series.length !== 2) {
      nextErrors.passport_series = t('auth.validation.passportSeries')
    }
    if (isBusiness && values.passport_number.length !== 7) {
      nextErrors.passport_number = t('auth.validation.passportNumber')
    }
    if (isBusiness && values.pinfl.length !== 14) {
      nextErrors.pinfl = t('auth.validation.pinfl')
    }
    if (isBusiness && values.inn.length !== 9) {
      nextErrors.inn = t('auth.validation.inn')
    }
    return nextErrors
  }

  const onSubmit = async event => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      document.querySelector('[aria-invalid="true"]')?.focus()
      return
    }

    const phone = normalizePhone(values.phone)
    const payload = omitEmptyValues({ ...values, phone, email: values.email.trim().toLowerCase() })
    setIsSubmitting(true)
    try {
      let response
      if (isBusiness) {
        response = await authService.registerCompany({ ...payload, company_type: accountType })
      } else {
        const companyOnlyFields = [
          'company_type',
          'company_name',
          'inn',
          'settlement_account',
          'bank',
          'mfo',
          'legal_address',
          'real_address',
        ]
        companyOnlyFields.forEach(field => delete payload[field])
        response = await authService.registerPerson({ ...payload, account_type: 'jismoniy' })
      }

      const devOtp = unwrapPayload(response)?.dev_otp || ''
      sessionStorage.setItem('avikontex-pending-phone', phone)
      sessionStorage.removeItem('avikontex-dev-otp')
      if (devOtp) sessionStorage.setItem('avikontex-dev-otp', String(devOtp))
      navigate('/verify-otp', { state: { phone, devOtp } })
    } catch (error) {
      setErrors({ ...error.fieldErrors, form: t('auth.errors.registrationFailed') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const input = (name, options = {}) => ({
    name,
    value: values[name],
    error: errors[name],
    label: t(`auth.fields.${name}`),
    placeholder: t(`auth.placeholders.${name}`),
    onChange: event => setValue(name, event.target.value),
    ...options,
  })

  return (
    <AuthShell
      eyebrow={t('auth.register.eyebrow')}
      title={t('auth.register.title')}
      description={t('auth.register.description')}
    >
      <div className='mb-8 grid gap-3 sm:grid-cols-2'>
        {[
          { value: 'jismoniy', icon: HiOutlineUser },
          { value: 'yatt', icon: HiOutlineBriefcase },
          { value: 'mchj', icon: HiOutlineBuildingOffice2 },
          { value: 'budjet', icon: HiOutlineBuildingLibrary, disabled: true },
        ].map(option => (
          <button
            key={option.value}
            type='button'
            disabled={option.disabled}
            onClick={() => {
              setAccountType(option.value)
              if (['yatt', 'mchj'].includes(option.value)) {
                setValues(current => ({ ...current, company_type: option.value }))
              }
              setErrors({})
            }}
            className={`relative min-w-0 flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
              accountType === option.value
                ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50'
                : option.disabled
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-75'
                  : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <span className={`rounded-xl p-2.5 ${accountType === option.value ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
              <option.icon className='text-xl' />
            </span>
            <span className='min-w-0'>
              <span className={`block text-sm font-bold text-slate-950 ${option.disabled ? 'pr-28' : ''}`}>{t(`auth.types.${option.value}`)}</span>
              <span className='mt-1 block text-xs leading-5 text-slate-500'>{t(`auth.types.${option.value}Hint`)}</span>
            </span>
            {option.disabled ? (
              <span className='absolute right-3 top-3 rounded-full bg-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600'>
                {t('auth.types.operatorOnly')}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {errors.form ? (
        <div role='alert' className='mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {errors.form}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className='space-y-6' noValidate>
        <FormSection
          icon={HiOutlineIdentification}
          title={isBusiness ? t(isYatt ? 'auth.sections.entrepreneur' : 'auth.sections.director') : t('auth.sections.personal')}
          description={isBusiness ? t(isYatt ? 'auth.sections.entrepreneurDescription' : 'auth.sections.directorDescription') : ''}
        >
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField {...input('last_name')} />
            <FormField {...input('first_name')} />
            <FormField {...input('middle_name')} className='sm:col-span-2' />
            <FormField
              {...input('phone')}
              type='tel'
              inputMode='tel'
              autoComplete='tel'
              onBlur={() => setValue('phone', normalizePhone(values.phone))}
            />
            <FormField {...input('email')} type='email' autoComplete='email' />
          </div>

          {isBusiness ? (
            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <FormField
                {...input('passport_series')}
                maxLength={2}
                onChange={event => setValue('passport_series', event.target.value.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 2))}
              />
              <FormField
                {...input('passport_number')}
                inputMode='numeric'
                maxLength={7}
                onChange={event => setValue('passport_number', digitsOnly(event.target.value, 7))}
              />
              <FormField
                {...input('pinfl')}
                inputMode='numeric'
                maxLength={14}
                onChange={event => setValue('pinfl', digitsOnly(event.target.value, 14))}
              />
              <HandmadeDatePicker
                label={t('auth.fields.birth_date')}
                value={values.birth_date}
                onChange={value => setValue('birth_date', value)}
                error={errors.birth_date}
                max={maxBirthDate}
                initialViewDate={initialBirthView}
                required
              />
              <ChoiceButtons
                label={t('auth.fields.gender')}
                name='gender'
                value={values.gender}
                options={genderOptions}
                onChange={setValue}
                error={errors.gender}
              />
            </div>
          ) : (
            <details className='mt-5 rounded-xl border border-slate-200 bg-slate-50'>
              <summary className='flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700'>
                {t('auth.sections.optionalIdentity')}
                <HiOutlineChevronDown className='text-lg' />
              </summary>
              <div className='grid gap-4 border-t border-slate-200 p-4 sm:grid-cols-2'>
                <FormField {...input('passport_series')} maxLength={10} />
                <FormField {...input('passport_number')} maxLength={20} />
                <FormField
                  {...input('pinfl')}
                  inputMode='numeric'
                  maxLength={14}
                  onChange={event => setValue('pinfl', digitsOnly(event.target.value, 14))}
                />
                <HandmadeDatePicker
                  label={t('auth.fields.birth_date')}
                  value={values.birth_date}
                  onChange={value => setValue('birth_date', value)}
                  error={errors.birth_date}
                  max={maxBirthDate}
                  initialViewDate={initialBirthView}
                />
                <ChoiceButtons
                  label={t('auth.fields.gender')}
                  name='gender'
                  value={values.gender}
                  options={genderOptions}
                  onChange={setValue}
                  error={errors.gender}
                />
              </div>
            </details>
          )}
        </FormSection>

        {isBusiness ? (
          <FormSection
            icon={isYatt ? HiOutlineBriefcase : HiOutlineBuildingOffice2}
            title={t(isYatt ? 'auth.sections.business' : 'auth.sections.company')}
            description={t(isYatt ? 'auth.sections.businessDescription' : 'auth.sections.companyDescription')}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                {...input('company_name', {
                  label: t(isYatt ? 'auth.fields.business_name' : 'auth.fields.company_name'),
                  placeholder: t(isYatt ? 'auth.placeholders.business_name' : 'auth.placeholders.company_name'),
                })}
                className='sm:col-span-2'
              />
              <div className='rounded-xl border border-blue-100 bg-blue-50 px-4 py-3'>
                <p className='text-xs font-bold uppercase tracking-wide text-blue-600'>{t('auth.fields.company_type')}</p>
                <p className='mt-1 text-sm font-black text-slate-950'>{t(`auth.types.${accountType}`)}</p>
              </div>
              <FormField
                {...input('inn')}
                inputMode='numeric'
                maxLength={9}
                onChange={event => setValue('inn', digitsOnly(event.target.value, 9))}
              />
            </div>
          </FormSection>
        ) : null}

        {isBusiness ? (
          <details className='rounded-2xl border border-slate-200'>
            <summary className='flex cursor-pointer list-none items-center justify-between p-4 text-sm font-bold text-slate-900 sm:px-6'>
              {t('auth.sections.companyOptional')}
              <HiOutlineChevronDown className='text-lg text-slate-500' />
            </summary>
            <div className='grid gap-4 border-t border-slate-200 p-4 sm:grid-cols-2 sm:p-6'>
              <FormField {...input('settlement_account')} />
              <FormField {...input('bank')} />
              <FormField {...input('mfo')} maxLength={10} />
              <FormField {...input('legal_address')} className='sm:col-span-2' />
              <FormField {...input('real_address')} className='sm:col-span-2' />
            </div>
          </details>
        ) : null}

        <FormSection icon={HiOutlineLockClosed} title={t('auth.sections.security')}>
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField
              {...input('password')}
              type='password'
              autoComplete='new-password'
              hint={t('auth.hints.password')}
              data-visibility-label={t('auth.actions.togglePassword')}
            />
            <FormField
              {...input('confirm_password')}
              type='password'
              autoComplete='new-password'
              data-visibility-label={t('auth.actions.togglePassword')}
            />
          </div>
        </FormSection>

        <p className='text-xs leading-5 text-slate-500'>{t('auth.register.terms')}</p>
        <button
          type='submit'
          disabled={isSubmitting}
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isSubmitting ? t('auth.actions.submitting') : t('auth.actions.register')}
          {!isSubmitting ? <HiArrowRight className='text-lg' /> : null}
        </button>
      </form>

      <p className='mt-7 text-center text-sm text-slate-600'>
        {t('auth.register.hasAccount')}{' '}
        <Link to='/login' className='font-bold text-blue-700 hover:text-blue-900'>
          {t('auth.actions.signIn')}
        </Link>
      </p>
    </AuthShell>
  )
}
