import { fetchAnalysis } from "../api/analysisApi"

const apiEndPoint = {
  health: () => '/health',

  authLogin: () => '/auth/login',
  authSignup: () => '/auth/signup',
  authLogout: () => '/auth/logout',
  authRefresh: () => '/auth/refresh',
  authProfile: () => '/auth/profile',

  transactions: () => '/ledger/transactions',
  transactionSummary: () => '/ledger/summary',
  updateTransactionAnnotation: () => '/ledger/updateTransactionAnnotation',
  updateTransactionsByEntity: () => '/ledger/updateEntities',

  categories: () => '/categories',
  updateCategory: (categoryId) => `/categories/${categoryId}`,
  deleteCategory: (categoryId) => `/categories/${categoryId}`,
  createCategories: () => `/categories/create`,

  upload: () => '/uploads/statement',
  recentUploads: () => '/uploads/recent',

  fetchAnalysis: (fromDate, toDate) => `/analysis/?fromDate=${fromDate}&toDate=${toDate}`
}

export default apiEndPoint
