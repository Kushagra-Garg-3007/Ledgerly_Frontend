import { useCallback, useEffect, useMemo, useState } from 'react'
import { getTransactions, getTransactionSummary } from '../api/transactionApi'
import { getCategories } from '../api/categoryApi'
import { errorToast, warningToast } from '../utils/toast'
import {
  normalizeTransaction,
  PAGE_SIZE,
  SORT_PRESETS
} from '../utils/transactionUtils'
import categoryColors from '../constants/categoryColors'
import { useDebounce } from './useDebounce'

const EMPTY_SUMMARY = {
  totalDebit: 0,
  totalCredit: 0,
  transactionCount: 0,
  balance: 0
}

const DEFAULT_FILTERS = {
  search: '',
  fromDate: '',
  toDate: '',
  type: 'all',
  category: 'all',
  sort: 'date_desc'
}

const extractList = (payload, fallbackKey) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.[fallbackKey])) return payload[fallbackKey]
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

const normalizeCategory = (item, index) => ({
  id: String(item?.id ?? item?.categoryId ?? `category-${index + 1}`),
  name:
    item?.name || item?.categoryName || item?.title || `Category ${index + 1}`,
  colorClassName: categoryColors[index % categoryColors.length].value
})

export function useLedgerData() {
  // ── Remote data ───────────────────────────────────────────────────────────
  const [entries, setEntries] = useState([])
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [summary, setSummary] = useState(EMPTY_SUMMARY)
  const [categories, setCategories] = useState([])

  // ── Loading / error ───────────────────────────────────────────────────────
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState('')
  const [summaryError, setSummaryError] = useState('')

  // ── UI state ──────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sortConfig, setSortConfig] = useState(SORT_PRESETS.date_desc)
  const [currentPage, setCurrentPage] = useState(1)

  const refreshCategories = useCallback(async () => {
    const res = await getCategories()
    const nextCategories = extractList(res, 'categories').map(normalizeCategory)
    setCategories(nextCategories)
    return nextCategories
  }, [])

  // ── Date range debounced so api waits for both dates to be set ────────────
  const dateRangeParams = useMemo(
    () => ({
      ...(filters.fromDate ? { fromDate: filters.fromDate } : {}),
      ...(filters.toDate ? { toDate: filters.toDate } : {})
    }),
    [filters.fromDate, filters.toDate]
  )

  const debouncedDateRangeParams = useDebounce(dateRangeParams, 800)

  // ── All params go to backend now ──────────────────────────────────────────
  const backendParams = useMemo(
    () => ({
      page: currentPage,
      limit: PAGE_SIZE,
      ...debouncedDateRangeParams,
      ...(filters.type !== 'all' ? { type: filters.type.toUpperCase() } : {}),
      ...(filters.category !== 'all' ? { categoryId: filters.category } : {}),
      sortBy: sortConfig.key,
      sortDirection: sortConfig.direction
    }),
    [
      currentPage,
      debouncedDateRangeParams,
      filters.type,
      filters.category,
      sortConfig
    ]
  )

  // ── Fetch categories (once on mount) ──────────────────────────────────────
  useEffect(() => {
    let alive = true
    refreshCategories()
      .then((nextCategories) => {
        if (!alive) return

        setCategories(nextCategories)
      })
      .catch((err) => {
        if (alive) {
          setCategories([])
          warningToast(err.message)
        }
      })
    return () => {
      alive = false
    }
  }, [refreshCategories])

  // ── Fetch transactions ────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true
    setTransactionsLoading(true)
    setTransactionsError('')

    getTransactions(backendParams)
      .then((res) => {
        if (!alive) return

        const list = res.data.map(normalizeTransaction)
        const total = res.totalItems
        const pages = Math.ceil(total / PAGE_SIZE) || 1

        if (currentPage > pages) {
          setCurrentPage(pages)
          return
        }

        setEntries(list)
        setTotalEntries(total)
        setTotalPages(pages)
      })
      .catch((err) => {
        if (!alive) return
        setEntries([])
        setTotalEntries(0)
        setTotalPages(1)
        setTransactionsError(err.message)
        errorToast(err.message)
      })
      .finally(() => {
        if (alive) setTransactionsLoading(false)
      })

    return () => {
      alive = false
    }
  }, [currentPage, backendParams])

  // ── Fetch summary ─────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true
    setSummaryLoading(true)
    setSummaryError('')

    getTransactionSummary(debouncedDateRangeParams)
      .then((res) => {
        if (alive) setSummary(res)
      })
      .catch((err) => {
        if (!alive) return
        setSummary(EMPTY_SUMMARY)
        setSummaryError(err.message)
        errorToast(err.message)
      })
      .finally(() => {
        if (alive) setSummaryLoading(false)
      })

    return () => {
      alive = false
    }
  }, [debouncedDateRangeParams])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilterChange = (field, value) => {
    if (field === 'sort')
      setSortConfig(SORT_PRESETS[value] || SORT_PRESETS.date_desc)
    setFilters((prev) => ({ ...prev, [field]: value }))
    setCurrentPage(1)
  }

  const handleTableSortChange = (key) => {
    const nextDirection =
      sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    const sortLabel = `${key}_${nextDirection}`
    setSortConfig({ key, direction: nextDirection })
    setFilters((prev) => ({
      ...prev,
      sort: SORT_PRESETS[sortLabel] ? sortLabel : 'date_desc'
    }))
    setCurrentPage(1)
  }

  // ── Optimistic helpers ────────────────────────────────────────────────────
  const applyEntryUpdate = (id, patch) =>
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    )

  const applyEntityCategoryUpdate = (entityId, patch) =>
    setEntries((prev) =>
      prev.map((e) => (e.entityId === entityId ? { ...e, ...patch } : e))
    )

  const addCategoryIfNew = (category) =>
    setCategories((prev) =>
      prev.some((item) => item.name === category)
        ? prev
        : [
            ...prev,
            {
              id: category,
              name: category,
              colorClassName:
                categoryColors[prev.length % categoryColors.length].value
            }
          ]
    )

  const categoryClassByName = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category.name, category.colorClassName])
      ),
    [categories]
  )

  return {
    entries,
    totalEntries,
    totalPages: Math.max(1, totalPages),
    currentPage,
    setCurrentPage,
    summary,
    categories,
    transactionsLoading,
    summaryLoading,
    transactionsError,
    summaryError,
    filters,
    sortConfig,
    categoryNames: categories.map((category) => category.name),
    categoryClassByName,
    handleFilterChange,
    handleTableSortChange,
    applyEntryUpdate,
    applyEntityCategoryUpdate,
    addCategoryIfNew,
    refreshCategories,
    latestBalance: entries[0]?.balance
  }
}
