import axios from '../plugins/axios'
import apiEndPoint from '../constants/apiEndpoints'

const formatError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

export const uploadFile = async (file, onUploadProgress) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(apiEndPoint.upload(), formData, {
      onUploadProgress,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 120000
    })

    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const getRecentUploads = async () => {
  try {
    const response = await axios.get(apiEndPoint.recentUploads())
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const deleteUpload = async (uploadId) => {
  try {
    const response = await axios.delete(apiEndPoint.uploadById(uploadId))
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const retryUpload = async (uploadId) => {
  try {
    const response = await axios.post(apiEndPoint.retryUploadById(uploadId))
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}
