import axiosInstance from '@/api/axiosInstance.ts'
import type { Overview, StatisticOverviewLastYear } from '@/types'

export const GetYearStatisticOverview = async () => {
  const response = await axiosInstance.get<StatisticOverviewLastYear>(
    '/statistics/year_overview'
  )
  return response.data
}

export const GetStatistics = async (fromDate: string, toDate: string) => {
  const response = await axiosInstance.get<Overview>('/statistics/building', {
    params: {
      startDate: fromDate,
      endDate: toDate
    }
  })
  return response.data
}
