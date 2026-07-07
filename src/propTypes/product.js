import PropTypes from 'prop-types'

export const productPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string,
  full_name: PropTypes.string,
  description: PropTypes.string,
  group: PropTypes.string,
  segment: PropTypes.string,
  manufacturer: PropTypes.string,
  country: PropTypes.string,
  unit: PropTypes.string,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  stock: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
})
