import DataTable from './DataTable'
import SkeletonTable from '../skeletons/SkeletonTable'

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const num = Number(value)

  if (Number.isNaN(num)) {
    return null
  }

  const hasDecimals = !Number.isInteger(num)

  return num.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0
  })
}

const renderAmountCell = (value, tone = 'neutral') => {
  const formattedValue = formatAmount(value)

  return formattedValue ? (
    <span
      className={
        tone === 'positive'
          ? 'text-emerald-700'
          : tone === 'negative'
            ? 'text-rose-700'
            : ''
      }
    >
      {formattedValue}
    </span>
  ) : (
    <div className="text-[#b8aca2]">—</div>
  )
}

function LedgerTable({
  data = [],
  loading = false,
  sortKey = 'date',
  sortDirection = 'desc',
  onSortChange,
  renderRowActions,
  emptyTitle = 'No ledger entries found',
  emptyDescription = 'Try changing filters or add a new entry.',
  categoryClassByName = {}
}) {
  const ledgerTableColumns = [
    {
      label: 'Date',
      key: 'date',
      sortKey: 'date',
      sortable: true,
      activeSortKey: sortKey,
      sortDirection,
      onSortChange,
      cellClassName: 'text-[#6a5d55]'
    },
    {
      label: 'Description',
      key: 'description',
      cellClassName: 'text-[#2b2320]',
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${row.type === 'credit' ? 'text-emerald-700' : 'text-amber-700'}`}
          >
            {row.type === 'credit' ? 'By' : 'To'}
          </span>
          <span className="font-medium text-[#2b2320]">{value}</span>
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${categoryClassByName[row.category] || 'bg-[#f3ece4] text-[#6d6058] border-[#e4d8ca]'}`}
          >
            {row.category}
          </span>
        </div>
      )
    },
    {
      label: 'Debit',
      key: 'debitAmount',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-semibold',
      cell: (value) => renderAmountCell(value, 'negative')
    },
    {
      label: 'Credit',
      key: 'creditAmount',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-semibold',
      cell: (value) => renderAmountCell(value, 'positive')
    },
    {
      label: 'Balance',
      key: 'balance',
      headerClassName: 'text-right',
      cellClassName: 'text-right font-semibold text-[#2f2621]',
      cell: (value) => {
        const formattedValue = formatAmount(value, true)

        return formattedValue ? (
          <span>{formattedValue}</span>
        ) : (
          <div className="text-center text-[#b8aca2]">—</div>
        )
      }
    }
  ]

  if (renderRowActions) {
    ledgerTableColumns.push({
      label: 'Actions',
      key: 'actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      cell: (_, row) => renderRowActions(row)
    })
  }

  if (loading) {
    return <SkeletonTable rows={6} />
  }

  return (
    <DataTable
      columns={ledgerTableColumns}
      data={data}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      minWidthClassName="min-w-[880px]"
    />
  )
}

export default LedgerTable
