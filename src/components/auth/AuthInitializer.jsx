import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../../api/authApi'
import { clearAuth, setAuthInitialized, setUser } from '../../redux/authSlice'

function AuthInitializer() {
  const dispatch = useDispatch()
  const { initialized } = useSelector((state) => state.auth)

  useEffect(() => {
    const onUnauthorized = () => dispatch(clearAuth())

    window.addEventListener('ledgerly:unauthorized', onUnauthorized)
    return () =>
      window.removeEventListener('ledgerly:unauthorized', onUnauthorized)
  }, [dispatch])

  useEffect(() => {
    if (initialized) return

    getProfile()
      .then((profileData) => {
        const userData = profileData?.data || profileData?.user || null

        if (userData) {
          dispatch(setUser(userData))
        }
      })
      .catch(() => {
        dispatch(clearAuth())
      })
      .finally(() => {
        dispatch(setAuthInitialized(true))
      })
  }, [dispatch, initialized])

  return null
}

export default AuthInitializer
