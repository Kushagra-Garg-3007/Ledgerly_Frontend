import { Route, Routes } from 'react-router-dom'
import TopRouteLoader from './components/common/TopRouteLoader'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import SignupPage from './pages/auth/SignupPage'
import CategoriesPage from './pages/CategoriesPage'

function App() {
  return (
    <>
      <TopRouteLoader />

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

          <Route
            path="/ledger"
            element={<div>Ledger Page</div>}
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
      </Routes>
    </>
  )
}

export default App
