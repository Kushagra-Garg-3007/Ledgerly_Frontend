import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, login } from '../api/authApi'
import { getCategories } from '../api/categoryApi'
import { getTransactions } from '../api/transactionApi'
import {
  setAuthError,
  setAuthLoading,
  setUser,
} from '../redux/authSlice'
import {
  setCategories,
  setCategoryError,
  setCategoryLoading,
} from '../redux/categorySlice'

function DashboardApiExample() {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const categories = useSelector((state) => state.categories)

  // Local component state: transactions are page-level data, not global shared data.
  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState(null)

  // Demo form payload for login call.
  const [credentials] = useState({ email: 'demo@ledgerly.com', password: '123456' })

  const handleLogin = async () => {
    dispatch(setAuthLoading(true))
    dispatch(setAuthError(null))

    try {
      await login(credentials)
      const profileData = await getProfile()
      dispatch(setUser(profileData?.data || profileData?.user || null))
    } catch (error) {
      dispatch(setAuthError(error.message))
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  const loadCategories = async () => {
    dispatch(setCategoryLoading(true))
    dispatch(setCategoryError(null))

    try {
      const categoryData = await getCategories()
      dispatch(setCategories(categoryData?.data || categoryData?.categories || []))
    } catch (error) {
      dispatch(setCategoryError(error.message))
    } finally {
      dispatch(setCategoryLoading(false))
    }
  }

  const loadTransactions = async () => {
    setTxLoading(true)
    setTxError(null)

    try {
      const txData = await getTransactions()
      setTransactions(txData?.data || txData?.transactions || [])
    } catch (error) {
      setTxError(error.message)
    } finally {
      setTxLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
    loadTransactions()
  }, [])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">API + Redux Example</h2>

      <div className="flex flex-wrap gap-3">
        <button className="rounded bg-slate-900 text-white px-4 py-2 text-sm" onClick={handleLogin}>
          {auth.loading ? 'Signing in...' : 'Login + Load Profile'}
        </button>
        <button className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={loadCategories}>
          {categories.loading ? 'Refreshing...' : 'Refresh Categories'}
        </button>
        <button className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={loadTransactions}>
          {txLoading ? 'Refreshing...' : 'Refresh Transactions'}
        </button>
      </div>

      <div className="text-sm space-y-2">
        <p><strong>Auth Status:</strong> {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
        <p><strong>Auth Error:</strong> {auth.error || 'None'}</p>
        <p><strong>User:</strong> {auth.user ? JSON.stringify(auth.user) : 'Not loaded'}</p>
        <p><strong>Categories Count (Redux):</strong> {categories.items.length}</p>
        <p><strong>Category Error:</strong> {categories.error || 'None'}</p>
        <p><strong>Transactions Count (Local):</strong> {transactions.length}</p>
        <p><strong>Transactions Error:</strong> {txError || 'None'}</p>
      </div>
    </section>
  )
}

export default DashboardApiExample