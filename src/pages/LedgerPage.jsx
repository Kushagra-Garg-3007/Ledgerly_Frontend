import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import Button from '../components/common/Button'
import LedgerTable from '../components/shared/LedgerTable'
import LedgerSummaryCards from '../components/ledger/LedgerSummaryCards'
import LedgerFilters from '../components/ledger/LedgerFilters'
import LedgerRowActions from '../components/ledger/LedgerRowActions'
import LedgerEntryModal from '../components/ledger/LedgerEntryModal'
import LedgerDetailsModal from '../components/ledger/LedgerDetailsModal'
import { useLedgerData } from '../hooks/useLedgerData'
import { useLedgerEntryModal } from '../hooks/useLedgerEntryModal'

function LedgerPage() {
  const ledger = useLedgerData()
  const entryModal = useLedgerEntryModal(ledger)
  const [detailsEntry, setDetailsEntry] = useState(null)

  return (
    <div className="pb-4 text-[#1f1814]">
      <PageBackground />

      <section className="mx-auto max-w-7xl">
        <PageHeader />

        <LedgerSummaryCards
          summary={ledger.summary}
          loading={ledger.summaryLoading}
        />

        <div className="mt-6">
          <LedgerFilters
            filters={ledger.filters}
            categories={ledger.categories}
            onFilterChange={ledger.handleFilterChange}
          />
        </div>

        <section className="mt-6 rounded-[1.6rem] border border-[#e4d8ca] bg-white/75 p-5 shadow-[0_16px_38px_rgba(42,28,20,0.07)] backdrop-blur-xl sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#231b16]">
              Ledger Entries
            </h3>

            {!ledger.transactionsLoading ? (
              <p className="text-xs text-[#7b6f66]">
                Showing {ledger.entries.length} out of {ledger.totalEntries}
              </p>
            ) : null}
          </div>

          <LedgerTable
            data={ledger.entries}
            loading={ledger.transactionsLoading}
            sortKey={ledger.sortConfig.key}
            sortDirection={ledger.sortConfig.direction}
            onSortChange={ledger.handleTableSortChange}
            categoryClassByName={ledger.categoryClassByName}
            renderRowActions={(row) => (
              <LedgerRowActions
                onViewDetails={() => setDetailsEntry(row)}
                onEditEntry={() => entryModal.openEdit(row)}
              />
            )}
            emptyTitle="No ledger entries found"
            emptyDescription={ledger.transactionsError || 'Try adjusting filters or add a new entry.'}
          />

          {!ledger.transactionsLoading && ledger.totalEntries > 0 ? (
            <Pagination
              currentPage={ledger.currentPage}
              totalPages={ledger.totalPages}
              onPageChange={ledger.setCurrentPage}
            />
          ) : null}
        </section>
      </section>

      <LedgerEntryModal
        open={entryModal.open}
        values={entryModal.form}
        errors={entryModal.errors}
        categories={ledger.categoryNames}
        loading={entryModal.submitting}
        creatingCategory={entryModal.creatingCategory}
        submitError={entryModal.submitError}
        activeEntry={entryModal.activeEntry}
        confirmingCategoryUpdate={entryModal.confirmingCategoryUpdate}
        onChange={entryModal.handleChange}
        onCreateCategory={entryModal.handleCreateCategory}
        onClose={entryModal.close}
        onSubmit={entryModal.handleSubmit}
        onConfirmSingleRowUpdate={entryModal.handleConfirmSingleRowUpdate}
        onConfirmMatchingEntityUpdate={entryModal.handleConfirmMatchingEntityUpdate}
        onCancelCategoryConfirmation={entryModal.handleCancelCategoryConfirmation}
      />

      <LedgerDetailsModal
        entry={detailsEntry}
        open={Boolean(detailsEntry)}
        onClose={() => setDetailsEntry(null)}
      />
    </div>
  )
}

export default LedgerPage

// ---------------------------------------------------------------------------
// Small layout sub-components extracted to reduce noise in the main render
// ---------------------------------------------------------------------------

function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 top-24 h-[18rem] w-[18rem] rounded-full bg-amber-200/25 blur-3xl" />
      <div className="absolute right-[-6rem] top-[16rem] h-[20rem] w-[20rem] rounded-full bg-sky-200/25 blur-3xl" />
      <div className="absolute left-1/3 top-[34rem] h-[14rem] w-[14rem] rounded-full bg-emerald-200/25 blur-3xl" />
    </div>
  )
}

function PageHeader() {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d5c5]/90 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6657] shadow-[0_8px_20px_rgba(40,28,20,0.05)] backdrop-blur-xl">
          <BookOpen size={13} />
          Ledger Workspace
        </div>

        <h1 className="mt-9 text-4xl font-bold tracking-[-0.05em] text-[#1f1814] sm:text-5xl">
          Ledger
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6a5d55] sm:text-base">
          Review all debit and credit entries, apply filters, and manage transaction notes.
        </p>
      </div>
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-[#7b6f66]">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-lg"
          disabled={currentPage <= 1}
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="rounded-lg"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
