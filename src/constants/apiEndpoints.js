const apiEndPoint = {
  health: () => '/health',

  authLogin: () => '/auth/login',
  authSignup: () => '/auth/signup',
  authLogout: () => '/auth/logout',
  authRefresh: () => '/auth/refresh',
  authProfile: () => '/auth/profile',

  users: () => '/users',
  userById: (userId) => `/users/${userId}`,

  transactions: () => '/transactions',
  transactionById: (transactionId) =>
    `/transactions/${transactionId}`,

  categories: () => '/categories',
  categoryById: (categoryId) =>
    `/categories/${categoryId}`,

  ledgers: () => '/ledgers',
  ledgerById: (ledgerId) => `/ledgers/${ledgerId}`,

  upload: () => '/uploads/statement',
  recentUploads: () => '/uploads/recent',
  uploadById: (uploadId) => `/uploads/${uploadId}`,
  retryUploadById: (uploadId) => `/uploads/${uploadId}/retry`,
}

export default apiEndPoint
