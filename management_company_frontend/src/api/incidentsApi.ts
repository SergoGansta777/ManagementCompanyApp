import axiosInstance from '@/api/axiosInstance.ts'
import { type IncidentDetailList, type IncidentTypesList } from '@/types'

export const GetAllIncidentsDetails = async (fromDate: string, toDate: string) => {
  const response = await axiosInstance.get<IncidentDetailList>(
    '/incidents',
    {
      params: {
        startDate: fromDate,
        endDate: toDate
      }
    }
  )
  return response.data
}

export const getAllIncidentsTypes = async () => {
  const response = await axiosInstance.get<IncidentTypesList>(
    '/incidents/types'
  )
  return response.data
}
