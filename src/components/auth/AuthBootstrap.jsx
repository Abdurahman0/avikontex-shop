import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useShopStore } from '../../store/shopStore'

export default function AuthBootstrap() {
  const initialize = useAuthStore(state => state.initialize)
  const authStatus = useAuthStore(state => state.status)
  const syncRemote = useShopStore(state => state.syncRemote)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (authStatus === 'anonymous' || authStatus === 'authenticated') {
      syncRemote()
    }
  }, [authStatus, syncRemote])

  return null
}
