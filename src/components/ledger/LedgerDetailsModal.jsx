import { X } from 'lucide-react'
import Button from '../common/Button'

function formatAmount(value = 0) {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function LedgerDetailsModal({ entry, open, onClose }) {
  if (!open || !entry) return null

  const fields = [
    { label: 'Date', value: entry.date || '—' },
    { label: 'Category', value: entry.category || '—' },
    { label: 'Type', value: entry.type === 'credit' ? 'Credit' : 'Debit' },
    { label: 'Description', value: entry.description || '—' },
    {
      label: 'Debit Amount',
      value: entry.debitAmount ? formatAmount(entry.debitAmount) : '—'
    },
    {
      label: 'Credit Amount',
      value: entry.creditAmount ? formatAmount(entry.creditAmount) : '—'
    },
    {
      label: 'Balance',
      value:
        entry.balance || entry.balance === 0 ? formatAmount(entry.balance) : '—'
    },
    { label: 'Note', value: entry.note || '—' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1814]/28 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-[#e6dbcf] bg-white p-6 shadow-[0_24px_60px_rgba(28,20,14,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-2xl font-semibold tracking-[-0.04em] text-[#241c17]">
              Transaction Details
            </h4>
            <p className="mt-3 text-sm leading-6 text-[#66584f]">
              Detailed view for the selected ledger transaction.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e4d8ca] bg-white/80 p-2 text-[#6a5c52]"
            aria-label="Close transaction details"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="rounded-xl border border-[#e7dbce] bg-white/75 px-4 py-3 text-sm text-[#5d5047]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#86756a]">
                {field.label}
              </p>
              <p className="mt-2 font-semibold text-[#3b3028]">{field.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            className="rounded-xl px-5"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LedgerDetailsModal
