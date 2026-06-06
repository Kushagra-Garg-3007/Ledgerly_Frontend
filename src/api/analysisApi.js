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