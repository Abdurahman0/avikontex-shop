export function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('998')) return `+${digits.slice(0, 12)}`
  if (digits.length <= 9) return `+998${digits}`
  return `+${digits}`
}

export function digitsOnly(value, maxLength) {
  return String(value || '')
    .replace(/\D/g, '')
    .slice(0, maxLength)
}

export function omitEmptyValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  )
}

export function getSafeReturnPath(value, fallback = '/account') {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : fallback
}
