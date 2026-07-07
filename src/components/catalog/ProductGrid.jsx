import PropTypes from 'prop-types'
import ProductCard from './ProductCard'
import { productPropType } from '../../propTypes/product'

function ProductGrid({ products }) {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(productPropType).isRequired,
}

export default ProductGrid
