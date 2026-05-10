const apiEndPoint = {
  health: () => '/health',

  authLogin: () => '/auth/login',
  authSignup: () => '/auth/signup',
  authLogout: () => '/auth/logout',
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
}

export default apiEndPoint