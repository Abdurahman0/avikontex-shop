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
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import Account from './pages/Account'
import RequireAuth from './components/auth/RequireAuth'
import AuthBootstrap from './components/auth/AuthBootstrap'

function App() {
  return (
    <>
      <AuthBootstrap />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Main />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:slug' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/wishes' element={<Wishes />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/about' element={<About />} />
          <Route path='/faq' element={<Faq />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/account' element={<RequireAuth><Account /></RequireAuth>} />
          <Route path='/orders' element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path='/checkout' element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path='/track-order/:orderId' element={<TrackOrder />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
