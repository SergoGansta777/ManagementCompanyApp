import axiosInstance from '@/api/axiosInstance.ts'
import type { IncidentDetailList } from '@/types'

export const GetAllIncidentsDetails = async () => {
  const response = await axiosInstance.get<IncidentDetailList>(
    '/incidents'
  )
  return response.data
}