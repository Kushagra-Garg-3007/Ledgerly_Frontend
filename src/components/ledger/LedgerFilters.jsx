import { Search } from 'lucide-react'
import Input from '../common/Input'

const controlClassName = `
  w-full
  rounded-md
  border border-[#d7c8b8]
  bg-[#f6f1ea]
  px-3 py-[0.6rem]
  text-sm font-medium text-[#241b17]
  shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]
  outline-none transition-all duration-200 ease-out
  hover:border-[#c9b7a5] hover:bg-[#f8f4ee]
  focus:border-[#b79d89] focus:bg-[#faf7f2] focus:ring-2 focus:ring-[#d8c0aa]/30
`

function LedgerFilters({
  filters,
  categories,
  onFilterChange,
}) {
  return (
    <section className="rounded-[1.5rem] border border-[#e4d8cb] bg-white/76 p-5 shadow-[0_12px_30px_rgba(40,28,20,0.06)] backdrop-blur-xl">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Input
            name="ledger-search"
            label="Search"
            placeholder="Search notes, category, type..."
            value={filters.search}
            onChange={(event) => onFilterChange('search', event.target.value)}
            rightElement={<Search size={16} />}
          />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="ledger-from-date"
            className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-[#4a3d36]"
          >
            From Date
          </label>
          <input
            id="ledger-from-date"
            type="date"
            className={controlClassName}
            value={filters.fromDate}
            onChange={(event) => onFilterChange('fromDate', event.target.value)}
          />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="ledger-to-date"
            className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-[#4a3d36]"
          >
            To Date
          </label>
          <input
            id="ledger-to-date"
            type="date"
            className={controlClassName}
            value={filters.toDate}
            onChange={(event) => onFilterChange('toDate', event.target.value)}
          />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="ledger-type-filter"
            className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-[#4a3d36]"
          >
            Type
          </label>
          <select
            id="ledger-type-filter"
            className={controlClassName}
            value={filters.type}
            onChange={(event) => onFilterChange('type', event.target.value)}
          >
            <option value="all">All</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="ledger-category-filter"
            className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-[#4a3d36]"
          >
            Category
          </label>
          <select
            id="ledger-category-filter"
            className={controlClassName}
            value={filters.category}
            onChange={(event) => onFilterChange('category', event.target.value)}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-3">
          <label
            htmlFor="ledger-sort-filter"
            className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-[#4a3d36]"
          >
            Sort
          </label>
          <select
            id="ledger-sort-filter"
            className={controlClassName}
            value={filters.sort}
            onChange={(event) => onFilterChange('sort', event.target.value)}
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
          </select>
        </div>
      </div>
    </section>
  )
}

export default LedgerFilters
