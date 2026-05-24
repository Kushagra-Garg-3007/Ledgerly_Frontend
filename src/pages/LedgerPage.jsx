import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { createTransaction, getTransactions, updateTransaction } from '../api/transactionApi'
import { getCategories } from '../api/categoryApi'
import Button from '../components/common/Button'
import LedgerTable from '../components/shared/LedgerTable'
import LedgerSummaryCards from '../components/ledger/LedgerSummaryCards'
import LedgerFilters from '../components/ledger/LedgerFilters'
import LedgerRowActions from '../components/ledger/LedgerRowActions'
import LedgerEntryModal from '../components/ledger/LedgerEntryModal'
import LedgerDetailsModal from '../components/ledger/LedgerDetailsModal'
import sampleTransactions from '../constants/sampleTransactions'
import { errorToast, infoToast, successToast, warningToast } from '../utils/toast'

const PAGE_SIZE = 8

const sortPresets = {
  date_desc: { key: 'date', direction: 'desc' },
  date_asc: { key: 'date', direction: 'asc' },
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseDateValue(value) {
  if (!value) return null

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  const asDate = new Date(value)
  if (!Number.isNaN(asDate.getTime())) {
    return asDate
  }

  if (typeof value === 'string') {
    const match = value.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/)
    if (match) {
      const [, day, month, year] = match
      const parsed = new Date(`${day} ${month} 20${year}`)
      if (!Number.isNaN(parsed.getTime())) {
        return parsed
      }
    }
  }

  return null
}

function formatDisplayDate(value) {
  const parsed = parseDateValue(value)

  if (!parsed) return value || '—'

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function normalizeTransaction(item, index = 0) {
  const parsedDate = parseDateValue(
    item?.date ||
    item?.transactionDate ||
    item?.createdAt ||
    item?.valueDate,
  )

  const debitValue = toNumber(
    item?.withdrawAmount ??
    item?.debitAmount ??
    item?.debit ??
    item?.amountDebited,
  )

  const creditValue = toNumber(
    item?.creditAmount ??
    item?.credit ??
    item?.amountCredited,
  )

  const transactionType = item?.type || (creditValue > 0 ? 'credit' : 'debit')

  return {
    id: item?.id ?? item?.transactionId ?? `txn-${index + 1}`,
    date: formatDisplayDate(parsedDate || item?.date),
    dateValue: parsedDate ? parsedDate.getTime() : 0,
    description:
      item?.description ||
      item?.notes ||
      item?.narration ||
      item?.title ||
      'Untitled transaction',
    category: item?.category || item?.categoryName || 'Uncategorized',
    notes: item?.notes || item?.description || '',
    type: transactionType,
    withdrawAmount: debitValue > 0 ? debitValue : '',
    creditAmount: creditValue > 0 ? creditValue : '',
    balance: item?.balance ?? item?.runningBalance ?? '',
  }
}

function extractTransactionList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.transactions)) return payload.transactions
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

function extractCategories(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.categories || payload?.items || []

  if (!Array.isArray(list)) return []

  return list
    .map((item) => item?.name || item?.categoryName || item?.title || '')
    .filter(Boolean)
}

function getComparableValue(entry, key) {
  if (key === 'date') return entry.dateValue || 0
  if (key === 'withdrawAmount') return toNumber(entry.withdrawAmount)
  if (key === 'creditAmount') return toNumber(entry.creditAmount)
  if (key === 'balance') return toNumber(entry.balance)
  return String(entry[key] || '').toLowerCase()
}

