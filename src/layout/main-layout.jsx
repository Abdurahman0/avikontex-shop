import { Outlet, useLocation } from 'react-router-dom'
import EntryNoticeModal from '../components/common/EntryNoticeModal'
import SiteHeader from '../components/site/SiteHeader'
import SiteFooter from '../components/site/SiteFooter'

export const MainLayout = () => {
  const location = useLocation()
  const isAuthPage = ['/login', '/register', '/verify-otp'].includes(location.pathname)

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      {!isAuthPage ? <EntryNoticeModal /> : null}
      <SiteHeader />
      <main
        className={`mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-8 ${
          isAuthPage
            ? 'pb-8 lg:h-[calc(100vh-67px)] lg:overflow-hidden lg:py-6'
            : 'pb-12'
        }`}
      >
        <Outlet />
      </main>
      {!isAuthPage ? <SiteFooter /> : null}
    </div>
  )
}
