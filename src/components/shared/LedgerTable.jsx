import DataTable from './DataTable'
import categoryStyles from '../../constants/categoryStyles'

const formatAmount = (value, showDecimals = false) => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  return Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })
}

const renderAmountCell = (value) => {
  const formattedValue = formatAmount(value)

  return formattedValue ? (
    <span>{formattedValue}</span>
  ) : (
    <div className="text-[#b8aca2]">—</div>
  )
}

const ledgerTableColumns = [
  {
    label: 'Date',
    accessorKey: 'date',
    cellClassName: 'text-[#6a5d55]',
  },
  {
    label: 'Description',
    accessorKey: 'description',
    cellClassName: 'text-[#2b2320]',
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${row.type === 'credit' ? 'text-emerald-700' : 'text-amber-700'}`}
        >
          {row.type === 'credit' ? 'By' : 'To'}
        </span>
        <span className="font-medium text-[#2b2320]">{value}</span>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles[row.category] || 'bg-[#f3ece4] text-[#6d6058]'}`}
        >
          {row.category}
        </span>
      </div>
    ),
  },
  {
    label: 'Withdraw Amount',
    accessorKey: 'withdrawAmount',
    headerClassName: 'text-right',
    cellClassName: 'text-right font-semibold text-[#2f2621]',
    render: renderAmountCell,
  },
  {
    label: 'Credit Amt',
    accessorKey: 'creditAmount',
    headerClassName: 'text-right',
    cellClassName: 'text-right font-semibold text-emerald-700',
    render: renderAmountCell,
  },
  {
    label: 'Balance',
    accessorKey: 'balance',
    headerClassName: 'text-right',
    cellClassName: 'text-right font-semibold text-[#2f2621]',
    render: (value) => {
      const formattedValue = formatAmount(value, true)

      return formattedValue ? (
        <span>{formattedValue}</span>
      ) : (
        <div className="text-center text-[#b8aca2]">—</div>
      )
    },
  },
]

function LedgerTable({ data }) {
  return (
    <DataTable
      columns={ledgerTableColumns}
      data={data}
    />
  )
}

export default LedgerTable
