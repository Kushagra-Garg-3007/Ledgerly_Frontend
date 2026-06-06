import {
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  CircleDollarSign,
  Lightbulb,
  LineChart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  formatCurrency,
  formatPercent,
  insightPeriods,
  percentChange,
} from './analyticsUtils'
// import {
//   DateRangeFields,
//   PeriodControls,
//   SectionTitle,
// } from './AnalyticsPage'

function InsightsTab({
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
  data,
}) {

  return (
    // <div className="grid gap-6">
    //   <PeriodControls
    //     label="Comparison"
    //     value={period}
    //     options={insightPeriods}
    //     onChange={onPeriodChange}
    //   />

    //   {period === 'custom' ? (
    //     <DateRangeFields
    //       values={customRange}
    //       fields={[
    //         { key: 'currentFrom', label: 'Current from' },
    //         { key: 'currentTo', label: 'Current to' },
    //         { key: 'previousFrom', label: 'Previous from' },
    //         { key: 'previousTo', label: 'Previous to' },
    //       ]}
    //       onChange={onCustomRangeChange}
    //     />
    //   ) : null}

    //   <FinancialStory
    //     incomeChange={incomeChange}
    //     expenseChange={expenseChange}
    //     savingsChange={savingsChange}
    //     improved={improved}
    //     attention={attention}
    //   />

    //   <section className="grid gap-4 md:grid-cols-3">
    //     <TrendCard label="Income Trend" value={incomeChange} inverted={false} />
    //     <TrendCard label="Expense Trend" value={expenseChange} inverted />
    //     <TrendCard label="Savings Trend" value={savingsChange} inverted={false} />
    //   </section>

    //   <section className="grid gap-6 lg:grid-cols-2">
    //     <InsightList
    //       title="What Improved?"
    //       icon={TrendingDown}
    //       emptyText="No spending reductions found for this comparison."
    //       items={improved.map((item) => ({
    //         label: item.label,
    //         text: `Reduced by ${formatCurrency(Math.abs(item.delta))}`,
    //       }))}
    //     />
    //     <InsightList
    //       title="What Needs Attention?"
    //       icon={ArrowUpRight}
    //       emptyText="No meaningful spending increases found."
    //       items={attention.map((item) => ({
    //         label: item.label,
    //         text: `Increased by ${formatCurrency(item.delta)}`,
    //       }))}
    //     />
    //   </section>

    //   <InsightList
    //     title="Income Changes"
    //     icon={CircleDollarSign}
    //     emptyText="No income changes found for this comparison."
    //     items={incomeChanges.map((item) => ({
    //       label: item.label,
    //       text: item.delta > 0
    //         ? `Increased by ${formatCurrency(item.delta)}`
    //         : `Decreased by ${formatCurrency(Math.abs(item.delta))}`,
    //     }))}
    //   />

    //   <JourneyChart data={data.journey} />

    //   <CategoryInsights items={[...improved, ...attention].slice(0, 6)} />
    // </div>
    <div>
      Insights tab
    </div>
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

export default InsightsTab
