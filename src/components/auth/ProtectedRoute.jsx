import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute() {
  const location = useLocation()
  const { initialized, isAuthenticated } = useSelector((state) => state.auth)

  if (!initialized) return null

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
