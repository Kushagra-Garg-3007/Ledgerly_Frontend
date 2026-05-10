import axiosPlugin from '../plugins/axios'
import apiEndPoint from '../constants/apiEndpoints'

const formatError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

export const getTransactions = async (params = {}) => {
  try {
    const response = await axiosPlugin.get(apiEndPoint.transactions(), {
      params,
    })
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const createTransaction = async (payload) => {
  try {
    const response = await axiosPlugin.post(apiEndPoint.transactions(), payload)
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const updateTransaction = async (transactionId, payload) => {
  try {
    const response = await axiosPlugin.put(
      apiEndPoint.transactionById(transactionId),
      payload,
    )
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const deleteTransaction = async (transactionId) => {
  try {
    const response = await axiosPlugin.delete(
      apiEndPoint.transactionById(transactionId),
    )
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}
