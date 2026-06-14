import Axios from 'axios'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

let refreshPromise = null

const isRefreshRequest = (config) =>
  (config?.url || '').startsWith('/auth/refresh')

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status
    const originalRequest = error?.config

    if (!originalRequest || status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry || isRefreshRequest(originalRequest)) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ledgerly:unauthorized'))
      }

      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post('/auth/refresh')
      }

      await refreshPromise
      refreshPromise = null

      return axios(originalRequest)
    } catch (refreshError) {
      refreshPromise = null

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ledgerly:unauthorized'))
      }

      return Promise.reject(refreshError)
    }
  }
)

export default axios
