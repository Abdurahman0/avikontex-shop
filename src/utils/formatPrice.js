export const formatPrice = (value, language = 'uz') => {
  const locale =
    language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ'

  return new Intl.NumberFormat(locale).format(value)
}
