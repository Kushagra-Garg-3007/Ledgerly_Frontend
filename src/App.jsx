import { Navigate, Route, Routes } from 'react-router-dom'
import TopRouteLoader from './components/common/TopRouteLoader'
import AppLayout from './layouts/AppLayout'
import DashboardApiExample from './pages/DashboardApiExample'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

function App() {
  return (
    <>
      <TopRouteLoader />

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/ledger" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route element={<AppLayout />}>
          <Route
            path="/ledger"
            element={<DashboardApiExample />}
          />

          <Route
            path="/upload"
            element={<div>Upload Page</div>}
          />

          <Route
            path="/categories"
            element={<div>Categories Page</div>}
          />
        </Route>
      </Routes>
    </>
  )
}

export default App
