import axiosInstance from '@/api/axiosInstance.ts'
import type { IncidentDetailsList } from '@/types'

export const GetAllIncidentsDetails = async () => {
  const response = await axiosInstance.get<IncidentDetailsList>(
    '/incidents'
  )
  return response.data
}