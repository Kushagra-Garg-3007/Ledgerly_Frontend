import EmptyState from '../common/EmptyState'

function DataTable({
  columns = [],
  data = [],
  rowKey = 'id',
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting filters or search.',
  emptyIcon = '[ ]',
  className = '',
}) {
  if (!columns.length) {
    return null
  }

  if (!data.length) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className={`overflow-x-auto rounded-2xl border border-[#e8dfd6] ${className}`}>
      <table className="w-full min-w-[640px] text-left">
        <thead className="bg-[#f8f4ef] text-xs uppercase tracking-wide text-[#7c6f66]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessorKey || column.label}
                className={`px-4 py-3 font-semibold ${column.headerClassName || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white/85">
          {data.map((row, index) => (
            <tr
              key={row[rowKey] || `${row.date || 'row'}-${index}`}
              className="border-t border-[#eee5dc] text-sm transition hover:bg-[#fbf8f4]"
            >
              {columns.map((column) => {
                const value = row[column.accessorKey]
                const content = column.render ? column.render(value, row) : value

                return (
                  <td
                    key={column.accessorKey || column.label}
                    className={`px-4 py-3 ${column.cellClassName || ''}`}
                  >
                    {content}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
