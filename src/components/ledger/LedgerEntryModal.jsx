import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '../common/Button'
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

function LedgerEntryModal({
  open,
  mode = 'add',
  values,
  errors,
  categories,
  loading,
  creatingCategory = false,
  submitError,
  activeEntry,
  confirmingCategoryUpdate = false,
  onChange,
  onCreateCategory,
  onClose,
  onSubmit,
  onConfirmSingleRowUpdate,
  onConfirmMatchingEntityUpdate,
  onCancelCategoryConfirmation,
}) {
  const [newCategoryName, setNewCategoryName] = useState('')

  if (!open) return null

  const title = mode === 'edit' ? 'Edit Ledger Entry' : 'Add Ledger Entry'
  const helperText = mode === 'edit'
    ? 'Update the category and notes for this transaction.'
    : 'Add a quick ledger note using category and description.'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1814]/28 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[1.75rem] border border-[#e6dbcf] bg-white p-6 shadow-[0_24px_60px_rgba(28,20,14,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-2xl font-semibold tracking-[-0.04em] text-[#241c17]">
              {title}
            </h4>
            <p className="mt-3 text-sm leading-6 text-[#66584f]">{helperText}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e4d8ca] bg-white/80 p-2 text-[#6a5c52]"
            aria-label="Close ledger entry modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label
              htmlFor="ledger-entry-category"
              className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-[#4a3d36]"
            >
              Category
            </label>
            <select
              id="ledger-entry-category"
              className={controlClassName}
              value={values.category}
              onChange={(event) => onChange('category', event.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-2 pl-1 text-xs font-medium text-red-600">{errors.category}</p>
            ) : null}

            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input
                name="ledger-new-category"
                placeholder="Create new category"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
              />

              <Button
                variant="outline"
                className="rounded-xl px-4"
                loading={creatingCategory}
                disabled={!newCategoryName.trim() || creatingCategory || loading}
                onClick={async () => {
                  await onCreateCategory(newCategoryName)
                  setNewCategoryName('')
                }}
              >
                Create
              </Button>
            </div>
          </div>

          <Input
            name="ledger-entry-notes"
            label="Notes"
            placeholder="Enter transaction notes or description"
            value={values.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            error={errors.notes}
          />
        </div>

        {submitError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {submitError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-5"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="rounded-xl px-5"
            onClick={onSubmit}
            loading={loading}
            disabled={loading}
          >
            {mode === 'edit' ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      </div>

      {confirmingCategoryUpdate ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1f1814]/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.5rem] border border-[#e6dbcf] bg-white p-6 shadow-[0_24px_60px_rgba(28,20,14,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-semibold tracking-[-0.03em] text-[#241c17]">
                  Update Category
                </h4>

                <p className="mt-3 text-sm leading-6 text-[#66584f]">
                  Do you want to update the category only for this transaction, or for all transactions with entity '{activeEntry?.entityName || activeEntry?.description}'?
                </p>
              </div>

              <button
                type="button"
                onClick={onCancelCategoryConfirmation}
                className="rounded-lg border border-[#e4d8ca] bg-white/80 p-2 text-[#6a5c52]"
                aria-label="Close category update confirmation"
                disabled={loading}
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-xl px-5"
                onClick={onCancelCategoryConfirmation}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                variant="outline"
                className="rounded-xl px-5"
                onClick={onConfirmSingleRowUpdate}
                disabled={loading}
              >
                Update This Row Only
              </Button>

              <Button
                className="rounded-xl px-5"
                onClick={onConfirmMatchingEntityUpdate}
                loading={loading}
                disabled={loading}
              >
                Update All Matching Entities
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default LedgerEntryModal
