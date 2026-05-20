import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, CloudUpload, FileCheck2, FileSpreadsheet, FileText, HardDriveUpload, LoaderCircle, Sparkles, UploadCloud, CalendarDays, X } from 'lucide-react'
import Button from '../components/common/Button'
import DataTable from '../components/shared/DataTable'
import Skeleton from '../components/skeletons/Skeleton'
import SkeletonTable from '../components/skeletons/SkeletonTable'
import { uploadFile, getRecentUploads, } from '../api/uploadApi'
import { errorToast } from '../utils/toast'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['xlsx', 'xls', 'csv']

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getFileExtension(fileName = '') {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

function getFileTypeLabel(fileName = '') {
  const extension = getFileExtension(fileName)
  return extension ? extension.toUpperCase() : 'FILE'
}

function statusBadgeClasses(status = '') {
  if (status === 'Processed') {
    return 'border-[#b8e2ce] bg-emerald-50 text-emerald-800'
  }

  if (status === 'Failed') {
    return 'border-[#efc8c8] bg-rose-50 text-rose-800'
  }

  if (status === 'Uploading') {
    return 'border-[#decfbf] bg-[#f9f3ea] text-[#6d5848]'
  }

  if (status === 'Processing') {
    return 'border-[#d9d0c5] bg-[#f7f2eb] text-[#5e534a]'
  }

  return 'border-[#e5d6c4] bg-[#f7f0e7] text-[#6a5646]'
}

function UploadPage() {
  const inputRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [uploadResponse, setUploadResponse] = useState(null)
  const [recentUploads, setRecentUploads] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const totalUploads = recentUploads.length

  const failedUploads = recentUploads.filter(
    (item) => item.status === 'Failed'
  ).length

  const processingUploads = recentUploads.filter(
    (item) => item.status === 'Processing'
  ).length

  const completedUploads = recentUploads.filter(
    (item) => item.status === 'Processed'
  ).length

  const lastProcessed =
    recentUploads.find((item) => item.status === 'Processed')
      ?.fileName || 'No file processed yet'

  const backendStatusNote = uploadResponse?.message || ''
  const backendReferenceId = uploadResponse?.id || ''

  const fetchRecentUploads = async () => {
    setLoading(true)

    try {
      const data = await getRecentUploads()
      setRecentUploads(Array.isArray(data) ? data : [])
    } catch (error) {
      setRecentUploads([])
      errorToast(error.message)
    } finally {
      setLoading(false)
      setHasLoadedOnce(true)
    }
  }

  useEffect(() => {
    fetchRecentUploads()
  }, [])

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setUploadStatus('idle')
    setUploadProgress(0)
    setUploadResponse(null)
    setShowConfirmModal(false)
  }

  const validateFile = (file) => {
    const extension = getFileExtension(file.name)

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Unsupported file type. Please upload XLSX, XLS, or CSV.'
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File size too large. Maximum allowed size is 10 MB.'
    }

    return ''
  }

  const selectFile = (file) => {
    if (!file) return

    const validationError = validateFile(file)

    if (validationError) {
      clearSelectedFile()
      errorToast(validationError)
      return
    }

    setUploadResponse(null)
    setSelectedFile(file)
    setUploadStatus('ready')
    setUploadProgress(0)
  }

  const onDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    selectFile(event.dataTransfer.files?.[0])
  }

  const onFileChange = (event) => {
    selectFile(event.target.files?.[0])
    event.target.value = ''
  }

  const startUpload = async () => {
    if (!selectedFile) {
      errorToast('Please choose a file before starting analysis.')
      return
    }

    setShowConfirmModal(false)
    setUploadResponse(null)

    setUploadStatus('uploading')
    setUploadProgress(0)

    try {
      const response = await uploadFile(
        selectedFile,
        (progressEvent) => {
          if (!progressEvent.total) return

          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          )

          setUploadProgress(Math.min(100, percent))
        }
      )

      setUploadResponse(response)
      setUploadProgress(100)

      if (response?.status === 'Failed') {
        setUploadStatus('idle')

        errorToast(
          response?.message || 'Upload failed. Please try again.'
        )

        return
      }

      if (response?.status === 'Processing') {
        setUploadStatus('processing')
      } else if (response?.status === 'Processed') {
        setUploadStatus('processed')
      } else {
        setUploadStatus('processed')
      }

      await fetchRecentUploads()
    } catch (error) {
      setUploadStatus('idle')
      errorToast(error?.message)
    }
  }

  const recentUploadColumns = [
    {
      label: 'File Name',
      key: 'fileName',
      cellClassName: 'font-medium text-[#3f342d]',
    },
    {
      label: 'Upload Date',
      key: 'uploadDate',
      cellClassName: 'text-[#6e6158]',
    },
    {
      label: 'Status',
      key: 'status',
      cell: (value) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      label: 'Type',
      key: 'type',
      cellClassName: 'text-[#6e6158]',
    },
  ]

  const showIdleState =
    !selectedFile && uploadStatus === 'idle'

  const showPreviewState =
    !!selectedFile && uploadStatus === 'ready'

  const showUploadProgressState =
    uploadStatus === 'uploading'

  const showProcessingState =
    uploadStatus === 'processing'

  const showCompletedState =
    uploadStatus === 'processed'

  const showInitialDataSkeleton = loading && !hasLoadedOnce

  return (
    <div className="pb-4 text-[#1f1814]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-24 h-[18rem] w-[18rem] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute right-[-5rem] top-[16rem] h-[20rem] w-[20rem] rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute left-1/3 top-[32rem] h-[14rem] w-[14rem] rounded-full bg-stone-200/40 blur-3xl" />
      </div>

      <section className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d6c8]/80 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6657] shadow-[0_8px_20px_rgba(40,28,20,0.05)] backdrop-blur-xl">
          <Sparkles size={14} />
          Secure Upload Workspace
        </div>

        <h1 className="mt-5 font-heading text-4xl font-bold tracking-[-0.05em] text-[#1f1814] sm:text-5xl">
          Upload Your Financial Data
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#665a52] sm:text-lg">
          Import Excel or CSV files to generate analytics,
          insights, and smart categorization with
          backend-verified processing.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
        {/* LEFT SIDE */}
        <div className="rounded-[1.65rem] border border-[#e3d7c9] bg-white/65 p-5 shadow-[0_18px_45px_rgba(45,32,20,0.08)] backdrop-blur-2xl sm:p-7">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#211a15]">
              Upload Statement
            </h2>

            <p className="mt-1 text-sm text-[#7a6c63]">
              Drag and drop or choose a spreadsheet file to continue.
            </p>
          </div>

          <div
            onDrop={onDrop}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`
              relative overflow-hidden rounded-[1.35rem]
              border-2 border-dashed p-7 text-center
              transition-all duration-300 sm:p-10

              ${isDragging
                ? 'border-[#8f715d] bg-[#fbf5ed]'
                : 'border-[#d6c8b8] bg-[#fdfaf5]'
              }

              ${showCompletedState
                ? 'border-emerald-300 bg-emerald-50/70'
                : ''
              }
            `}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e1d4c6] bg-white text-[#776559] shadow-sm">
              {showUploadProgressState || showProcessingState ? (
                <LoaderCircle
                  className="animate-spin"
                  size={24}
                />
              ) : showCompletedState ? (
                <CheckCircle2
                  size={24}
                  className="text-emerald-700"
                />
              ) : (
                <UploadCloud size={24} />
              )}
            </div>

            {showIdleState && (
              <div className="mx-auto max-w-md">
                <p className="text-xl font-semibold tracking-[-0.02em] text-[#241d18]">
                  Drag and Drop your files here
                </p>

                <p className="mt-2 text-sm text-[#6f6258]">
                  Supports .xlsx, .xls, and .csv files
                </p>
              </div>
            )}

            {showPreviewState && selectedFile && (
              <div className="mx-auto max-w-md text-left">
                <p className="text-center text-lg font-semibold tracking-[-0.02em] text-[#241d18]">
                  File Ready for Analysis
                </p>

                <div className="mt-4 rounded-2xl border border-[#e5d9ca] bg-white/90 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-[#f4ede4] p-2 text-[#755e4e]">
                        <FileSpreadsheet size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#2f241d]">
                          {selectedFile.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[#6c5f55]">
                          {formatFileSize(selectedFile.size)} ·{' '}
                          {getFileTypeLabel(selectedFile.name)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="rounded-lg border border-[#e6d6c8] bg-[#faf5ee] px-2.5 py-1.5 text-xs font-semibold text-[#6b5a4f]"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    className="rounded-xl px-6"
                    onClick={() =>
                      setShowConfirmModal(true)
                    }
                  >
                    <Sparkles size={16} />
                    Analyze File
                  </Button>
                </div>
              </div>
            )}

            {showUploadProgressState && selectedFile && (
              <div className="mx-auto max-w-md">
                <p className="text-lg font-semibold tracking-[-0.02em] text-[#241d18]">
                  Uploading {selectedFile.name}
                </p>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#e7dbce]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6d5547] via-[#8a6b58] to-[#b08b74]"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#6c5f55]">
                  <span>Upload Progress</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            )}

            {showProcessingState && (
              <div className="mx-auto max-w-md">
                <p className="text-lg font-semibold tracking-[-0.02em] text-[#241d18]">
                  Processing your file
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#e2d4c6] bg-white px-4 py-2 text-sm font-medium text-[#6b5a4f]">
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                  Processing...
                </div>

                {(backendStatusNote ||
                  backendReferenceId) && (
                    <p className="mt-3 text-xs text-[#7a6c63]">
                      {backendStatusNote ||
                        `Reference: ${backendReferenceId}`}
                    </p>
                  )}
              </div>
            )}

            {showCompletedState && selectedFile && (
              <div className="mx-auto max-w-md">
                <p className="text-lg font-semibold tracking-[-0.02em] text-[#1f2a20]">
                  File analyzed successfully
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              className="rounded-xl px-6"
              onClick={() => inputRef.current?.click()}
              disabled={
                showUploadProgressState ||
                showProcessingState
              }
            >
              <CloudUpload size={17} />
              Choose File
            </Button>

            <p className="text-xs text-[#7b6f66]">
              Max size: 10 MB
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="rounded-[1.4rem] border border-[#e5d8cb] bg-white/70 p-5 shadow-[0_14px_30px_rgba(40,28,20,0.07)] backdrop-blur-xl">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[#221a16]">
            Upload Snapshot
          </h3>

          {showInitialDataSkeleton ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[#e6dbce] bg-[#faf5ee] p-3"
                  >
                    <Skeleton className="h-3 w-20 rounded-full" />
                    <Skeleton className="mt-2 h-6 w-10 rounded-md" />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-[#e5d9ca] bg-white p-4">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="mt-3 h-4 w-40 rounded-full" />
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-[#e6dbce] bg-[#faf5ee] p-3">
                  <p className="text-xs text-[#7d6f66]">Total uploads</p>
                  <p className="mt-1 text-xl font-semibold text-[#221a16]">{totalUploads}</p>
                </div>

                <div className="rounded-xl border border-[#e6dbce] bg-[#faf5ee] p-3">
                  <p className="text-xs text-[#7d6f66]">Failed</p>
                  <p className="mt-1 text-xl font-semibold text-[#221a16]">{failedUploads}</p>
                </div>

                <div className="rounded-xl border border-[#e6dbce] bg-[#faf5ee] p-3">
                  <p className="text-xs text-[#7d6f66]">Processing</p>
                  <p className="mt-1 text-xl font-semibold text-[#221a16]">{processingUploads}</p>
                </div>

                <div className="rounded-xl border border-[#e6dbce] bg-[#faf5ee] p-3">
                  <p className="text-xs text-[#7d6f66]">Completed</p>
                  <p className="mt-1 text-xl font-semibold text-[#221a16]">{completedUploads}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#e5d9ca] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#86756a]">
                  Last Processed
                </p>
                <p className="mt-2 text-sm font-medium text-[#3b302a]">
                  {lastProcessed}
                </p>
              </div>
            </>
          )}

          <div className="mt-4 rounded-xl border border-[#e5d8ca] bg-gradient-to-b from-[#fffaf3] to-[#f8f1e7] p-4">
            <p className="text-sm font-semibold text-[#3c3028]">Quick tips</p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-[#6f6158]">
              <li>Use clear headers like Date, Description, and Amount.</li>
              <li>Keep one account per file for cleaner analytics.</li>
              <li>Avoid merged cells for better parsing quality.</li>
            </ul>
          </div>
        </aside>
      </section>

      {/* FILE REQUIREMENTS */}
      <section className="mt-7 rounded-[1.6rem] border border-[#e5d9cb] bg-white/70 p-5 shadow-[0_14px_34px_rgba(38,26,16,0.06)] backdrop-blur-xl sm:p-6">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#231b16]">
          File Requirements
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e7dccc] bg-[#fdf9f3] p-4">
            <FileText
              size={18}
              className="text-[#7f6654]"
            />

            <p className="mt-3 text-sm font-semibold text-[#2d241f]">
              Accepted formats
            </p>

            <p className="mt-1 text-xs text-[#6d5f56]">
              XLSX, XLS, CSV
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7dccc] bg-[#fdf9f3] p-4">
            <HardDriveUpload
              size={18}
              className="text-[#7f6654]"
            />

            <p className="mt-3 text-sm font-semibold text-[#2d241f]">
              Max file size
            </p>

            <p className="mt-1 text-xs text-[#6d5f56]">
              Up to 10 MB per upload
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7dccc] bg-[#fdf9f3] p-4">
            <CalendarDays
              size={18}
              className="text-[#7f6654]"
            />

            <p className="mt-3 text-sm font-semibold text-[#2d241f]">
              Header row
            </p>

            <p className="mt-1 text-xs text-[#6d5f56]">
              Column names must be present
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7dccc] bg-[#fdf9f3] p-4">
            <FileCheck2
              size={18}
              className="text-[#7f6654]"
            />

            <p className="mt-3 text-sm font-semibold text-[#2d241f]">
              Recommended template
            </p>

            <p className="mt-1 text-xs text-[#6d5f56]">
              Date, Description, Amount format
            </p>
          </div>
        </div>
      </section>

      {/* RECENT UPLOADS */}
      <section className="mt-7 rounded-[1.6rem] border border-[#e4d8ca] bg-white/72 p-5 shadow-[0_16px_38px_rgba(42,28,20,0.07)] backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#231b16]">
            Recent Uploads
          </h3>

          {recentUploads.length > 0 && (
            <p className="text-xs text-[#7b6f66]">
              {recentUploads.length} files tracked
            </p>
          )}
        </div>

        {showInitialDataSkeleton ? (
          <SkeletonTable rows={5} />
        ) : loading ? (
          <div className="rounded-2xl border border-[#e7dccf] bg-white/80 px-6 py-10 text-center text-[#6f6258]">
            <div className="inline-flex items-center gap-2 text-sm font-medium">
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
              Loading recent uploads...
            </div>
          </div>
        ) : (
          <DataTable
            columns={recentUploadColumns}
            data={recentUploads}
            rowKey="id"
            emptyTitle="No uploads yet"
            emptyDescription="Upload your first spreadsheet to start generating insights."
            emptyIcon="[Upload]"
            className="bg-white/85"
          />
        )}
      </section>

      {/* MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1814]/28 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-[#e6dbcf] bg-white p-6 shadow-[0_24px_60px_rgba(28,20,14,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-2xl font-semibold tracking-[-0.04em] text-[#241c17]">
                  Analyze This File?
                </h4>

                <p className="mt-3 text-sm leading-6 text-[#66584f]">
                  This file will be uploaded and processed.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowConfirmModal(false)
                }
                className="rounded-lg border border-[#e4d8ca] bg-white/80 p-2 text-[#6a5c52]"
              >
                <X size={16} />
              </button>
            </div>

            {selectedFile && (
              <div className="mt-5 rounded-xl border border-[#e7dbce] bg-white/75 px-4 py-3 text-sm text-[#5d5047]">
                <p className="font-semibold text-[#3b3028]">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs">
                  {formatFileSize(selectedFile.size)} ·{' '}
                  {getFileTypeLabel(selectedFile.name)}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-xl px-5"
                onClick={() =>
                  setShowConfirmModal(false)
                }
              >
                Cancel
              </Button>

              <Button
                className="rounded-xl px-5"
                onClick={startUpload}
              >
                Confirm & Analyze
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadPage
