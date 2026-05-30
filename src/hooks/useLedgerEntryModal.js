import { useState } from 'react'
import { updateTransaction } from '../api/transactionApi'
import { errorToast, successToast, warningToast } from '../utils/toast'

const EMPTY_FORM   = { category: '', notes: '' }
const EMPTY_ERRORS = { category: '' }

export function useLedgerEntryModal({ applyEntryUpdate, addCategoryIfNew }) {
  const [open, setOpen]               = useState(false)
  const [activeEntryId, setActiveEntryId] = useState(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [errors, setErrors]           = useState(EMPTY_ERRORS)
  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState('')

  // ── Open / close ──────────────────────────────────────────────────────────

  const openEdit = (entry) => {
    setActiveEntryId(entry.id)
    setForm({ category: entry.category || '', notes: entry.note || '' })
    setErrors(EMPTY_ERRORS)
    setSubmitError('')
    setOpen(true)
  }

  const close = () => {
    if (submitting) return
    setOpen(false)
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setSubmitError('')
  }

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const next = { category: '' }

    if (!form.category) {
      next.category = 'Please select a category.'
    }

    setErrors(next)
    return !next.category
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    const payload = {
      category: form.category,
      note: form.notes.trim() || null,     // empty string → null for backend
    }

    // optimistic update — table reflects change instantly
    applyEntryUpdate(activeEntryId, {
      category: form.category,
      note: form.notes.trim() || null,
    })

    try {
      await updateTransaction(activeEntryId, payload)
      successToast('Entry updated successfully.')
      addCategoryIfNew(form.category)
      setOpen(false)
    } catch (err) {
      warningToast('Updated locally. Backend sync failed.')
      setSubmitError(err.message)
      errorToast(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    open,
    form,
    errors,
    submitting,
    submitError,
    openEdit,
    close,
    handleChange,
    handleSubmit,
  }
}
