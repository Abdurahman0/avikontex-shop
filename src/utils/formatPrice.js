export const formatPrice = (value, language = 'uz') => {
  const locale =
    language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ'
  const numericValue = Number(value)
  const hasFraction = Number.isFinite(numericValue) && !Number.isInteger(numericValue)

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(numericValue)
}