function LedgerPage() {
  const [entries, setEntries] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: '',
    fromDate: '',
    toDate: '',
    type: 'all',
    category: 'all',
    sort: 'date_desc',
  })

  const [sortConfig, setSortConfig] = useState(sortPresets.date_desc)
  const [currentPage, setCurrentPage] = useState(1)

  const [entryModalOpen, setEntryModalOpen] = useState(false)
  const [entryModalMode, setEntryModalMode] = useState('add')
  const [activeEntryId, setActiveEntryId] = useState(null)
  const [entryForm, setEntryForm] = useState({ category: '', notes: '' })
  const [entryErrors, setEntryErrors] = useState({ category: '', notes: '' })
  const [entrySubmitting, setEntrySubmitting] = useState(false)
  const [entrySubmitError, setEntrySubmitError] = useState('')

  const [detailsEntry, setDetailsEntry] = useState(null)

  useEffect(() => {
    let alive = true

    const loadLedgerData = async () => {
      setLoading(true)

      try {
        const [transactionsResponse, categoriesResponse] = await Promise.all([
          getTransactions(),
          getCategories().catch(() => []),
        ])

        const normalizedEntries = extractTransactionList(transactionsResponse)
          .map((item, index) => normalizeTransaction(item, index))

        const hasBackendEntries = normalizedEntries.length > 0
        const fallbackEntries = sampleTransactions.map((item, index) => (
          normalizeTransaction(item, index)
        ))

        const finalEntries = hasBackendEntries ? normalizedEntries : fallbackEntries

        if (!hasBackendEntries) {
          infoToast('No ledger entries returned. Showing sample data.')
        }

        const categoryOptions = extractCategories(categoriesResponse)
        const categoriesFromEntries = finalEntries.map((entry) => entry.category)
        const mergedCategories = Array.from(
          new Set([...categoryOptions, ...categoriesFromEntries]),
        )

        if (!alive) return

        setEntries(finalEntries)
        setCategories(mergedCategories)
      } catch (error) {
        if (!alive) return

        const fallbackEntries = sampleTransactions.map((item, index) => (
          normalizeTransaction(item, index)
        ))

        setEntries(fallbackEntries)
        setCategories(Array.from(new Set(fallbackEntries.map((item) => item.category))))
        infoToast('Backend unavailable. Showing sample ledger data.')
        errorToast(error.message)
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadLedgerData()

    return () => {
      alive = false
    }
  }, [])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const searchValue = filters.search.trim().toLowerCase()

      if (searchValue) {
        const haystack = `${entry.description} ${entry.notes} ${entry.category} ${entry.type}`.toLowerCase()
        if (!haystack.includes(searchValue)) {
          return false
        }
      }

      if (filters.type !== 'all' && entry.type !== filters.type) {
        return false
      }

      if (filters.category !== 'all' && entry.category !== filters.category) {
        return false
      }

      if (filters.fromDate) {
        const fromDateValue = new Date(filters.fromDate).setHours(0, 0, 0, 0)
        if ((entry.dateValue || 0) < fromDateValue) {
          return false
        }
      }

      if (filters.toDate) {
        const toDateValue = new Date(filters.toDate).setHours(23, 59, 59, 999)
        if ((entry.dateValue || 0) > toDateValue) {
          return false
        }
      }

      return true
    })
  }, [entries, filters])

  const sortedEntries = useMemo(() => {
    const sorted = [...filteredEntries].sort((left, right) => {
      const leftValue = getComparableValue(left, sortConfig.key)
      const rightValue = getComparableValue(right, sortConfig.key)

      if (leftValue < rightValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (leftValue > rightValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [filteredEntries, sortConfig])

  const summary = useMemo(() => {
    const totalCredit = filteredEntries.reduce(
      (sum, entry) => sum + toNumber(entry.creditAmount),
      0,
    )

    const totalDebit = filteredEntries.reduce(
      (sum, entry) => sum + toNumber(entry.withdrawAmount),
      0,
    )

    const latestEntry = filteredEntries.reduce((latest, entry) => {
      if (!latest) return entry
      return (entry.dateValue || 0) > (latest.dateValue || 0) ? entry : latest
    }, null)

    return {
      totalCredit,
      totalDebit,
      currentBalance: toNumber(latestEntry?.balance),
      totalTransactions: filteredEntries.length,
    }
  }, [filteredEntries])

  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedEntries = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE
    return sortedEntries.slice(start, start + PAGE_SIZE)
  }, [safeCurrentPage, sortedEntries])

  const handleFilterChange = (field, value) => {
    if (field === 'sort') {
      const preset = sortPresets[value] || sortPresets.date_desc
      setSortConfig(preset)
    }

    setFilters((prev) => ({ ...prev, [field]: value }))

    setCurrentPage(1)
  }

  const handleTableSortChange = (key) => {
    const nextDirection =
      sortConfig.key === key && sortConfig.direction === 'desc'
        ? 'asc'
        : 'desc'

    const sortLabel = `${key}_${nextDirection}`
    const nextSort = sortPresets[sortLabel] ? sortLabel : 'date_desc'

    setSortConfig({ key, direction: nextDirection })
    setFilters((prevFilters) => ({ ...prevFilters, sort: nextSort }))
    setCurrentPage(1)
  }

  const resetEntryForm = () => {
    setEntryForm({
      category: categories[0] || '',
      notes: '',
    })
    setEntryErrors({ category: '', notes: '' })
    setEntrySubmitError('')
  }

  const openAddEntryModal = () => {
    setEntryModalMode('add')
    setActiveEntryId(null)
    resetEntryForm()
    setEntryModalOpen(true)
  }

  const openEditEntryModal = (entry) => {
    setEntryModalMode('edit')
    setActiveEntryId(entry.id)
    setEntryForm({
      category: entry.category || '',
      notes: entry.description || entry.notes || '',
    })
    setEntryErrors({ category: '', notes: '' })
    setEntrySubmitError('')
    setEntryModalOpen(true)
  }

  const validateEntryForm = () => {
    const nextErrors = { category: '', notes: '' }

    if (!entryForm.category) {
      nextErrors.category = 'Please select a category.'
    }

    if (!entryForm.notes.trim()) {
      nextErrors.notes = 'Notes are required.'
    } else if (entryForm.notes.trim().length < 3) {
      nextErrors.notes = 'Notes should be at least 3 characters.'
    }

    setEntryErrors(nextErrors)

    return !nextErrors.category && !nextErrors.notes
  }

  const handleEntrySubmit = async () => {
    if (!validateEntryForm()) return

    setEntrySubmitting(true)
    setEntrySubmitError('')

    const trimmedNotes = entryForm.notes.trim()

    try {
      if (entryModalMode === 'edit' && activeEntryId !== null) {
        setEntries((prev) => prev.map((entry) => (
          entry.id === activeEntryId
            ? {
              ...entry,
              description: trimmedNotes,
              notes: trimmedNotes,
              category: entryForm.category,
            }
            : entry
        )))

        try {
          await updateTransaction(activeEntryId, {
            description: trimmedNotes,
            notes: trimmedNotes,
            category: entryForm.category,
          })
        } catch (error) {
          warningToast('Updated locally. Backend update is not available yet.')
          setEntrySubmitError(error.message)
        }

        successToast('Ledger entry updated successfully.')
      } else {
        const latestBalance = toNumber(entries[0]?.balance)
        const newEntry = {
          id: `local-${Date.now()}`,
          date: formatDisplayDate(new Date()),
          dateValue: Date.now(),
          description: trimmedNotes,
          notes: trimmedNotes,
          category: entryForm.category,
          type: 'debit',
          withdrawAmount: '',
          creditAmount: '',
          balance: latestBalance,
        }

        setEntries((prev) => [newEntry, ...prev])

        try {
          const createdResponse = await createTransaction({
            description: trimmedNotes,
            notes: trimmedNotes,
            category: entryForm.category,
          })

          const createdList = extractTransactionList(createdResponse)
          if (createdList.length > 0) {
            const normalized = normalizeTransaction(createdList[0], 0)
            setEntries((prev) => prev.map((entry) => (
              entry.id === newEntry.id ? normalized : entry
            )))
          }
        } catch (error) {
          warningToast('Saved locally. Backend create is not available yet.')
          setEntrySubmitError(error.message)
        }

        successToast('Ledger entry added successfully.')
      }

      setCategories((prev) => (
        prev.includes(entryForm.category)
          ? prev
          : [...prev, entryForm.category]
      ))

      setEntryModalOpen(false)
    } catch (error) {
      setEntrySubmitError(error.message)
      errorToast(error.message)
    } finally {
      setEntrySubmitting(false)
    }
  }

  return (
    <div className="pb-4 text-[#1f1814]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-24 h-[18rem] w-[18rem] rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute right-[-6rem] top-[16rem] h-[20rem] w-[20rem] rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute left-1/3 top-[34rem] h-[14rem] w-[14rem] rounded-full bg-emerald-200/25 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d5c5]/90 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6657] shadow-[0_8px_20px_rgba(40,28,20,0.05)] backdrop-blur-xl">
              <BookOpen size={13} />
              Ledger Workspace
            </div>

            <h1 className="mt-9 text-4xl font-bold tracking-[-0.05em] text-[#1f1814] sm:text-5xl">
              Ledger
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6a5d55] sm:text-base">
              Review all debit and credit entries, apply filters, and manage transaction notes.
            </p>
          </div>

          <Button
            onClick={openAddEntryModal}
            className="rounded-xl px-5"
          >
            <Plus size={16} />
            Add Entry
          </Button>
        </div>

        <LedgerSummaryCards summary={summary} />

        <div className="mt-6">
          <LedgerFilters
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </div>

        <section className="mt-6 rounded-[1.6rem] border border-[#e4d8ca] bg-white/75 p-5 shadow-[0_16px_38px_rgba(42,28,20,0.07)] backdrop-blur-xl sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#231b16]">
              Ledger Entries
            </h3>

            {!loading ? (
              <p className="text-xs text-[#7b6f66]">
                Showing {paginatedEntries.length} of {sortedEntries.length}
              </p>
            ) : null}
          </div>

          <LedgerTable
            data={paginatedEntries}
            loading={loading}
            sortKey={sortConfig.key}
            sortDirection={sortConfig.direction}
            onSortChange={handleTableSortChange}
            renderRowActions={(row) => (
              <LedgerRowActions
                onViewDetails={() => setDetailsEntry(row)}
                onEditEntry={() => openEditEntryModal(row)}
              />
            )}
            emptyTitle="No ledger entries found"
            emptyDescription="Try adjusting filters or add a new entry."
          />

          {!loading && sortedEntries.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#7b6f66]">
                Page {safeCurrentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  Previous
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      </section>

      <LedgerEntryModal
        open={entryModalOpen}
        mode={entryModalMode}
        values={entryForm}
        errors={entryErrors}
        categories={categories}
        loading={entrySubmitting}
        submitError={entrySubmitError}
        onChange={(field, value) => {
          setEntryForm((prev) => ({ ...prev, [field]: value }))
          setEntryErrors((prev) => ({ ...prev, [field]: '' }))
          setEntrySubmitError('')
        }}
        onClose={() => {
          if (entrySubmitting) return
          setEntryModalOpen(false)
        }}
        onSubmit={handleEntrySubmit}
      />

      <LedgerDetailsModal
        entry={detailsEntry}
        open={Boolean(detailsEntry)}
        onClose={() => setDetailsEntry(null)}
      />
    </div>
  )
}

export default LedgerPage
