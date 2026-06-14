import { useState } from 'react'
import { createCategory } from '../api/categoryApi'
import {
  updateSingleTransaction,
  updateTransactionsByEntity
} from '../api/transactionApi'
import { errorToast, successToast, warningToast } from '../utils/toast'

const EMPTY_FORM = { category: '', notes: '' }
const EMPTY_ERRORS = { category: '' }

const toPayloadId = (value) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? value : parsed
}

export function useLedgerEntryModal({
  categories,
  applyEntryUpdate,
  applyEntityCategoryUpdate,
  addCategoryIfNew,
  refreshCategories
}) {
  const [open, setOpen] = useState(false)
  const [activeEntry, setActiveEntry] = useState(null)
  const [activeEntryId, setActiveEntryId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState(EMPTY_ERRORS)
  const [submitting, setSubmitting] = useState(false)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmingCategoryUpdate, setConfirmingCategoryUpdate] =
    useState(false)

  const openEdit = (entry) => {
    setActiveEntry(entry)
    setActiveEntryId(entry.id)
    setForm({ category: entry.category || '', notes: entry.note || '' })
    setErrors(EMPTY_ERRORS)
    setSubmitError('')
    setConfirmingCategoryUpdate(false)
    setOpen(true)
  }

  const close = () => {
    if (submitting || creatingCategory) return
    setOpen(false)
    setConfirmingCategoryUpdate(false)
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setSubmitError('')
  }

  const validate = () => {
    const next = { category: '' }

    if (!form.category) {
      next.category = 'Please select a category.'
    }

    setErrors(next)
    return !next.category
  }

  const selectedCategory = categories.find(
    (category) => category.name === form.category
  )

  const buildPayload = () => ({
    entityId: toPayloadId(activeEntry?.entityId),
    categoryId: toPayloadId(selectedCategory?.id ?? activeEntry?.categoryId),
    rawTransactionId: toPayloadId(activeEntryId),
    note: form.notes.trim() || null
  })

  const submitSingleRowUpdate = async () => {
    setSubmitting(true)
    setSubmitError('')

    const payload = buildPayload()

    applyEntryUpdate(activeEntryId, {
      category: form.category,
      categoryId: selectedCategory?.id ?? activeEntry?.categoryId,
      note: form.notes.trim() || null
    })

    try {
      await updateSingleTransaction(payload)
      successToast('Entry updated successfully.')
      addCategoryIfNew(form.category)
      setConfirmingCategoryUpdate(false)
      setOpen(false)
    } catch (err) {
      warningToast('Updated locally. Backend sync failed.')
      setSubmitError(err.message)
      errorToast(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const submitMatchingEntityUpdate = async () => {
    setSubmitting(true)
    setSubmitError('')

    const payload = buildPayload()

    applyEntityCategoryUpdate(activeEntry?.entityId, {
      category: form.category,
      categoryId: selectedCategory?.id ?? activeEntry?.categoryId
    })

    try {
      await updateTransactionsByEntity(payload)
      successToast('Matching entity transactions updated successfully.')
      addCategoryIfNew(form.category)
      setConfirmingCategoryUpdate(false)
      setOpen(false)
    } catch (err) {
      warningToast('Updated locally. Backend sync failed.')
      setSubmitError(err.message)
      errorToast(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return

    if (activeEntry && activeEntry.category !== form.category) {
      setConfirmingCategoryUpdate(true)
      return
    }

    await submitSingleRowUpdate()
  }

  const handleCreateCategory = async (name) => {
    const trimmedName = name.trim()
    if (!trimmedName || creatingCategory) return

    setCreatingCategory(true)
    setSubmitError('')

    try {
      await createCategory({ name: trimmedName })
      const refreshedCategories = await refreshCategories()
      const createdCategory = refreshedCategories.find(
        (category) => category.name.toLowerCase() === trimmedName.toLowerCase()
      )

      handleChange('category', createdCategory?.name || trimmedName)
      successToast('Category created successfully.')
    } catch (err) {
      setSubmitError(err.message)
      errorToast(err.message)
    } finally {
      setCreatingCategory(false)
    }
  }

  const handleCancelCategoryConfirmation = () => {
    if (submitting) return
    setConfirmingCategoryUpdate(false)
  }

  return {
    open,
    form,
    errors,
    submitting,
    creatingCategory,
    submitError,
    activeEntry,
    confirmingCategoryUpdate,
    openEdit,
    close,
    handleChange,
    handleSubmit,
    handleCreateCategory,
    handleConfirmSingleRowUpdate: submitSingleRowUpdate,
    handleConfirmMatchingEntityUpdate: submitMatchingEntityUpdate,
    handleCancelCategoryConfirmation
  }
}
