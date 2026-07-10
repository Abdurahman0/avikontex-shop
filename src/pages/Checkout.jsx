import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import HandmadeSelect from '../components/common/HandmadeSelect'
import { useShopStore } from '../store/shopStore'
import { useAuthStore } from '../store/authStore'
import { companyService } from '../services/companyService'
import { getClientVerification, getVerificationTone } from '../utils/clientVerification'

const initialForm = {
  fullName: '',
  phone: '+998',
  address: '',
  payment: 'cash_on_delivery',
}

function formatCompanyAddress(address) {
  return [
    address.region_name,
    address.district_name,
    address.street,
    address.house,
    address.apartment,
    address.landmark,
  ]
    .filter(Boolean)
    .join(', ')
}

function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const cartCount = useShopStore(state => Object.keys(state.cart).length)
  const shopStatus = useShopStore(state => state.status)
  const placeOrder = useShopStore(state => state.placeOrder)
  const refreshMe = useAuthStore(state => state.refreshMe)
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [company, setCompany] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const verification = getClientVerification(user)
  const verificationTone = getVerificationTone(verification.status)
  const verificationStyles = {
    pending: 'border-amber-200 bg-amber-50 text-amber-900',
    verified: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    rejected: 'border-rose-200 bg-rose-50 text-rose-800',
  }

  useEffect(() => {
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ')
    const accountPhone = user?.phone || (String(user?.username || '').startsWith('+') ? user.username : '')
    setForm(current => ({
      ...current,
      fullName: current.fullName || fullName,
      phone: current.phone === '+998' && accountPhone ? accountPhone : current.phone,
    }))
  }, [user])

  const paymentOptions = useMemo(
    () => [
      { value: 'cash_on_delivery', label: t('checkout.cashOnDelivery') },
      { value: 'bank_transfer', label: t('checkout.bankTransfer') },
    ],
    [t]
  )

  const addressOptions = useMemo(
    () => [
      ...addresses.map(address => ({
        value: address.id,
        label: address.label || formatCompanyAddress(address) || t('checkout.savedAddress'),
      })),
      { value: '', label: t('checkout.manualAddress') },
    ],
    [addresses, t]
  )

  const selectedAddress = useMemo(
    () => addresses.find(address => address.id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  )

  useEffect(() => {
    if (shopStatus === 'idle' || shopStatus === 'loading') {
      return
    }
    if (!cartCount) {
      navigate('/cart')
    }
  }, [cartCount, navigate, shopStatus])

  useEffect(() => {
    refreshMe().catch(() => {})
  }, [refreshMe])

  useEffect(() => {
    if (!verification.requiresReview) {
      setCompany(null)
      setAddresses([])
      setSelectedAddressId('')
      return
    }

    let active = true
    setIsAddressLoading(true)
    companyService.getCompanies()
      .then(async companies => {
        if (!active) return
        const nextCompany = companies[0] || null
        setCompany(nextCompany)
        if (!nextCompany?.id) {
          setAddresses([])
          setSelectedAddressId('')
          return
        }

        const deliveryAddresses = await companyService.getAddresses(nextCompany.id, 'delivery')
        const nextAddresses = deliveryAddresses.length
          ? deliveryAddresses
          : await companyService.getAddresses(nextCompany.id)
        if (!active) return
        setAddresses(nextAddresses)
        setSelectedAddressId(nextAddresses.find(address => address.is_default)?.id || nextAddresses[0]?.id || '')
      })
      .catch(() => {
        if (!active) return
        setAddresses([])
        setSelectedAddressId('')
      })
      .finally(() => {
        if (active) setIsAddressLoading(false)
      })

    return () => {
      active = false
    }
  }, [verification.requiresReview])

  const onInput = event => {
    setForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = async event => {
    event.preventDefault()

    const deliveryAddress = selectedAddress ? formatCompanyAddress(selectedAddress) : form.address.trim()

    if (!form.fullName.trim() || !form.phone.trim() || !deliveryAddress) {
      toast.error(t('checkout.validationError'))
      return
    }
    if (verification.isBlocked) {
      toast.error(t('checkout.verificationBlocked'))
      return
    }

    setIsSubmitting(true)
    let orderId = null
    try {
      orderId = await placeOrder({
        ...form,
        address: deliveryAddress,
        companyId: company?.id || null,
        addressId: selectedAddress?.id || null,
      })
    } finally {
      setIsSubmitting(false)
    }

    if (!orderId) {
      toast.error(t('checkout.emptyError'))
      return
    }

    toast.success(t('checkout.success'))
    navigate(`/track-order/${orderId}`)
  }

  return (
    <div className='mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6'>
      <h1 className='text-3xl font-bold text-slate-900'>{t('checkout.title')}</h1>
      <p className='mt-1 text-sm text-slate-500'>{t('checkout.description')}</p>

      {verification.requiresReview && verification.status ? (
        <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${verificationStyles[verificationTone]}`}>
          <p>{t(`verification.${verificationTone}Title`)}</p>
          {verification.isBlocked ? (
            <p className='mt-1 font-medium'>
              {t(`verification.${verificationTone}Description`, {
                reason: verification.rejectionReason || t('verification.noReason'),
              })}
            </p>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className='mt-6 space-y-4'>
        <div>
          <label htmlFor='fullName' className='mb-1 block text-sm font-medium text-slate-700'>
            {t('checkout.fullName')}
          </label>
          <input
            id='fullName'
            name='fullName'
            value={form.fullName}
            onChange={onInput}
            className='w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600'
            required
          />
        </div>

        <div>
          <label htmlFor='phone' className='mb-1 block text-sm font-medium text-slate-700'>
            {t('checkout.phone')}
          </label>
          <input
            id='phone'
            name='phone'
            value={form.phone}
            onChange={onInput}
            className='w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600'
            required
          />
        </div>

        <div>
          <label htmlFor='address' className='mb-1 block text-sm font-medium text-slate-700'>
            {t('checkout.address')}
          </label>
          {verification.requiresReview && addresses.length ? (
            <div className='mb-3'>
              <HandmadeSelect
                value={selectedAddressId}
                options={addressOptions}
                onChange={setSelectedAddressId}
                ariaLabel={t('checkout.savedAddress')}
              />
            </div>
          ) : null}
          {isAddressLoading ? (
            <p className='mb-2 text-xs font-bold text-blue-700'>{t('checkout.loadingAddresses')}</p>
          ) : null}
          <textarea
            id='address'
            name='address'
            rows='4'
            value={selectedAddress ? formatCompanyAddress(selectedAddress) : form.address}
            onChange={onInput}
            readOnly={Boolean(selectedAddress)}
            className='w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600'
            required
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-slate-700'>
            {t('checkout.payment')}
          </label>
          <HandmadeSelect
            value={form.payment}
            options={paymentOptions}
            onChange={nextPayment =>
              setForm(previous => ({
                ...previous,
                payment: nextPayment,
              }))
            }
            ariaLabel={t('checkout.payment')}
          />
        </div>

        <button
          type='submit'
          disabled={verification.isBlocked || isSubmitting}
          className='inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300'
        >
          {isSubmitting ? t('common.loading') : t('checkout.confirm')}
        </button>
      </form>
    </div>
  )
}

export default Checkout
