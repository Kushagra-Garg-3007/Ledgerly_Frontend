export const persistAuthToken = (payload) => {
  const token =
    payload?.token ||
    payload?.data?.token ||
    payload?.accessToken ||
    payload?.data?.accessToken

  if (token) {
    localStorage.setItem('ledgerly_token', token)
  }
}