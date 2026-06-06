import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  CalendarDays,
  CircleDollarSign,
  Lightbulb,
  LineChart,
  PieChart,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { getTransactions } from '../api/transactionApi'
import EmptyState from '../components/common/EmptyState'
import Skeleton from '../components/skeletons/Skeleton'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

const chartColors = [
  '#c27a35',
  '#2f8f76',
  '#356ea8',
  '#8b5aa8',
  '#b74f6b',
  '#64748b',
]

const analysisPeriods = [
  { value: 'current_month', label: 'Current Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_12_months', label: 'Last 12 Months' },
  { value: 'custom', label: 'Custom Date Range' },
]

const insightPeriods = [
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

const formatCurrency = (value) => currencyFormatter.format(Math.round(value || 0))

const formatPercent = (value) => {
  if (!Number.isFinite(value)) return '0%'
  return `${Math.abs(value).toFixed(0)}%`
}

const normalizeTransaction = (item) => {
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

const getRangeForAnalysis = (period, customRange) => {
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

const getComparisonRanges = (period, customRange) => {
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

const isWithinRange = (transaction, range) =>
  transaction.date >= range.from && transaction.date <= range.to

const groupByAmount = (transactions, key, amountKey) => {
  const totals = transactions.reduce((acc, item) => {
    const label = item[key] || 'Unknown'
    acc[label] = (acc[label] || 0) + item[amountKey]
    return acc
  }, {})

  return Object.entries(totals)
    .map(([label, value]) => ({ label, value }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)
}

const summarize = (transactions) => {
  const income = transactions.reduce((sum, item) => sum + item.creditAmount, 0)
  const expense = transactions.reduce((sum, item) => sum + item.debitAmount, 0)

  return {
    income,
    expense,
    savings: income - expense,
    incomeSources: groupByAmount(
      transactions.filter((item) => item.creditAmount > 0),
      'category',
      'creditAmount',
    ),
    spendingCategories: groupByAmount(
      transactions.filter((item) => item.debitAmount > 0),
      'category',
      'debitAmount',
    ),
    merchants: groupByAmount(
      transactions.filter((item) => item.debitAmount > 0),
      'entity',
      'debitAmount',
    ),
  }
}

const percentChange = (current, previous) => {
  if (!previous && !current) return 0
  if (!previous) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

const getComparisonItems = (currentList, previousList) => {
  const labels = new Set([
    ...currentList.map((item) => item.label),
    ...previousList.map((item) => item.label),
  ])

  return [...labels].map((label) => {
    const current = currentList.find((item) => item.label === label)?.value || 0
    const previous = previousList.find((item) => item.label === label)?.value || 0

    return {
      label,
      current,
      previous,
      delta: current - previous,
      percent: percentChange(current, previous),
    }
  })
}

const getMonthlyJourney = (transactions) => {
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

function AnalysisInsightsPage() {
  const [activeTab, setActiveTab] = useState('analysis')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [analysisPeriod, setAnalysisPeriod] = useState('current_month')
  const [analysisCustomRange, setAnalysisCustomRange] = useState({ from: '', to: '' })
  const [insightPeriod, setInsightPeriod] = useState('month')
  const [insightCustomRange, setInsightCustomRange] = useState({
    currentFrom: '',
    currentTo: '',
    previousFrom: '',
    previousTo: '',
  })

  useEffect(() => {
    let alive = true

    getTransactions({
      page: 1,
      limit: 1000,
      sortBy: 'date',
      sortDirection: 'asc',
    })
      .then((response) => {
        if (!alive) return
        const list = Array.isArray(response?.data) ? response.data : []
        setTransactions(list.map(normalizeTransaction))
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message)
        setTransactions([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const analysisRange = useMemo(
    () => getRangeForAnalysis(analysisPeriod, analysisCustomRange),
    [analysisPeriod, analysisCustomRange],
  )

  const analysisTransactions = useMemo(
    () => transactions.filter((item) => isWithinRange(item, analysisRange)),
    [transactions, analysisRange],
  )

  const analysisSummary = useMemo(
    () => summarize(analysisTransactions),
    [analysisTransactions],
  )

  const insightRanges = useMemo(
    () => getComparisonRanges(insightPeriod, insightCustomRange),
    [insightPeriod, insightCustomRange],
  )

  const insightData = useMemo(() => {
    const currentTransactions = transactions.filter((item) => isWithinRange(item, insightRanges.current))
    const previousTransactions = transactions.filter((item) => isWithinRange(item, insightRanges.previous))
    const current = summarize(currentTransactions)
    const previous = summarize(previousTransactions)

    return {
      current,
      previous,
      currentTransactions,
      previousTransactions,
      spendingChanges: getComparisonItems(current.spendingCategories, previous.spendingCategories),
      incomeChanges: getComparisonItems(current.incomeSources, previous.incomeSources),
      journey: getMonthlyJourney([...previousTransactions, ...currentTransactions]),
    }
  }, [transactions, insightRanges])

  return (
    <div className="pb-6 text-[#1f1814]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d5c5]/90 bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6657] shadow-[0_8px_20px_rgba(40,28,20,0.05)] backdrop-blur-xl">
              <Brain size={13} />
              Financial intelligence
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-[-0.05em] text-[#1f1814] sm:text-5xl">
              Analysis & Insights
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6a5d55] sm:text-base">
              Understand where your money went, then see how your habits are changing over time.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-[#ded1c3] bg-white/75 p-1 shadow-[0_8px_18px_rgba(40,28,20,0.06)]">
            <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
              Analysis
            </TabButton>
            <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>
              Insights
            </TabButton>
          </div>
        </div>

        {loading ? (
          <AnalyticsLoading />
        ) : error ? (
          <EmptyState
            icon="!"
            title="Could not load analytics"
            description={error}
          />
        ) : activeTab === 'analysis' ? (
          <AnalysisTab
            period={analysisPeriod}
            customRange={analysisCustomRange}
            onPeriodChange={setAnalysisPeriod}
            onCustomRangeChange={setAnalysisCustomRange}
            summary={analysisSummary}
          />
        ) : (
          <InsightsTab
            period={insightPeriod}
            customRange={insightCustomRange}
            onPeriodChange={setInsightPeriod}
            onCustomRangeChange={setInsightCustomRange}
            data={insightData}
          />
        )}
      </section>
    </div>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'bg-[#2f2621] text-white shadow-[0_4px_12px_rgba(40,28,20,0.16)]'
          : 'text-[#6c5f56] hover:bg-[#f4ede5] hover:text-[#2f2621]'
      }`}
    >
      {children}
    </button>
  )
}

function AnalysisTab({
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
  summary,
}) {
  return (
    <div className="grid gap-6">
      <PeriodControls
        label="Snapshot period"
        value={period}
        options={analysisPeriods}
        onChange={onPeriodChange}
      />

      {period === 'custom' ? (
        <DateRangeFields
          values={customRange}
          fields={[
            { key: 'from', label: 'From' },
            { key: 'to', label: 'To' },
          ]}
          onChange={onCustomRangeChange}
        />
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={CircleDollarSign}
          label="Total Income"
          value={formatCurrency(summary.income)}
          tone="positive"
        />
        <MetricCard
          icon={ReceiptText}
          label="Total Expense"
          value={formatCurrency(summary.expense)}
          tone="attention"
        />
        <MetricCard
          icon={Wallet}
          label="Net Savings"
          value={formatCurrency(summary.savings)}
          tone={summary.savings >= 0 ? 'positive' : 'negative'}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <BreakdownPanel
          title="Income Sources"
          subtitle="How money came in during this period."
          data={summary.incomeSources}
          emptyText="No income found for this period."
        />
        <BreakdownPanel
          title="Spending Categories"
          subtitle="Where money was spent during this period."
          data={summary.spendingCategories}
          emptyText="No expenses found for this period."
        />
      </section>

      <RankedPanel
        title="Top Spending Merchants"
        subtitle="The merchants that received the most money."
        data={summary.merchants.slice(0, 8)}
      />
    </div>
  )
}

function InsightsTab({
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
  data,
}) {
  const incomeChange = percentChange(data.current.income, data.previous.income)
  const expenseChange = percentChange(data.current.expense, data.previous.expense)
  const savingsChange = percentChange(data.current.savings, data.previous.savings)
  const improved = data.spendingChanges
    .filter((item) => item.delta < 0)
    .sort((left, right) => left.delta - right.delta)
    .slice(0, 4)
  const attention = data.spendingChanges
    .filter((item) => item.delta > 0)
    .sort((left, right) => right.delta - left.delta)
    .slice(0, 4)
  const incomeChanges = data.incomeChanges
    .filter((item) => item.delta !== 0)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 4)

  return (
    <div className="grid gap-6">
      <PeriodControls
        label="Comparison"
        value={period}
        options={insightPeriods}
        onChange={onPeriodChange}
      />

      {period === 'custom' ? (
        <DateRangeFields
          values={customRange}
          fields={[
            { key: 'currentFrom', label: 'Current from' },
            { key: 'currentTo', label: 'Current to' },
            { key: 'previousFrom', label: 'Previous from' },
            { key: 'previousTo', label: 'Previous to' },
          ]}
          onChange={onCustomRangeChange}
        />
      ) : null}

      <FinancialStory
        incomeChange={incomeChange}
        expenseChange={expenseChange}
        savingsChange={savingsChange}
        improved={improved}
        attention={attention}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <TrendCard label="Income Trend" value={incomeChange} inverted={false} />
        <TrendCard label="Expense Trend" value={expenseChange} inverted />
        <TrendCard label="Savings Trend" value={savingsChange} inverted={false} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <InsightList
          title="What Improved?"
          icon={TrendingDown}
          emptyText="No spending reductions found for this comparison."
          items={improved.map((item) => ({
            label: item.label,
            text: `Reduced by ${formatCurrency(Math.abs(item.delta))}`,
          }))}
        />
        <InsightList
          title="What Needs Attention?"
          icon={ArrowUpRight}
          emptyText="No meaningful spending increases found."
          items={attention.map((item) => ({
            label: item.label,
            text: `Increased by ${formatCurrency(item.delta)}`,
          }))}
        />
      </section>

      <InsightList
        title="Income Changes"
        icon={CircleDollarSign}
        emptyText="No income changes found for this comparison."
        items={incomeChanges.map((item) => ({
          label: item.label,
          text: item.delta > 0
            ? `Increased by ${formatCurrency(item.delta)}`
            : `Decreased by ${formatCurrency(Math.abs(item.delta))}`,
        }))}
      />

      <JourneyChart data={data.journey} />

      <CategoryInsights items={[...improved, ...attention].slice(0, 6)} />
    </div>
  )
}

function PeriodControls({ label, value, options, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.3rem] border border-[#e4d8cb] bg-white/78 p-4 shadow-[0_10px_24px_rgba(40,28,20,0.05)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#4a3d36]">
        <CalendarDays size={16} />
        {label}
      </div>
      <select
        className="min-w-[220px] rounded-lg border border-[#d7c8b8] bg-[#f6f1ea] px-3 py-2 text-sm font-medium text-[#241b17] outline-none focus:border-[#b79d89] focus:ring-2 focus:ring-[#d8c0aa]/30"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function DateRangeFields({ values, fields, onChange }) {
  return (
    <div className="grid gap-3 rounded-[1.3rem] border border-[#e4d8cb] bg-white/70 p-4 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((field) => (
        <label key={field.key} className="grid gap-2 text-sm font-semibold text-[#4a3d36]">
          {field.label}
          <input
            type="date"
            value={values[field.key]}
            onChange={(event) => onChange((prev) => ({ ...prev, [field.key]: event.target.value }))}
            className="rounded-lg border border-[#d7c8b8] bg-[#f6f1ea] px-3 py-2 text-sm font-medium text-[#241b17] outline-none focus:border-[#b79d89] focus:ring-2 focus:ring-[#d8c0aa]/30"
          />
        </label>
      ))}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, tone }) {
  const toneClass = tone === 'positive'
    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
    : tone === 'negative'
      ? 'bg-rose-50 text-rose-800 border-rose-100'
      : 'bg-amber-50 text-amber-800 border-amber-100'

  return (
    <article className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${toneClass}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-semibold text-[#776a61]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#1f1814]">{value}</p>
    </article>
  )
}

function BreakdownPanel({ title, subtitle, data, emptyText }) {
  return (
    <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <SectionTitle icon={PieChart} title={title} subtitle={subtitle} />
      {data.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-[170px_1fr] sm:items-center">
          <DonutChart data={data.slice(0, 6)} />
          <BreakdownList data={data.slice(0, 6)} />
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-[#e9ded1] bg-[#fbf8f4] px-4 py-3 text-sm text-[#76685f]">{emptyText}</p>
      )}
    </section>
  )
}

function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const gradient = data.map((item, index) => {
    const start = data
      .slice(0, index)
      .reduce((sum, segment) => sum + (segment.value / total) * 100, 0)
    const end = start + (item.value / total) * 100
    return `${chartColors[index % chartColors.length]} ${start}% ${end}%`
  }).join(', ')

  return (
    <div
      className="mx-auto flex h-40 w-40 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(${gradient})` }}
      aria-label="Category breakdown chart"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center text-sm font-bold text-[#2f2621] shadow-inner">
        {numberFormatter.format(total)}
      </div>
    </div>
  )
}

function BreakdownList({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid gap-3">
      {data.map((item, index) => (
        <div key={item.label} className="grid gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-[#2f2621]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: chartColors[index % chartColors.length] }}
              />
              {item.label}
            </span>
            <span className="font-semibold text-[#6c5f56]">{formatCurrency(item.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-[#eee5dc]">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.max(4, (item.value / total) * 100)}%`,
                backgroundColor: chartColors[index % chartColors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function RankedPanel({ title, subtitle, data }) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <SectionTitle icon={ReceiptText} title={title} subtitle={subtitle} />
      <div className="mt-5 grid gap-3">
        {data.length ? data.map((item, index) => (
          <div key={item.label} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-[#2f2621]">{index + 1}. {item.label}</span>
              <span className="font-semibold text-[#6c5f56]">{formatCurrency(item.value)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-[#eee5dc]">
              <div
                className="h-2.5 rounded-full bg-[#356ea8]"
                style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }}
              />
            </div>
          </div>
        )) : (
          <p className="rounded-xl border border-[#e9ded1] bg-[#fbf8f4] px-4 py-3 text-sm text-[#76685f]">No spending merchants found for this period.</p>
        )}
      </div>
    </section>
  )
}

function FinancialStory({ incomeChange, expenseChange, savingsChange, improved, attention }) {
  const cards = [
    {
      icon: savingsChange >= 0 ? TrendingUp : TrendingDown,
      text: savingsChange >= 0
        ? `Savings improved by ${formatPercent(savingsChange)} compared to the previous period.`
        : `Savings reduced by ${formatPercent(savingsChange)} compared to the previous period.`,
      tone: savingsChange >= 0 ? 'good' : 'warn',
    },
    {
      icon: expenseChange <= 0 ? ArrowDownRight : ArrowUpRight,
      text: expenseChange <= 0
        ? `Expenses reduced by ${formatPercent(expenseChange)}.`
        : `Expenses increased by ${formatPercent(expenseChange)}.`,
      tone: expenseChange <= 0 ? 'good' : 'warn',
    },
    {
      icon: incomeChange >= 0 ? ArrowUpRight : ArrowDownRight,
      text: incomeChange >= 0
        ? `Income increased by ${formatPercent(incomeChange)}.`
        : `Income decreased by ${formatPercent(incomeChange)}.`,
      tone: incomeChange >= 0 ? 'good' : 'neutral',
    },
    improved[0] ? {
      icon: Lightbulb,
      text: `${improved[0].label} spending reduced by ${formatCurrency(Math.abs(improved[0].delta))}.`,
      tone: 'good',
    } : null,
    attention[0] ? {
      icon: Lightbulb,
      text: `${attention[0].label} needs attention. It increased by ${formatCurrency(attention[0].delta)}.`,
      tone: 'warn',
    } : null,
  ].filter(Boolean)

  return (
    <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <SectionTitle
        icon={Brain}
        title="Financial Story"
        subtitle="Plain-language observations from this comparison."
      />
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StoryCard key={card.text} {...card} />
        ))}
      </div>
    </section>
  )
}

function StoryCard({ icon: Icon, text, tone }) {
  const toneClass = tone === 'good'
    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
    : tone === 'warn'
      ? 'bg-amber-50 text-amber-900 border-amber-100'
      : 'bg-blue-50 text-blue-800 border-blue-100'

  return (
    <article className={`rounded-xl border p-4 ${toneClass}`}>
      <Icon size={18} />
      <p className="mt-3 text-sm font-semibold leading-6">{text}</p>
    </article>
  )
}

function TrendCard({ label, value, inverted }) {
  const isPositive = inverted ? value <= 0 : value >= 0
  const Icon = value >= 0 ? TrendingUp : TrendingDown

  return (
    <article className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <p className="text-sm font-semibold text-[#776a61]">{label}</p>
      <div className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-lg font-bold ${
        isPositive ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-rose-100 bg-rose-50 text-rose-800'
      }`}>
        <Icon size={18} />
        {value >= 0 ? '+' : '-'}{formatPercent(value)}
      </div>
    </article>
  )
}

function InsightList({ title, icon: Icon, items, emptyText }) {
  return (
    <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <SectionTitle icon={Icon} title={title} />
      <div className="mt-5 grid gap-3">
        {items.length ? items.map((item) => (
          <article key={`${item.label}-${item.text}`} className="rounded-xl border border-[#eadfd3] bg-[#fbf8f4] px-4 py-3">
            <p className="text-sm font-bold text-[#2f2621]">{item.label}</p>
            <p className="mt-1 text-sm text-[#6c5f56]">{item.text}</p>
          </article>
        )) : (
          <p className="rounded-xl border border-[#e9ded1] bg-[#fbf8f4] px-4 py-3 text-sm text-[#76685f]">{emptyText}</p>
        )}
      </div>
    </section>
  )
}

function JourneyChart({ data }) {
  const max = Math.max(...data.flatMap((item) => [item.income, item.expense, Math.abs(item.savings)]), 1)

  return (
    <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <SectionTitle
        icon={LineChart}
        title="Financial Journey"
        subtitle="Income, expenses, and savings over time."
      />
      <div className="mt-6 overflow-x-auto">
        <div className="grid min-w-[720px] grid-cols-8 items-end gap-4">
          {data.map((item) => (
            <div key={item.label} className="grid gap-2">
              <div className="flex h-44 items-end gap-1.5">
                <Bar value={item.income} max={max} color="#2f8f76" />
                <Bar value={item.expense} max={max} color="#c27a35" />
                <Bar value={Math.abs(item.savings)} max={max} color="#356ea8" />
              </div>
              <p className="text-center text-xs font-semibold text-[#776a61]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#6c5f56]">
        <Legend color="#2f8f76" label="Income" />
        <Legend color="#c27a35" label="Expense" />
        <Legend color="#356ea8" label="Savings" />
      </div>
    </section>
  )
}

function Bar({ value, max, color }) {
  return (
    <div className="flex flex-1 items-end rounded-full bg-[#eee5dc]">
      <div
        className="w-full rounded-full"
        style={{ height: `${Math.max(4, (value / max) * 100)}%`, backgroundColor: color }}
      />
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function CategoryInsights({ items }) {
  return (
    <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      <SectionTitle
        icon={Lightbulb}
        title="Smart Insights"
        subtitle="Category observations without asking you to read more charts."
      />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.length ? items.map((item) => (
          <article key={item.label} className="rounded-xl border border-[#eadfd3] bg-[#fbf8f4] px-4 py-3">
            <p className="text-sm font-bold text-[#2f2621]">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-[#6c5f56]">
              {item.delta > 0
                ? `Spending increased by ${formatPercent(item.percent)}. Review recent transactions before this becomes a pattern.`
                : `Spending reduced by ${formatPercent(item.percent)}. This is a positive shift worth maintaining.`}
            </p>
            <button
              type="button"
              className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#356ea8]"
            >
              View Details
            </button>
          </article>
        )) : (
          <p className="rounded-xl border border-[#e9ded1] bg-[#fbf8f4] px-4 py-3 text-sm text-[#76685f]">No category changes found yet.</p>
        )}
      </div>
    </section>
  )
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon size={17} className="text-[#7a6657]" />
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1f1814]">{title}</h2>
      </div>
      {subtitle ? <p className="mt-2 text-sm leading-6 text-[#6c5f56]">{subtitle}</p> : null}
    </div>
  )
}

function AnalyticsLoading() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-20" rounded="rounded-[1.3rem]" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-36" rounded="rounded-[1.4rem]" />
        <Skeleton className="h-36" rounded="rounded-[1.4rem]" />
        <Skeleton className="h-36" rounded="rounded-[1.4rem]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" rounded="rounded-[1.4rem]" />
        <Skeleton className="h-80" rounded="rounded-[1.4rem]" />
      </div>
    </div>
  )
}

export default AnalysisInsightsPage
