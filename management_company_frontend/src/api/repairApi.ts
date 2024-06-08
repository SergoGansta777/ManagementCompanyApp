import axiosInstance from '@/api/axiosInstance.ts'
import type { RepairList } from '@/types'

export const GetAllRepairs = async (fromDate: string, toDate: string) => {
  const response = await axiosInstance.get<RepairList>(
    '/repairs',
    {
      params: {
        startDate: fromDate,
        endDate: toDate
      }
    }
  )
  return response.data
}
