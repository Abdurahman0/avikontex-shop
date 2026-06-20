import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiOutlineArrowUpRight, HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2'

const quickLinks = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/products', labelKey: 'nav.catalog' },
  { to: '/orders', labelKey: 'nav.orders' },
  { to: '/wishes', labelKey: 'nav.wishlist' },
]

const customerLinks = [
  { to: '/faq', labelKey: 'nav.faq' },
  { to: '/contact', labelKey: 'nav.contact' },
  { to: '/cart', labelKey: 'nav.cart' },
]

function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className='mt-12 border-t border-slate-200 bg-gradient-to-b from-white to-slate-100/70'>
      <div className='mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8'>
        <div className='grid gap-8 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr_1fr]'>
          <div className='space-y-3'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-blue-700'>
              {t('brand.name')}
            </p>
            <p className='max-w-md text-2xl font-bold leading-tight text-slate-900'>{t('footer.title')}</p>
            <p className='max-w-md text-sm leading-6 text-slate-600'>{t('footer.description')}</p>
          </div>

          <div>
            <p className='text-sm font-semibold uppercase tracking-wide text-slate-900'>
              {t('footer.quickLinks')}
            </p>
            <ul className='mt-3 space-y-2 text-sm text-slate-600'>
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className='inline-flex items-center gap-1.5 transition hover:text-blue-700'
                  >
                    <span>{t(link.labelKey)}</span>
                    <HiOutlineArrowUpRight className='text-xs' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className='text-sm font-semibold uppercase tracking-wide text-slate-900'>
              {t('footer.customerCare')}
            </p>
            <ul className='mt-3 space-y-2 text-sm text-slate-600'>
              {customerLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className='inline-flex items-center gap-1.5 transition hover:text-blue-700'
                  >
                    <span>{t(link.labelKey)}</span>
                    <HiOutlineArrowUpRight className='text-xs' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className='text-sm font-semibold uppercase tracking-wide text-slate-900'>
              {t('footer.contactUs')}
            </p>
            <ul className='mt-3 space-y-3 text-sm text-slate-600'>
              <li className='flex items-start gap-2'>
                <HiOutlinePhone className='mt-0.5 text-base text-blue-700' />
                <a href='tel:+998900000001' className='transition hover:text-blue-700'>
                  +998 90 000 00 01
                </a>
              </li>
              <li className='flex items-start gap-2'>
                <HiOutlineEnvelope className='mt-0.5 text-base text-blue-700' />
                <a href='mailto:info@avikontex.uz' className='transition hover:text-blue-700'>
                  info@avikontex.uz
                </a>
              </li>
              <li className='flex items-start gap-2'>
                <HiOutlineMapPin className='mt-0.5 text-base text-blue-700' />
                <span>{t('contact.addressValue')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex sm:items-center sm:justify-between'>
          <p>
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
          </p>
          <p className='mt-2 sm:mt-0'>{t('footer.bottomNote')}</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
