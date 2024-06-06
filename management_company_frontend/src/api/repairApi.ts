import axiosInstance from '@/api/axiosInstance.ts'
import type { RepairList } from '@/types'

export const GetAllRepairs = async () => {
  const response = await axiosInstance.get<RepairList>(
    '/repairs'
  )
  return response.data
}
