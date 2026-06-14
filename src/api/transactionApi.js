import axios from '../plugins/axios'
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
    const response = await axios.get(apiEndPoint.transactions(), {
      params
    })
    return response.data
  } catch (error) {
    throw new Error(formatError(error), { cause: error })
  }
}

export const getTransactionSummary = async (params = {}) => {
  try {
    const response = await axios.get(apiEndPoint.transactionSummary(), {
      params
    })
    return response.data
  } catch (error) {
    throw new Error(formatError(error), { cause: error })
  }
}

export const createTransaction = async (payload) => {
  try {
    const response = await axios.post(apiEndPoint.transactions(), payload)
    return response.data
  } catch (error) {
    throw new Error(formatError(error), { cause: error })
  }
}

export const updateSingleTransaction = async (payload) => {
  try {
    const response = await axios.post(
      apiEndPoint.updateTransactionAnnotation(),
      payload
    )
    return response.data
  } catch (error) {
    throw new Error(formatError(error), { cause: error })
  }
}

export const updateTransactionsByEntity = async (payload) => {
  try {
    const response = await axios.post(
      apiEndPoint.updateTransactionsByEntity(),
      payload
    )
    return response.data
  } catch (error) {
    throw new Error(formatError(error), { cause: error })
  }
}

export const deleteTransaction = async (transactionId) => {
  try {
    const response = await axios.delete(
      apiEndPoint.transactionById(transactionId)
    )
    return response.data
  } catch (error) {
    throw new Error(formatError(error), { cause: error })
  }
}
