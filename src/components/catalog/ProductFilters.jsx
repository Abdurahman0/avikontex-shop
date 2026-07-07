import { useTranslation } from 'react-i18next'
import HandmadeSelect from '../common/HandmadeSelect'
import PropTypes from 'prop-types'

function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxAvailablePrice,
  priceRange,
  onPriceRangeChange,
}) {
  const { t, i18n } = useTranslation()

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='grid gap-4 lg:grid-cols-[1fr_1.2fr]'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-slate-700'>
            {t('catalog.categoryLabel')}
          </label>
          <HandmadeSelect
            value={selectedCategory}
            options={categories.map(category => ({
              value: category.key,
              label: category.label,
            }))}
            onChange={onCategoryChange}
            ariaLabel={t('catalog.categoryLabel')}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold text-slate-700'>
            {t('catalog.maxPrice')}:{' '}
            {priceRange.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ')} {t('common.currency')}
          </label>
          <input
            type='range'
            min={String(minPrice)}
            max={String(maxAvailablePrice)}
            step='100000'
            value={priceRange}
            onChange={event => onPriceRangeChange(Number(event.target.value))}
            className='w-full accent-blue-600'
          />
          <div className='mt-1 flex items-center justify-between text-xs text-slate-500'>
            <span>
              {minPrice.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ')} {t('common.currency')}
            </span>
            <span>
              {maxAvailablePrice.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ')}{' '}
              {t('common.currency')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

ProductFilters.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxAvailablePrice: PropTypes.number.isRequired,
  priceRange: PropTypes.number.isRequired,
  onPriceRangeChange: PropTypes.func.isRequired,
}

export default ProductFilters
