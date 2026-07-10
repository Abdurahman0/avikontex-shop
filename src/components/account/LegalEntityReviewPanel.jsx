import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import {
  HiOutlineArrowPath,
  HiOutlineBuildingOffice2,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentArrowUp,
  HiOutlineExclamationTriangle,
  HiOutlineMapPin,
} from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import HandmadeSelect from '../common/HandmadeSelect'
import { companyService } from '../../services/companyService'
import { getVerificationTone } from '../../utils/clientVerification'

const toneStyles = {
  pending: {
    shell: 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white',
    badge: 'bg-amber-100 text-amber-800',
    icon: 'bg-amber-100 text-amber-700',
  },
  verified: {
    shell: 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white',
    badge: 'bg-emerald-100 text-emerald-800',
    icon: 'bg-emerald-100 text-emerald-700',
  },
  rejected: {
    shell: 'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-white',
    badge: 'bg-rose-100 text-rose-800',
    icon: 'bg-rose-100 text-rose-700',
  },
}

function formatAddress(address) {
  return [address.region_name, address.district_name, address.street, address.house, address.apartment]
    .filter(Boolean)
    .join(', ')
}

export default function LegalEntityReviewPanel({ verification }) {
  const { t } = useTranslation()
  const tone = getVerificationTone(verification.status)
  const styles = toneStyles[tone] || toneStyles.pending
  const [companies, setCompanies] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [documents, setDocuments] = useState([])
  const [addresses, setAddresses] = useState([])
  const [documentType, setDocumentType] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [isUploading, setIsUploading] = useState(false)

  const company = companies[0] || null

  useEffect(() => {
    let active = true
    setStatus('loading')
    Promise.all([companyService.getCompanies(), companyService.getDocumentTypes()])
      .then(async ([nextCompanies, nextDocumentTypes]) => {
        if (!active) return
        const nextCompany = nextCompanies[0] || null
        setCompanies(nextCompanies)
        setDocumentTypes(nextDocumentTypes)
        setDocumentType(nextDocumentTypes[0]?.id || '')

        if (nextCompany?.id) {
          const [nextDocuments, nextAddresses] = await Promise.all([
            companyService.getDocuments(nextCompany.id),
            companyService.getAddresses(nextCompany.id),
          ])
          if (!active) return
          setDocuments(nextDocuments)
          setAddresses(nextAddresses)
        }
        if (active) setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const documentTypeOptions = useMemo(
    () =>
      documentTypes.map(item => ({
        value: item.id,
        label: `${item.label}${item.is_required ? ` ${t('verification.documents.required')}` : ''}`,
      })),
    [documentTypes, t]
  )

  const companyRows = useMemo(() => {
    if (!company) return []
    return [
      ['legalName', company.legal_name || company.name || company.company_name],
      ['inn', company.inn],
      ['type', company.company_type_display || company.company_type],
      ['bank', company.bank],
      ['mfo', company.mfo],
    ].filter(([, value]) => value)
  }, [company])

  const defaultAddress = useMemo(
    () => addresses.find(address => address.is_default) || addresses[0] || null,
    [addresses]
  )

  const upload = async event => {
    event.preventDefault()
    if (!company?.id || !documentType || !file) return

    setIsUploading(true)
    try {
      await companyService.uploadDocument(company.id, { documentType, file })
      setDocuments(await companyService.getDocuments(company.id))
      setFile(null)
      event.currentTarget.reset()
      toast.success(t('verification.documents.uploadSuccess'))
    } catch {
      toast.error(t('verification.documents.uploadError'))
    } finally {
      setIsUploading(false)
    }
  }

  const steps = [
    'registered',
    'documents',
    tone === 'verified' ? 'approved' : tone === 'rejected' ? 'rejected' : 'operator',
    'order',
  ]

  return (
    <section className={`overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-6 ${styles.shell}`}>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='max-w-2xl'>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${styles.badge}`}>
            {t(`verification.status.${tone}`)}
          </span>
          <h2 className='mt-3 text-2xl font-black tracking-tight text-slate-950'>
            {t('verification.legalReviewTitle')}
          </h2>
          <p className='mt-2 text-sm leading-6 text-slate-600'>
            {verification.isBlocked
              ? t(`verification.${tone}Description`, {
                  reason: verification.rejectionReason || t('verification.noReason'),
                })
              : t(`verification.${tone}Description`)}
          </p>
        </div>
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}>
          {tone === 'verified' ? (
            <HiOutlineCheckCircle className='text-3xl' />
          ) : tone === 'rejected' ? (
            <HiOutlineExclamationTriangle className='text-3xl' />
          ) : (
            <HiOutlineClock className='text-3xl' />
          )}
        </span>
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-4'>
        {steps.map((step, index) => (
          <article key={step} className='rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm'>
            <span className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-black text-white'>
              {index + 1}
            </span>
            <p className='mt-3 text-sm font-black text-slate-900'>
              {t(`verification.steps.${step}`)}
            </p>
          </article>
        ))}
      </div>

      <div className='mt-6 grid gap-4 xl:grid-cols-[0.95fr_1fr_0.85fr]'>
        <article className='rounded-2xl border border-slate-200 bg-white p-4'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2'>
              <HiOutlineBuildingOffice2 className='text-xl text-blue-700' />
              <h3 className='font-black text-slate-950'>{t('verification.company.title')}</h3>
            </div>
            {status === 'loading' ? <HiOutlineArrowPath className='animate-spin text-xl text-blue-700' /> : null}
          </div>

          {companyRows.length ? (
            <div className='mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1'>
              {companyRows.map(([key, value]) => (
                <div key={key} className='rounded-xl bg-slate-50 px-3 py-2'>
                  <p className='text-[11px] font-black uppercase tracking-[0.12em] text-slate-400'>
                    {t(`verification.company.${key}`)}
                  </p>
                  <p className='mt-1 text-sm font-bold text-slate-900'>{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='mt-4 rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500'>
              {status === 'error' ? t('verification.company.loadError') : t('verification.documents.noCompany')}
            </p>
          )}

          {defaultAddress ? (
            <div className='mt-3 flex gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-sm text-slate-700'>
              <HiOutlineMapPin className='mt-0.5 shrink-0 text-lg text-blue-700' />
              <span>
                <span className='font-black text-slate-900'>
                  {defaultAddress.label || t('verification.company.defaultAddress')}
                </span>
                <span className='mt-1 block'>{formatAddress(defaultAddress)}</span>
              </span>
            </div>
          ) : null}
        </article>

        <article className='rounded-2xl border border-slate-200 bg-white p-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h3 className='font-black text-slate-950'>{t('verification.documents.title')}</h3>
              <p className='mt-1 text-sm text-slate-500'>{t('verification.documents.description')}</p>
            </div>
            {status === 'loading' ? <HiOutlineArrowPath className='animate-spin text-xl text-blue-700' /> : null}
          </div>

          {documents.length ? (
            <div className='mt-4 space-y-2'>
              {documents.map(document => (
                <a
                  key={document.id || document.file}
                  href={document.file}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700'
                >
                  <span>{document.document_type_label || t('verification.documents.file')}</span>
                  <span className='text-xs text-slate-400'>{t('verification.documents.open')}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className='mt-4 rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500'>
              {company?.id ? t('verification.documents.empty') : t('verification.documents.noCompany')}
            </p>
          )}
        </article>

        <form onSubmit={upload} className='rounded-2xl border border-slate-200 bg-white p-4'>
          <h3 className='font-black text-slate-950'>{t('verification.documents.uploadTitle')}</h3>
          <div className='mt-4 space-y-3'>
            <HandmadeSelect
              value={documentType}
              options={documentTypeOptions}
              onChange={setDocumentType}
              ariaLabel={t('verification.documents.documentType')}
            />
            <label className='flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50'>
              <HiOutlineDocumentArrowUp className='text-3xl text-blue-700' />
              <span className='mt-2 text-sm font-black text-slate-900'>
                {file?.name || t('verification.documents.chooseFile')}
              </span>
              <input
                type='file'
                className='sr-only'
                onChange={event => setFile(event.target.files?.[0] || null)}
              />
            </label>
            <button
              type='submit'
              disabled={!company?.id || !documentType || !file || isUploading}
              className='inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300'
            >
              {isUploading ? t('verification.documents.uploading') : t('verification.documents.upload')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

LegalEntityReviewPanel.propTypes = {
  verification: PropTypes.shape({
    status: PropTypes.string,
    isBlocked: PropTypes.bool.isRequired,
    rejectionReason: PropTypes.string,
  }).isRequired,
}
