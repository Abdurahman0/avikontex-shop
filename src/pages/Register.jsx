import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  HiArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineChevronDown,
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlineUser,
} from 'react-icons/hi2'
import AuthShell from '../components/auth/AuthShell'
import FormField from '../components/auth/FormField'
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
  company_type: 'mchj',
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
    <fieldset className='rounded-2xl border border-slate-200 p-4 sm:p-6'>
      <legend className='px-2'>
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
  const [accountType, setAccountType] = useState(
    searchParams.get('type') === 'company' ? 'company' : 'person'
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
  const companyTypeOptions = useMemo(
    () => [
      { value: 'mchj', label: t('auth.options.mchj') },
      { value: 'yatt', label: t('auth.options.yatt') },
    ],
    [t]
  )

  const setValue = (name, value) => {
    setValues(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: undefined, form: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    const requiredFields = accountType === 'company' ? companyRequiredFields : personRequiredFields
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
    if (accountType === 'company' && values.pinfl.length !== 14) {
      nextErrors.pinfl = t('auth.validation.pinfl')
    }
    if (accountType === 'company' && values.inn.length !== 9) {
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
      if (accountType === 'company') {
        await authService.registerCompany(payload)
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
        await authService.registerPerson({ ...payload, account_type: 'jismoniy' })
      }

      sessionStorage.setItem('avikontex-pending-phone', phone)
      navigate('/verify-otp', { state: { phone } })
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
          { value: 'person', icon: HiOutlineUser },
          { value: 'company', icon: HiOutlineBuildingOffice2 },
        ].map(option => (
          <button
            key={option.value}
            type='button'
            onClick={() => {
              setAccountType(option.value)
              setErrors({})
            }}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
              accountType === option.value
                ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50'
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <span className={`rounded-xl p-2.5 ${accountType === option.value ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
              <option.icon className='text-xl' />
            </span>
            <span>
              <span className='block text-sm font-bold text-slate-950'>{t(`auth.types.${option.value}`)}</span>
              <span className='mt-1 block text-xs leading-5 text-slate-500'>{t(`auth.types.${option.value}Hint`)}</span>
            </span>
          </button>
        ))}
      </div>

      {errors.form ? (
        <div role='alert' className='mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {errors.form}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className='space-y-6' noValidate>
        {accountType === 'company' ? (
          <FormSection
            icon={HiOutlineBuildingOffice2}
            title={t('auth.sections.company')}
            description={t('auth.sections.companyDescription')}
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField {...input('company_name')} className='sm:col-span-2' />
              <ChoiceButtons
                label={t('auth.fields.company_type')}
                name='company_type'
                value={values.company_type}
                options={companyTypeOptions}
                onChange={setValue}
              />
              <FormField
                {...input('inn')}
                inputMode='numeric'
                maxLength={9}
                onChange={event => setValue('inn', digitsOnly(event.target.value, 9))}
              />
            </div>
          </FormSection>
        ) : null}

        <FormSection
          icon={HiOutlineIdentification}
          title={accountType === 'company' ? t('auth.sections.director') : t('auth.sections.personal')}
          description={accountType === 'company' ? t('auth.sections.directorDescription') : ''}
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

          {accountType === 'company' ? (
            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <FormField
                {...input('passport_series')}
                maxLength={10}
                onChange={event => setValue('passport_series', event.target.value.toUpperCase())}
              />
              <FormField
                {...input('passport_number')}
                maxLength={20}
                onChange={event => setValue('passport_number', event.target.value.toUpperCase())}
              />
              <FormField
                {...input('pinfl')}
                inputMode='numeric'
                maxLength={14}
                onChange={event => setValue('pinfl', digitsOnly(event.target.value, 14))}
              />
              <FormField {...input('birth_date')} type='date' max={new Date().toISOString().slice(0, 10)} />
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
                <FormField {...input('birth_date')} type='date' max={new Date().toISOString().slice(0, 10)} />
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

        {accountType === 'company' ? (
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
