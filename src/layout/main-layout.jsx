import { Outlet } from 'react-router-dom'
import EntryNoticeModal from '../components/common/EntryNoticeModal'
import SiteHeader from '../components/site/SiteHeader'
import SiteFooter from '../components/site/SiteFooter'

export const MainLayout = () => {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <EntryNoticeModal />
      <SiteHeader />
      <main className='mx-auto w-full max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
