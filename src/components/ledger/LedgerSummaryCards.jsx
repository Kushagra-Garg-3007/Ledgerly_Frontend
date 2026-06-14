import Card from '../common/Card'
import SkeletonCard from '../skeletons/SkeletonCard'

function formatAmount(value = 0) {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function LedgerSummaryCards({ summary, loading = false }) {
  if (loading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard
            key={index}
            className="rounded-[1.4rem]"
            lines={1}
            subtitle={false}
          />
        ))}
      </section>
    )
  }

  const cards = [
    {
      id: 'credit',
      label: 'Total Credit',
      value: formatAmount(summary.totalCredit),
      tone: 'text-emerald-700'
    },
    {
      id: 'debit',
      label: 'Total Debit',
      value: formatAmount(summary.totalDebit),
      tone: 'text-rose-700'
    },
    {
      id: 'balance',
      label: 'Current Balance',
      value: formatAmount(summary.balance),
      tone: 'text-[#2f2621]'
    },
    {
      id: 'totalTransactions',
      label: 'Total Transactions',
      value: Number(summary.transactionCount || 0).toLocaleString('en-IN'),
      tone: 'text-[#2f2621]'
    }
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          className="rounded-[1.4rem] border-[#e4d8cb] bg-white/78 p-1"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b7d75]">
            {card.label}
          </p>
          <p
            className={`mt-3 text-2xl font-bold tracking-[-0.04em] ${card.tone}`}
          >
            {card.value}
          </p>
        </Card>
      ))}
    </section>
  )
}

export default LedgerSummaryCards
