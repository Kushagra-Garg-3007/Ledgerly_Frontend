import axiosPlugin from '../plugins/axios'
import apiEndPoint from '../constants/apiEndpoints'

const formatError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

export const getCategories = async () => {
  try {
    const response = await axiosPlugin.get(apiEndPoint.categories())
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const createCategory = async (payload) => {
  try {
    const response = await axiosPlugin.post(apiEndPoint.categories(), payload)
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}
