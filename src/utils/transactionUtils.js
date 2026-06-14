export const PAGE_SIZE = 31

export const SORT_PRESETS = {
  date_desc: { key: 'date', direction: 'desc' },
  date_asc: { key: 'date', direction: 'asc' }
}

export function formatDisplayDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function formatAmount(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0'
  }
  ;[]

  return Number(value).toLocaleString('en-IN')
}

export function normalizeTransaction(item) {
  const category =
    typeof item.category === 'object' && item.category !== null
      ? item.category.name
      : item.category

  return {
    id: item.id,
    date: formatDisplayDate(item.date),
    dateValue: new Date(item.date).getTime(),
    description: item.entity.name,
    entityId: item.entity.id,
    entityName: item.entity.name,
    category,
    categoryId: item.categoryId ?? item.category?.id ?? null,
    note: item.note,
    type: item.type.toLowerCase(),
    debitAmount: item.debitAmount,
    creditAmount: item.creditAmount,
    balance: item.balance
  }
}

export function sortEntries(entries, { key, direction }) {
  return [...entries].sort((a, b) => {
    const av = key === 'date' ? a.dateValue : (a[key] ?? 0)
    const bv = key === 'date' ? b.dateValue : (b[key] ?? 0)
    if (av < bv) return direction === 'asc' ? -1 : 1
    if (av > bv) return direction === 'asc' ? 1 : -1
    return 0
  })
}
