import { apiRequest, extractAuthSession, unwrapPayload } from './apiClient'

export const authService = {
  async login(credentials) {
    return extractAuthSession(
      await apiRequest('/api/auth/login/', { method: 'POST', body: credentials }, false)
    )
  },

  registerPerson(data) {
    return apiRequest('/api/auth/register/', { method: 'POST', body: data }, false)
  },

  registerCompany(data) {
    return apiRequest('/api/auth/register/company/', { method: 'POST', body: data }, false)
  },

  async verifyOtp(data) {
    return extractAuthSession(
      await apiRequest('/api/auth/verify-otp/', { method: 'POST', body: data }, false)
    )
  },

  resendOtp(phone) {
    return apiRequest('/api/auth/resend-otp/', { method: 'POST', body: { phone } }, false)
  },

  async getMe() {
    const payload = unwrapPayload(await apiRequest('/api/auth/me/'))
    return payload?.user || payload
  },
}
