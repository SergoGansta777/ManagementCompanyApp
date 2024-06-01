import axiosInstance from '@/api/axiosInstance.ts'
import type { StatisticOverviewLastYear } from '@/types'

export const GetYearStatisticOverview = async () => {
  const response = await axiosInstance.get<StatisticOverviewLastYear>('/statistics/year_overview')
  return response.data
}
