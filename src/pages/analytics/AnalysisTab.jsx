import { useState, useEffect } from 'react';
import {CircleDollarSign, ReceiptText, Wallet, PieChart, CalendarDays} from 'lucide-react'
import { formatAmount } from '../../utils/transactionUtils';
import EmptyState from '../../components/common/EmptyState';
import DountChart from '../../components/common/DonutChart';
import { getDateRange } from '../../utils/getDataRangeUtils';
import { errorToast } from '../../utils/toast';
import SkeletonPage from '../../components/skeletons/SkeletonPage';
import { fetchAnalysis } from '../../api/analysisApi';

const QUICK_RANGES = [
  { label: 'Current Month', value: 'current_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'Custom', value: 'custom' },
]

function AnalysisTab() {
  const [period, setPeriod] = useState('current_month');

  const [customRange, setCustomRange] = useState({
    fromDate: '',
    toDate: ''
  });

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  function isValidCustomRange(period, customRange) {
    if (period !== 'custom') return true

    return (
      customRange.fromDate?.trim() &&
      customRange.toDate?.trim()
    )
  }
  
  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true)

        const range = getDateRange(period, customRange)

        const response = await fetchAnalysis(range)

        setData(response)
      } catch (err) {
        errorToast(err?.message || "Something Went Wrong!")
      } finally {
        setLoading(false)
      }
    }

    if (!isValidCustomRange(period, customRange)) {
      return
    }

    loadAnalysis()
  }, [period, customRange])

  if (loading) return <SkeletonPage />

  return (
    <div className="grid gap-6">
      <AnalysisFilters
        period={period}
        customRange={customRange}
        onPeriodChange={setPeriod}
        onCustomRangeChange={setCustomRange}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={CircleDollarSign}
          label="Total Income"
          value={formatAmount(data?.summary.totalIncome)}
          tone="positive"
        />
        <MetricCard
          icon={ReceiptText}
          label="Total Expense"
          value={formatAmount(data?.summary.totalExpense)}
          tone="attention"
        />
        <MetricCard
          icon={Wallet}
          label="Net Savings"
          value={formatAmount(data?.summary.netSavings)}
          tone={data?.summary.netSavings >= 0 ? 'positive' : 'negative'}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DountChart
          title="Income Sources"
          subtitle="How money came in during this period."
          data={data?.incomeSources}
          emptyText="No income found for this period."
        />
        <DountChart
          title="Spending Categories"
          subtitle="Where money was spent during this period."
          data={data?.expenseCategories}
          emptyText="No expenses found for this period."
        />
      </section>
      
      <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
        <div className="mb-5 flex items-center gap-3">
          <PieChart className="text-[#6f6258]" size={18} />
          <div>
            <h3 className="text-[1.05rem] font-semibold text-[#1f1814]">
              Top Merchants
            </h3>
            <p className="text-sm text-[#766a61]">
              Highest spending entities
            </p>
          </div>
        </div>

        {data?.topMerchants?.length ? (
          <div className="space-y-3">
            {data.topMerchants.map((merchant, index) => (
              <div
                key={merchant.name}
                className="flex items-center justify-between rounded-xl border border-[#eee5dc] px-4 py-3"
              >
                {/* Left side */}
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4ede5] text-xs font-semibold text-[#6f6258]">
                    {index + 1}
                  </span>

                  <span className="font-medium text-[#1f1814]">
                    {merchant.name}
                  </span>
                </div>

                {/* Right side */}
                <div className="text-right">
                  <div className="font-semibold text-[#1f1814]">
                    ₹{formatAmount(merchant.amount)}
                  </div>

                  <div className="text-xs text-[#6f6258]">
                    {merchant.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-[#e9ded1] bg-[#fbf8f4] px-4 py-3 text-sm text-[#76685f]">
            No merchants found for this period.
          </p>
        )}
      </section>

    </div>
  );
}

function AnalysisFilters({
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
}) {
  const isCustom = period === 'custom'

  function handleDateChange(e) {
    const { name, value } = e.target

    onCustomRangeChange({
      ...customRange,
      [name]: value,
    })
  }

  return (
    <section className="rounded-[1.4rem] border border-[#e4d8cb] bg-white/82 p-5 shadow-[0_12px_28px_rgba(40,28,20,0.06)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <CalendarDays className="text-[#6f6258]" size={18} />

        <div>
          <h3 className="text-[1.05rem] font-semibold text-[#1f1814]">
            Analysis Filters
          </h3>
          <p className="text-sm text-[#766a61]">
            Select time period for analysis
          </p>
        </div>
      </div>

      {/* Quick range buttons */}
      <div className="flex flex-wrap gap-2">
        {QUICK_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => onPeriodChange(range.value)}
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
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={customRange.fromDate}
              onChange={handleDateChange}
              className="w-full rounded-xl border border-[#e4d8cb] bg-white px-3 py-2 text-sm text-[#1f1814] outline-none focus:border-[#1f1814]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#6f6258]">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={customRange.toDate}
              onChange={handleDateChange}
              className="w-full rounded-xl border border-[#e4d8cb] bg-white px-3 py-2 text-sm text-[#1f1814] outline-none focus:border-[#1f1814]"
            />
          </div>
        </div>
      )}
    </section>
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

export default AnalysisTab;