import axiosInstance from '@/api/axiosInstance.ts'
import {
  type IncidentDetailList,
  type IncidentTypesList
} from '@/types'

export const GetAllIncidentsDetails = async () => {
  const response = await axiosInstance.get<IncidentDetailList>(
    '/incidents'
  )
  return response.data
}

export const getAllIncidentsTypes = async () => {
  const response = await axiosInstance.get<IncidentTypesList>(
    '/incidents/types'
  )
  return response.data
}
