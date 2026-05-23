import { Route, Routes } from 'react-router-dom'
import { MainLayout } from './layout/main-layout'
import Main from './pages/Main'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishes from './pages/Wishes'
import About from './pages/About'
import Orders from './pages/Orders'
import Faq from './pages/Faq'
import Contact from './pages/contact'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<Main />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:slug' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishes' element={<Wishes />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/about' element={<About />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/track-order/:orderId' element={<TrackOrder />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
