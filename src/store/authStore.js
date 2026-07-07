import { create } from 'zustand'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/tokenStorage'

async function completeAuthentication(session) {
  if (!session.access || !session.refresh) {
    throw new Error('Authentication response did not include JWT tokens')
  }

  tokenStorage.set(session)
  return session.user || authService.getMe()
}

export const useAuthStore = create((set, get) => ({
  user: null,
  status: 'idle',

  initialize: async () => {
    if (get().status !== 'idle') {
      return
    }
    if (!tokenStorage.getAccess() && !tokenStorage.getRefresh()) {
      set({ status: 'anonymous', user: null })
      return
    }

    set({ status: 'loading' })
    try {
      const user = await authService.getMe()
      set({ user, status: 'authenticated' })
    } catch {
      tokenStorage.clear()
      set({ user: null, status: 'anonymous' })
    }
  },

  login: async credentials => {
    const user = await completeAuthentication(await authService.login(credentials))
    set({ user, status: 'authenticated' })
    return user
  },

  verifyOtp: async data => {
    const user = await completeAuthentication(await authService.verifyOtp(data))
    set({ user, status: 'authenticated' })
    return user
  },

  logout: () => {
    tokenStorage.clear()
    set({ user: null, status: 'anonymous' })
  },
}))

if (typeof window !== 'undefined') {
  window.addEventListener('avikontex:auth-expired', () => {
    useAuthStore.setState({ user: null, status: 'anonymous' })
  })
}
