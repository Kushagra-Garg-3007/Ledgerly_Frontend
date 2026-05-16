import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTransaction, getTransactions } from '../api/transactionApi'
import { getCategories } from '../api/categoryApi'
import { getProfile, login } from '../api/authApi'
import { setAuthError, setAuthLoading, setUser } from '../redux/authSlice'
import { setCategories, setCategoryError, setCategoryLoading } from '../redux/categorySlice'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import Input from '../components/common/Input'
import SkeletonPage from '../components/skeletons/SkeletonPage'
import { errorToast, infoToast, successToast, warningToast } from '../utils/toast'

function DashboardApiExample() {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const categories = useSelector((state) => state.categories)

  const [email, setEmail] = useState('demo@ledgerly.com')
  const [password, setPassword] = useState('123456')
  const [fieldError, setFieldError] = useState('')

  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState('')
  const [creatingTx, setCreatingTx] = useState(false)
  const [pageBootLoading, setPageBootLoading] = useState(true)

  const handleLogin = async () => {
    if (!email || !password) {
      setFieldError('Email and password are required.')
      warningToast('Please fill email and password first.')
      return
    }

    setFieldError('')
    dispatch(setAuthLoading(true))
    dispatch(setAuthError(null))

    try {
      await login({ email, password })
      const profileData = await getProfile()
      dispatch(setUser(profileData?.data || profileData?.user || null))
      successToast('Login successful.')
    } catch (error) {
      dispatch(setAuthError(error.message))
      errorToast(`API failure: ${error.message}`)
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
      infoToast('Categories loaded.')
    } catch (error) {
      dispatch(setCategoryError(error.message))
      errorToast(error.message)
    } finally {
      dispatch(setCategoryLoading(false))
    }
  }

  const loadTransactions = async () => {
    setTxLoading(true)
    setTxError('')

    try {
      const txData = await getTransactions()
      setTransactions(txData?.data || txData?.transactions || [])
      infoToast('Transactions refreshed.')
    } catch (error) {
      setTxError(error.message)
      errorToast(error.message)
    } finally {
      setTxLoading(false)
    }
  }

  const handleCreateTransaction = async () => {
    setCreatingTx(true)

    try {
      await createTransaction({
        title: 'Sample Transaction',
        amount: 500,
        type: 'expense',
      })
      successToast('Transaction created successfully.')
      await loadTransactions()
    } catch (error) {
      errorToast(error.message)
    } finally {
      setCreatingTx(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const boot = async () => {
      await Promise.allSettled([loadCategories(), loadTransactions()])
      if (isMounted) {
        setTimeout(() => setPageBootLoading(false), 300)
      }
    }

    boot()

    return () => {
      isMounted = false
    }
  }, [])

  if (pageBootLoading) {
    return <SkeletonPage cards={3} rows={5} />
  }

  return (
    <div className="space-y-6">
      <Card title="Auth Actions" subtitle="Redux stores shared auth state only.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldError}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldError}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary" loading={auth.loading} onClick={handleLogin}>
            Login Example
          </Button>
          <Button variant="secondary" onClick={loadCategories} loading={categories.loading}>
            Load Categories
          </Button>
        </div>
      </Card>

      <Card title="Transactions" subtitle="Page-level local state for transactions.">
        <div className="mb-5 flex flex-wrap gap-3">
          <Button variant="outline" onClick={loadTransactions} loading={txLoading}>
            Refresh Transactions
          </Button>
          <Button variant="danger" onClick={handleCreateTransaction} loading={creatingTx}>
            Create Sample Transaction
          </Button>
        </div>

        {!txLoading && transactions.length === 0 && (
          <EmptyState
            icon="[Tx]"
            title="No transactions yet"
            description={txError || 'Create your first transaction to get started.'}
          />
        )}

        {!txLoading && transactions.length > 0 && (
          <ul className="space-y-2.5 text-sm text-[#5a4d46]">
            {transactions.map((item, index) => (
              <li key={item.id || index} className="rounded-md border border-[#dbcdbf] bg-[#f9f4ed] px-3.5 py-2.5 shadow-[0_2px_8px_rgba(40,28,20,0.06)]">
                {item.title || item.name || 'Transaction'}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

export default DashboardApiExample
