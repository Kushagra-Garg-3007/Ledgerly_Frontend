import { useEffect, useState } from 'react'
import { Edit2, Plus, Tags, Trash2, X } from 'lucide-react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../api/categoryApi'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import SkeletonCard from '../components/skeletons/SkeletonCard'
import { successToast, errorToast, warningToast } from '../utils/toast'
import categoryColors from '../constants/categoryColors.js'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [categorySubmitting, setCategorySubmitting] = useState(false)

  const isMiscCategory = (category) =>
    category?.name?.trim().toLowerCase() === 'misc'

  const loadCategories = async () => {
    setCategoriesLoading(true)

    try {
      const response = await getCategories()

      if (!Array.isArray(response)) {
        setCategories([])
        return
      }

      const mapped = response.map((item, index) => ({
        id: item.id,
        name: item.name,
        color: categoryColors[index % categoryColors.length].value,
        transactionCount: Number(item.items || 0)
      }))

      setCategories(mapped)
    } catch (error) {
      setCategories([])
      errorToast(error.message)
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleAddCategory = async () => {
    const name = newCategoryName.trim()

    if (!name || categorySubmitting) return

    setCategorySubmitting(true)

    try {
      await createCategory({ name })

      setNewCategoryName('')
      setIsAddingCategory(false)

      await loadCategories()

      successToast('Category created successfully.')
    } catch (error) {
      errorToast(error.message)
    } finally {
      setCategorySubmitting(false)
    }
  }

  const handleEditCategory = (id) => {
    const target = categories.find((item) => item.id === id)
    if (!target || isMiscCategory(target)) return

    setEditingId(id)
    setEditingName(target.name)
  }

  const handleSaveEdit = async (id) => {
    const name = editingName.trim()

    if (!name || categorySubmitting) return

    setCategorySubmitting(true)

    try {
      await updateCategory(id, { name })

      setEditingId(null)
      setEditingName('')

      await loadCategories()

      successToast('Category updated successfully.')
    } catch (error) {
      errorToast(error.message)
    } finally {
      setCategorySubmitting(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!id || categorySubmitting) return

    const category = categories.find((item) => item.id === id)
    if (category && category.transactionCount > 0) {
      warningToast(
        'Please unmap this category from transactions on the Ledger page first, then try deleting.'
      )
      return
    }

    setCategorySubmitting(true)

    try {
      await deleteCategory(id)

      setDeletingId(null)

      await loadCategories()

      successToast('Category deleted successfully.')
    } catch (error) {
      errorToast(error.message)
    } finally {
      setCategorySubmitting(false)
    }
  }

  return (
    <div className="pb-4 text-[#1f1814]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-24 h-[17rem] w-[17rem] rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute right-[-6rem] top-[16rem] h-[19rem] w-[19rem] rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute left-1/3 top-[34rem] h-[14rem] w-[14rem] rounded-full bg-blue-200/25 blur-3xl" />
      </div>

      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2d5c5]/90 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6657] shadow-[0_8px_20px_rgba(40,28,20,0.05)] backdrop-blur-xl">
              <Tags size={13} />
              Category Workspace
            </div>

            <h1 className="mt-9 text-4xl font-bold tracking-[-0.05em] text-[#1f1814] sm:text-5xl">
              Manage Categories
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6a5d55] sm:text-base">
              Create and organize transaction categories to keep your ledger
              clean and searchable.
            </p>
          </div>

          <Button
            onClick={() => setIsAddingCategory(true)}
            disabled={categoriesLoading || categorySubmitting}
            className="rounded-xl px-5"
          >
            <Plus size={16} />
            Add Category
          </Button>
        </div>

        {isAddingCategory && (
          <Card className="mb-6 rounded-[1.6rem] border-[#e4d7c9] bg-white/75 p-1">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Input
                name="new-category-name"
                label="Category Name"
                placeholder="e.g. Subscriptions, Medical, Travel"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || categorySubmitting}
                  className="rounded-xl px-5"
                >
                  Save
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCategory(false)
                    setNewCategoryName('')
                  }}
                  className="rounded-xl px-5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {categoriesLoading ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard
                key={index}
                className="rounded-[1.4rem]"
                lines={2}
              />
            ))}
          </section>
        ) : categories.length === 0 ? (
          <Card className="rounded-[1.4rem] border-[#e4d8cb] bg-white/75 p-8 text-center">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#1f1814]">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-[#72645a]">
              Add your first category to begin organizing transactions.
            </p>
          </Card>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const protectedCategory = isMiscCategory(category)

              return (
                <Card
                  key={category.id}
                  className="group rounded-[1.4rem] border-[#e4d8cb] bg-white/75 p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border font-semibold ${category.color}`}
                    >
                      {category.name[0]}
                    </div>

                    {editingId !== category.id && !protectedCategory && (
                      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleEditCategory(category.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5d8c9] bg-white/80 text-[#6b5a4f] transition-colors hover:bg-[#faf5ee]"
                          title="Edit category"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(category.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50/80 text-rose-700 transition-colors hover:bg-rose-100"
                          title="Delete category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === category.id ? (
                    <div className="space-y-3">
                      <Input
                        name={`edit-category-${category.id}`}
                        value={editingName}
                        placeholder="Category name"
                        onChange={(event) => setEditingName(event.target.value)}
                      />

                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(category.id)}
                          disabled={categorySubmitting}
                          className="flex-1 rounded-lg"
                        >
                          Save
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => {
                            setEditingId(null)
                            setEditingName('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#1f1814]">
                          {category.name}
                        </h3>

                        {protectedCategory ? (
                          <span className="rounded-full border border-[#e5d8c9] bg-[#f8f4ef] px-2 py-0.5 text-xs font-semibold text-[#7a6657]">
                            Default
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm text-[#72645a]">
                        {category.transactionCount} transaction
                        {category.transactionCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </Card>
              )
            })}
          </section>
        )}
      </section>

      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1814]/28 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-[#e6dbcf] bg-white p-6 shadow-[0_24px_60px_rgba(28,20,14,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-2xl font-semibold tracking-[-0.04em] text-[#241c17]">
                  Delete Category?
                </h4>

                <p className="mt-3 text-sm leading-6 text-[#66584f]">
                  This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-lg border border-[#e4d8ca] bg-white/80 p-2 text-[#6a5c52]"
                aria-label="Close delete dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-[#e7dbce] bg-white/75 px-4 py-3 text-sm text-[#5d5047]">
              <p className="font-semibold text-[#3b3028]">
                {categories.find((item) => item.id === deletingId)?.name ||
                  'Selected category'}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-xl px-5"
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                className="rounded-xl px-5"
                onClick={() => handleDeleteCategory(deletingId)}
                disabled={categorySubmitting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
