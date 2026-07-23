import { tokenStorage } from './tokenStorage'

const DEFAULT_API_URL =
  'https://463c-178-218-201-75.ngrok-free.app'
const DEVICE_ID_KEY = 'avikontex-device-id'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL).replace(
  /\/$/,
  ''
)

let refreshPromise = null

export function getDeviceId() {
  if (typeof window === 'undefined') {
    return ''
  }

  const existingDeviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (existingDeviceId) {
    return existingDeviceId
  }

  const nextDeviceId =
    window.crypto?.randomUUID?.() ||
    `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  localStorage.setItem(DEVICE_ID_KEY, nextDeviceId)
  return nextDeviceId
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.fieldErrors = getFieldErrors(data)
  }
}

export function unwrapPayload(payload) {
  if (payload && typeof payload === 'object' && payload.data !== undefined) {
    return payload.data
  }
  return payload
}

function getFieldErrors(data) {
  const payload = unwrapPayload(data)
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(payload)
      .filter(([key, value]) =>
        !['detail', 'message', 'error', 'status', 'code'].includes(key) &&
        (typeof value === 'string' || Array.isArray(value))
      )
      .map(([key, value]) => [key, Array.isArray(value) ? String(value[0]) : value])
  )
}

function getErrorMessage(data, fallback) {
  const payload = unwrapPayload(data)
  if (typeof payload === 'string') {
    return payload
  }
  if (payload && typeof payload === 'object') {
    return payload.detail || payload.message || payload.error || fallback
  }
  return fallback
}

function isApplicationError(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return false
  }

  const status = String(payload.status || '').toLowerCase()
  if (['error', 'failed', 'failure'].includes(status) || payload.success === false) {
    return true
  }

  const values = Object.values(payload)
  return (
    values.length > 0 &&
    values.every(value => Array.isArray(value) && value.every(item => typeof item === 'string'))
  )
}

function getHeaders(headers, body, accessToken) {
  const nextHeaders = new Headers(headers)
  nextHeaders.set('Accept', 'application/json')

  if (body && !(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }
  if (accessToken) {
    nextHeaders.set('Authorization', `Bearer ${accessToken}`)
  }
  const deviceId = getDeviceId()
  if (deviceId) {
    nextHeaders.set('X-Device-Id', deviceId)
  }
  if (API_BASE_URL.includes('ngrok')) {
    nextHeaders.set('ngrok-skip-browser-warning', 'true')
  }

  return nextHeaders
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function extractTokens(payload) {
  const data = unwrapPayload(payload) || {}
  const tokens = data.tokens || data.token || data
  return {
    access: tokens.access || tokens.access_token || null,
    refresh: tokens.refresh || tokens.refresh_token || null,
  }
}

async function refreshAccessToken() {
  const refresh = tokenStorage.getRefresh()
  if (!refresh) {
    return null
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: getHeaders(undefined, true),
      body: JSON.stringify({ refresh }),
    })
      .then(async response => {
        const payload = await parseResponse(response)
        if (!response.ok || isApplicationError(payload)) {
          throw new ApiError(
            getErrorMessage(payload, 'Session refresh failed'),
            response.ok ? 401 : response.status,
            payload
          )
        }

        const tokens = extractTokens(payload)
        if (!tokens.access) {
          throw new ApiError('Session refresh returned no access token', response.status, payload)
        }
        tokenStorage.set({ access: tokens.access, refresh: tokens.refresh || refresh })
        return tokens.access
      })
      .catch(error => {
        tokenStorage.clear()
        window.dispatchEvent(new Event('avikontex:auth-expired'))
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export async function apiRequest(path, options = {}, allowRefresh = true) {
  const { skipAuth = false, ...fetchOptions } = options
  const body =
    options.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body
  const accessToken = skipAuth ? null : tokenStorage.getAccess()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    body,
    headers: getHeaders(options.headers, body, accessToken),
  })

  if (response.status === 401 && !skipAuth && allowRefresh && tokenStorage.getRefresh()) {
    await refreshAccessToken()
    return apiRequest(path, options, false)
  }

  const payload = await parseResponse(response)
  if (!response.ok || isApplicationError(payload)) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed (${response.status})`),
      response.ok ? 400 : response.status,
      payload
    )
  }

  return payload
}

export function extractAuthSession(payload) {
  const data = unwrapPayload(payload) || {}
  const tokens = extractTokens(data)

  return {
    ...tokens,
    user: data.user || data.profile || null,
  }
}
