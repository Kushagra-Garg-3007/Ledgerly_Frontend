import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload
    },
    setAuthInitialized: (state, action) => {
      state.initialized = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = Boolean(action.payload)
      state.error = null
    },
    setAuthError: (state, action) => {
      state.error = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.initialized = true
      state.error = null
    }
  }
})

export const {
  setAuthLoading,
  setAuthInitialized,
  setUser,
  setAuthError,
  clearAuth
} = authSlice.actions
export default authSlice.reducer
