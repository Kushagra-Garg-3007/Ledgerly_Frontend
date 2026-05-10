import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoryLoading: (state, action) => {
      state.loading = action.payload
    },
    setCategories: (state, action) => {
      state.items = action.payload
      state.error = null
    },
    addCategory: (state, action) => {
      state.items.unshift(action.payload)
      state.error = null
    },
    setCategoryError: (state, action) => {
      state.error = action.payload
    },
    clearCategoryState: (state) => {
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setCategoryLoading,
  setCategories,
  addCategory,
  setCategoryError,
  clearCategoryState,
} = categorySlice.actions

export default categorySlice.reducer