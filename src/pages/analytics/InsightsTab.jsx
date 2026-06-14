import {
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  Brain,
  CalendarDays,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { errorToast } from '../../utils/toast'
import SkeletonPage from '../../components/skeletons/SkeletonPage'
import { formatAmount } from '../../utils/transactionUtils'
import { getInsightDateRange } from '../../utils/getDataRangeUtils'
import EmptyState from '../../components/common/EmptyState'
import { fetchInsights } from '../../api/analysisApi'

const QUICK_RANGES = [
  { label: 'Current Month', value: 'current_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'Custom', value: 'custom' }
]

const formatCurrency = (value) => formatAmount(Math.round(value || 0))

function InsightsTab() {
  const [period, setPeriod] = useState('current_month')

  const [customRange, setCustomRange] = useState({
    previousPeriodStartDate: '',
    previousPeriodEndDate: '',
    currentPeriodStartDate: '',
    currentPeriodEndDate: ''
  })

  function isValidCustomRange(period, customRange) {
    if (period !== 'custom') return true


    return (
      customRange.previousPeriodStartDate?.trim() &&
      customRange.previousPeriodEndDate?.trim() &&
      customRange.currentPeriodStartDate?.trim() &&
      customRange.currentPeriodEndDate?.trim()
    )
  }

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true)
        const range = getInsightDateRange(period, customRange)
        const response = await fetchInsights(range)

        setData(response)
      } catch (err) {
        errorToast(err?.message || 'Something Went Wrong!')
      } finally {
        setLoading(false)
      }
    }

    if (!isValidCustomRange(period, customRange)) {
      return
    }

    loadInsights()
  }, [period, customRange])

  const percentChange = (current, previous) => {
    if (current === 0 && previous === 0) return 0
    let result
    if (previous === 0) {
      result = current > 0 ? 100 : current < 0 ? -100 : 0
    } else result = ((current - previous) / Math.abs(previous)) * 100

    return Number(result.toFixed(2))
  }

  const financialSummary = useMemo(() => {
    if (!data) return null

    const currentIncome = data.incomeChanges.reduce(
      (sum, item) => sum + item.currentAverage,
      0
    )
    const previousIncome = data.incomeChanges.reduce(
      (sum, item) => sum + item.previousAverage,
      0
    )

    const currentExpense = [
      ...data.spendingImproved,
      ...data.spendingIncreased
    ].reduce((sum, item) => sum + item.currentAverage, 0)

    const previousExpense = [
      ...data.spendingImproved,
      ...data.spendingIncreased
    ].reduce((sum, item) => sum + item.previousAverage, 0)

    const currentSavings = currentIncome - currentExpense
    const previousSavings = previousIncome - previousExpense

    const biggestImprovement = data.spendingImproved.reduce(
      (best, item) =>
        !best || Math.abs(item.difference) > Math.abs(best.difference)
          ? item
          : best,
      null
    )

    const needsAttention = data.spendingIncreased.reduce(
      (worst, item) =>
        !worst || item.difference > worst.difference ? item : worst,
      null
    )

    return {
      income: {
        title: 'Income',
        currentValue: currentIncome,
        previousValue: previousIncome,
        percentageChange: percentChange(currentIncome, previousIncome)
      },

      expense: {
        title: 'Expense',
        currentValue: currentExpense,
        previousValue: previousExpense,
        percentageChange: percentChange(currentExpense, previousExpense)
      },

      savings: {
        title: 'Savings',
        currentValue: currentSavings,
        previousValue: previousSavings,
        percentageChange: percentChange(currentSavings, previousSavings),
        directIncrease: currentSavings - previousSavings
      },

      biggestImprovement,
      needsAttention
    }
  }, [data])

  const isCustom = period === 'custom'

  function handleDateChange(e) {
    const { name, value } = e.target

    setCustomRange((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) return <SkeletonPage />

  return (
    <div>
      <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
        <div className="mb-4 flex items-center gap-3">
          <CalendarDays className="text-[#6f6258]" size={18} />

          <div>
            <h3 className="text-[1.05rem] font-semibold text-[#1f1814]">
              Insight Filters
            </h3>
            <p className="text-sm text-[#766a61]">
              Select time period for insights
            </p>
          </div>
        </div>

        {/* Quick range buttons */}
        <div className="flex flex-wrap gap-2">
          {QUICK_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setPeriod(range.value)}
              className={`rounded-full border px-3 py-1.5 text-sm transition
                ${
                  period === range.value
                    ? 'border-[#1f1814] bg-[#1f1814] text-white'
                    : 'border-[#e4d8cb] bg-white text-[#6f6258] hover:bg-[#f7f3ee]'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Custom range */}
        {isCustom && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#6f6258]">
                Period 1 Start Date
              </label>
              <input
                type="date"
                name="previousPeriodStartDate"
                value={customRange.previousPeriodStartDate}
                onChange={handleDateChange}
                className="w-full rounded-xl border border-[#e4d8cb] bg-white px-3 py-2 text-sm text-[#1f1814] outline-none focus:border-[#1f1814]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#6f6258]">
                Period 1 End Date
              </label>
              <input
                type="date"
                name="previousPeriodEndDate"
                value={customRange.previousPeriodEndDate}
                onChange={handleDateChange}
                className="w-full rounded-xl border border-[#e4d8cb] bg-white px-3 py-2 text-sm text-[#1f1814] outline-none focus:border-[#1f1814]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#6f6258]">
                Period 2 Start Date
              </label>
              <input
                type="date"
                name="currentPeriodStartDate"
                value={customRange.currentPeriodStartDate}
                onChange={handleDateChange}
                className="w-full rounded-xl border border-[#e4d8cb] bg-white px-3 py-2 text-sm text-[#1f1814] outline-none focus:border-[#1f1814]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#6f6258]">
                Period 2 End Date
              </label>
              <input
                type="date"
                name="currentPeriodEndDate"
                value={customRange.currentPeriodEndDate}
                onChange={handleDateChange}
                className="w-full rounded-xl border border-[#e4d8cb] bg-white px-3 py-2 text-sm text-[#1f1814] outline-none focus:border-[#1f1814]"
              />
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-6 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
        <h2 className="text-xl font-bold text-[#1f1814] mb-6">
          Financial Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Income"
            currentValue={financialSummary?.income.currentValue}
            previousValue={financialSummary?.income.previousValue}
            percentageChange={financialSummary?.income.percentageChange}
            isPositive={financialSummary?.income.percentageChange >= 0}
          />

          <SummaryCard
            title="Expense"
            currentValue={financialSummary?.expense.currentValue}
            previousValue={financialSummary?.expense.previousValue}
            percentageChange={financialSummary?.expense.percentageChange}
            isPositive={financialSummary?.expense.percentageChange >= 0}
          />

          <SummaryCard
            title="Savings"
            currentValue={financialSummary?.savings.currentValue}
            previousValue={financialSummary?.savings.previousValue}
            percentageChange={financialSummary?.savings.percentageChange}
            isPositive={financialSummary?.savings.percentageChange >= 0}
          />
        </div>

        <div className="mt-6 border-t border-[#e4d8cb] pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-5 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={24} className="mt-0.5 text-emerald-600" />

                <div>
                  <p className="text-lg font-semibold text-[#56493e]">
                    Biggest Improvement
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-md font-semibold text-emerald-800">
                      {financialSummary?.biggestImprovement?.name}
                    </p>

                    <PercentageBadge
                      value={
                        financialSummary?.biggestImprovement?.percentageChange
                      }
                      variant="success"
                    />
                  </div>

                  <p className="mt-1 text-sm font-semibold text-[#6f6258]">
                    Spending reduced by{' '}
                    {formatCurrency(
                      Math.abs(financialSummary?.biggestImprovement?.difference)
                    )}{' '}
                    / month
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-5 py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="mt-0.5 text-amber-600" />

                <div>
                  <p className="text-lg font-semibold text-[#56493e]">
                    Needs Attention
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-md font-semibold text-amber-800">
                      {financialSummary?.needsAttention?.name}
                    </p>

                    <PercentageBadge
                      value={financialSummary?.needsAttention?.percentageChange}
                      variant="warning"
                    />
                  </div>

                  <p className="mt-1 text-sm font-semibold text-[#6f6258]">
                    Spending increased by{' '}
                    {formatCurrency(
                      Math.abs(financialSummary?.needsAttention?.difference)
                    )}{' '}
                    / month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-6 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
        <h1 className="mb-4 text-xl">Improved Spending Habits</h1>
        <div className="space-y-4">
          {data?.spendingImproved.map((item) => (
            <InsightRow
              key={`${item.name}_${item.txnType}`}
              item={item}
              variant="success"
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-6 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
        <h1 className="mb-4 text-xl">Needs Attention</h1>
        <div className="space-y-4">
          {data?.spendingIncreased.map((item) => (
            <InsightRow
              key={`${item.name}_${item.txnType}`}
              item={item}
              variant="warning"
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-6 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
        <h1 className="mb-4 text-xl">Income Trends</h1>
        <div className="space-y-4">
          {data?.incomeChanges.map((item) => (
            <InsightRow
              key={`${item.name}_${item.txnType}`}
              item={item}
              variant="income"
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function SummaryCard({
  title,
  currentValue = 0,
  previousValue = 0,
  percentageChange,
  isPositive
}) {
  const TrendIcon = isPositive ? ArrowUp : ArrowDown

  const trendColor = isPositive ? 'text-emerald-600' : 'text-rose-600'

  const badgeBg = isPositive ? 'bg-emerald-50' : 'bg-rose-50'

  const valueDifference = currentValue - previousValue

  const getChangeText = () => {
    const amount = formatCurrency(Math.abs(valueDifference))

    switch (title.toLowerCase()) {
      case 'income':
        return valueDifference >= 0
          ? `Income increased by ${amount}`
          : `Income decreased by ${amount}`

      case 'expense':
        return valueDifference >= 0
          ? `Expense increased by ${amount}`
          : `Expense reduced by ${amount}`

      case 'savings':
        return valueDifference >= 0
          ? `Savings improved by ${amount}`
          : `Savings reduced by ${amount}`

      default:
        return valueDifference >= 0
          ? `Increased by ${amount}`
          : `Decreased by ${amount}`
    }
  }

  return (
    <div className="rounded-xl border border-[#e4d8cb] bg-[#fbf8f4] p-5">
      <p className="text-sm font-semibold text-[#6f6258]">
        {title.toUpperCase()}
      </p>

      <p className="mt-2 text-3xl font-bold text-[#1f1814]">
        {formatCurrency(currentValue)}
      </p>

      <div className="mt-3 flex items-center gap-2">
        {percentageChange === null ? (
          <div className="rounded-lg bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-700">
            New
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* <TrendIcon
              size={16}
              className={trendColor}
            /> */}

            <PercentageBadge
              value={percentageChange}
              variant={isPositive ? 'success' : 'warning'}
            />
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-[#6b5c50]">
        Previous: {formatCurrency(previousValue)}
      </p>

      <p
        className={`mt-2 text-sm font-medium ${
          isPositive ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {getChangeText()}
      </p>
    </div>
  )
}

function InsightRow({ item, variant = 'success' }) {
  const styles = {
    success: {
      border: 'border-emerald-200',
      accent: 'border-l-emerald-500',
      title: 'text-[#1f1814]',
      text: 'text-[#6f6258]',
      value: 'text-emerald-700'
    },

    warning: {
      border: 'border-amber-200',
      accent: 'border-l-amber-500',
      title: 'text-[#1f1814]',
      text: 'text-[#6f6258]',
      value: 'text-amber-700'
    },

    income: {
      border: 'border-slate-200',
      accent: 'border-l-slate-500',
      title: 'text-[#1f1814]',
      text: 'text-[#6f6258]',
      value: 'text-slate-700'
    }
  }

  const theme = styles[variant]

  return (
    <div
      className={`
        rounded-xl
        border
        ${theme.border}
        ${theme.accent}
        border-l-4
        bg-white
        p-4
        shadow-sm
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className={`text-base font-semibold ${theme.title}`}>
              {item.name}
            </h4>

            {item.isNew && (
              <span
                className="
                  rounded-full
                  bg-emerald-100
                  px-2 py-0.5
                  text-xs
                  font-medium
                  text-emerald-700
                "
              >
                New
              </span>
            )}

            {item.isRemoved && (
              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-2 py-0.5
                  text-xs
                  font-medium
                  text-slate-600
                "
              >
                Removed
              </span>
            )}
          </div>

          <p className={`mt-2 text-sm ${theme.text}`}>
            {formatCurrency(item.previousAverage)}
            /mo
            {' → '}
            {formatCurrency(item.currentAverage)}
            /mo
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className={`text-lg font-bold ${theme.value}`}>
            {item.difference > 0 ? '+' : ''}
            {formatCurrency(item.difference)}
          </p>

          {item.percentageChange !== null && (
            <PercentageBadge value={item.percentageChange} variant={variant} />
          )}
        </div>
      </div>
    </div>
  )
}

function PercentageBadge({ value, variant = 'success' }) {
  if (value === null || value === undefined) return null

  const styles = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    income: 'bg-slate-100 text-slate-700'
  }

  return (
    <span
      className={`
        rounded-full
        px-2 py-1
        text-xs
        font-semibold
        ${styles[variant]}
      `}
    >
      {value > 0 ? '+' : ''}
      {value}%
    </span>
  )
}

export default InsightsTab
