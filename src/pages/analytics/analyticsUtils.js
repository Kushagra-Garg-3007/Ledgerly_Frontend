export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

export const chartColors = [
  '#c27a35',
  '#2f8f76',
  '#356ea8',
  '#8b5aa8',
  '#b74f6b',
  '#64748b',
]

export const analysisPeriods = [
  { value: 'current_month', label: 'Current Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_12_months', label: 'Last 12 Months' },
  { value: 'custom', label: 'Custom Date Range' },
]

export const insightPeriods = [
  { value: 'month', label: 'Last Month vs Current Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_12_months', label: 'Last 12 Months' },
  { value: 'quarter', label: 'Quarter vs Quarter' },
  { value: 'year', label: 'Year vs Year' },
  { value: 'custom', label: 'Custom Date Ranges' },
]

const startOfDay = (date) => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

const endOfDay = (date) => {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

const addMonths = (date, months) => {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

export const formatCurrency = (value) => currencyFormatter.format(Math.round(value || 0))

export const formatPercent = (value, digits = 0) => {
  if (!Number.isFinite(value)) return '0%'
  return `${Math.abs(value).toFixed(digits)}%`
}

export const normalizeTransaction = (item) => {
  const category = typeof item.category === 'object' && item.category !== null
    ? item.category.name
    : item.category

  return {
    id: item.id,
    date: new Date(item.date),
    type: String(item.type || '').toUpperCase(),
    debitAmount: Number(item.debitAmount || 0),
    creditAmount: Number(item.creditAmount || 0),
    entity: item.entity?.name || 'Unknown merchant',
    category: category || 'Unlabelled',
  }
}

export const getRangeForAnalysis = (period, customRange) => {
  const today = endOfDay(new Date())

  if (period === 'custom' && customRange.from && customRange.to) {
    return {
      from: startOfDay(new Date(customRange.from)),
      to: endOfDay(new Date(customRange.to)),
    }
  }

  if (period === 'current_month') {
    return {
      from: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
      to: today,
    }
  }

  const months = period === 'last_3_months'
    ? 3
    : period === 'last_6_months'
      ? 6
      : 12

  return {
    from: startOfDay(addMonths(today, -months + 1)),
    to: today,
  }
}

export const getComparisonRanges = (period, customRange) => {
  const today = endOfDay(new Date())

  if (
    period === 'custom' &&
    customRange.currentFrom &&
    customRange.currentTo &&
    customRange.previousFrom &&
    customRange.previousTo
  ) {
    return {
      current: {
        from: startOfDay(new Date(customRange.currentFrom)),
        to: endOfDay(new Date(customRange.currentTo)),
      },
      previous: {
        from: startOfDay(new Date(customRange.previousFrom)),
        to: endOfDay(new Date(customRange.previousTo)),
      },
    }
  }

  if (period === 'month') {
    const currentFrom = startOfDay(new Date(today.getFullYear(), today.getMonth(), 1))
    const previousFrom = startOfDay(new Date(today.getFullYear(), today.getMonth() - 1, 1))
    const previousTo = endOfDay(new Date(today.getFullYear(), today.getMonth(), 0))
    return { current: { from: currentFrom, to: today }, previous: { from: previousFrom, to: previousTo } }
  }

  if (period === 'quarter') {
    const currentQuarter = Math.floor(today.getMonth() / 3)
    const currentFrom = startOfDay(new Date(today.getFullYear(), currentQuarter * 3, 1))
    const previousFrom = addMonths(currentFrom, -3)
    const previousTo = endOfDay(new Date(currentFrom.getFullYear(), currentFrom.getMonth(), 0))
    return { current: { from: currentFrom, to: today }, previous: { from: previousFrom, to: previousTo } }
  }

  if (period === 'year') {
    const currentFrom = startOfDay(new Date(today.getFullYear(), 0, 1))
    const previousFrom = startOfDay(new Date(today.getFullYear() - 1, 0, 1))
    const previousTo = endOfDay(new Date(today.getFullYear() - 1, 11, 31))
    return { current: { from: currentFrom, to: today }, previous: { from: previousFrom, to: previousTo } }
  }

  const months = period === 'last_3_months'
    ? 3
    : period === 'last_6_months'
      ? 6
      : 12
  const currentFrom = startOfDay(addMonths(today, -months + 1))
  const previousFrom = startOfDay(addMonths(currentFrom, -months))
  const previousTo = endOfDay(new Date(currentFrom.getFullYear(), currentFrom.getMonth(), 0))

  return { current: { from: currentFrom, to: today }, previous: { from: previousFrom, to: previousTo } }
}

export const isWithinRange = (transaction, range) =>
  transaction.date >= range.from && transaction.date <= range.to

const groupByAmount = (transactions, key, amountKey, totalAmount) => {
  const totals = transactions.reduce((acc, item) => {
    const label = item[key] || 'Unknown'
    acc[label] = (acc[label] || 0) + item[amountKey]
    return acc
  }, {})

  return Object.entries(totals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalAmount ? (amount / totalAmount) * 100 : 0,
    }))
    .filter((item) => item.amount > 0)
    .sort((left, right) => right.amount - left.amount)
}

export const summarizeAnalysis = (transactions) => {
  const totalIncome = transactions.reduce((sum, item) => sum + item.creditAmount, 0)
  const totalExpense = transactions.reduce((sum, item) => sum + item.debitAmount, 0)

  return {
    summary: {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
    },
    incomeSources: groupByAmount(
      transactions.filter((item) => item.creditAmount > 0),
      'category',
      'creditAmount',
      totalIncome,
    ),
    expenseCategories: groupByAmount(
      transactions.filter((item) => item.debitAmount > 0),
      'category',
      'debitAmount',
      totalExpense,
    ),
    topMerchants: groupByAmount(
      transactions.filter((item) => item.debitAmount > 0),
      'entity',
      'debitAmount',
      totalExpense,
    ),
  }
}

export const summarizeInsight = (transactions) => {
  const analysis = summarizeAnalysis(transactions)

  return {
    income: analysis.summary.totalIncome,
    expense: analysis.summary.totalExpense,
    savings: analysis.summary.netSavings,
    incomeSources: analysis.incomeSources,
    spendingCategories: analysis.expenseCategories,
  }
}

export const percentChange = (current, previous) => {
  if (!previous && !current) return 0
  if (!previous) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export const getComparisonItems = (currentList, previousList) => {
  const labels = new Set([
    ...currentList.map((item) => item.name),
    ...previousList.map((item) => item.name),
  ])

  return [...labels].map((label) => {
    const current = currentList.find((item) => item.name === label)?.amount || 0
    const previous = previousList.find((item) => item.name === label)?.amount || 0

    return {
      label,
      current,
      previous,
      delta: current - previous,
      percent: percentChange(current, previous),
    }
  })
}

export const getMonthlyJourney = (transactions) => {
  const buckets = new Map()

  transactions.forEach((item) => {
    const label = item.date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    const current = buckets.get(label) || { label, income: 0, expense: 0, savings: 0 }
    current.income += item.creditAmount
    current.expense += item.debitAmount
    current.savings = current.income - current.expense
    buckets.set(label, current)
  })

  return [...buckets.values()].slice(-8)
}
