function EmptyState({
  icon = '[ ]',
  title = 'No data found',
  description = 'Try refreshing or adding new data.',
}) {
  return (
    <div className="rounded-2xl border border-[#d8caba] bg-[#f8f2eb] p-10 text-center shadow-[0_6px_14px_rgba(40,28,20,0.08)]">
      <p className="text-3xl text-[#8b7d75]">{icon}</p>
      <h3 className="mt-3 text-base font-bold tracking-[-0.03em] text-[#1f1814]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#6b5e57]">{description}</p>
    </div>
  )
}

export default EmptyState
