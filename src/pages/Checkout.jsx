import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import HandmadeSelect from '../components/common/HandmadeSelect'
import { useShopStore } from '../store/shopStore'
import { useAuthStore } from '../store/authStore'

const initialForm = {
  fullName: '',
  phone: '+998',
  address: '',
  payment: 'cash_on_delivery',
}

function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const cartCount = useShopStore(state => Object.keys(state.cart).length)
  const shopStatus = useShopStore(state => state.status)
  const placeOrder = useShopStore(state => state.placeOrder)
  const [form, setForm] = useState(initialForm)

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

  useEffect(() => {
    if (shopStatus === 'idle' || shopStatus === 'loading') {
      return
    }
    if (!cartCount) {
      navigate('/cart')
    }
  }, [cartCount, navigate, shopStatus])

  const onInput = event => {
    setForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = async event => {
    event.preventDefault()

    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error(t('checkout.validationError'))
      return
    }

    const orderId = await placeOrder(form)

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
          <textarea
            id='address'
            name='address'
            rows='4'
            value={form.address}
            onChange={onInput}
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
          className='inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800'
        >
          {t('checkout.confirm')}
        </button>
      </form>
    </div>
  )
}

export default Checkout
