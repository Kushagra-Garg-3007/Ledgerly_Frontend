import axios from '../plugins/axios'
import apiEndPoint from '../constants/apiEndpoints'

const formatError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

export const login = async (payload) => {
  try {
    const response = await axios.post(apiEndPoint.authLogin(), payload)
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const register = async (payload) => {
  try {
    const response = await axios.post(apiEndPoint.authSignup(), payload)
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const logout = async () => {
  try {
    const response = await axios.post(apiEndPoint.authLogout())
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export const getProfile = async () => {
  try {
    const response = await axios.get(apiEndPoint.authProfile())
    return response.data
  } catch (error) {
    throw new Error(formatError(error))
  }
}
