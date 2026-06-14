import { Route, Routes } from 'react-router-dom'
import TopRouteLoader from './components/common/TopRouteLoader'
import AuthInitializer from './components/auth/AuthInitializer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import SignupPage from './pages/auth/SignupPage'
import CategoriesPage from './pages/CategoriesPage'
import ProfilePage from './pages/ProfilePage'
import LedgerPage from './pages/LedgerPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'


function App() {
  return (
    <>
      <TopRouteLoader />
      <AuthInitializer />

      <Routes>
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
            path="/"
            element={<LandingPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/ledger"
              element={<LedgerPage />}
            />

            <Route
              path="/analysis"
              element={<AnalyticsPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/upload"
              element={<UploadPage />}
            />

            <Route
              path="/categories"
              element={<CategoriesPage />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
