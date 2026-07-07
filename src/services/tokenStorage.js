const ACCESS_TOKEN_KEY = 'avikontex-access-token'
const REFRESH_TOKEN_KEY = 'avikontex-refresh-token'

export const tokenStorage = {
  getAccess() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefresh() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  set({ access, refresh }) {
    if (access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access)
    }
    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    }
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
