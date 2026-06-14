import axios from '../plugins/axios'
import apiEndPoint from '../constants/apiEndpoints'

export async function fetchAnalysis(range) {
    try{
        const response = await axios.get(apiEndPoint.fetchAnalysis(range.fromDate, range.toDate))
        return response.data
    } catch (error) {
        throw new Error(error)
    }
}

export async function fetchInsights(range) {
    try{
        const response = await axios.get(apiEndPoint.fetchInsights(range.previousPeriodStartDate, range.previousPeriodEndDate, range.currentPeriodStartDate, range.currentPeriodEndDate))
        return response.data
    } catch (error) {
        throw new Error(error)
    }
}