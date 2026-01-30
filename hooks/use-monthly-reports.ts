"use client"

import { useQuery } from '@tanstack/react-query'
import { MonthlyReportQueryOptions, MonthReportWithId } from '@/types/database'

const fetchMonthlyReports = async (options: MonthlyReportQueryOptions = {}): Promise<MonthReportWithId[]> => {
  const params = new URLSearchParams()
  if (options.startMonth !== undefined) params.append('startMonth', options.startMonth.toString())
  if (options.startYear !== undefined) params.append('startYear', options.startYear.toString())
  if (options.endMonth !== undefined) params.append('endMonth', options.endMonth.toString())
  if (options.endYear !== undefined) params.append('endYear', options.endYear.toString())
  if (options.orderBy) params.append('orderBy', options.orderBy)
  if (options.limit !== undefined) params.append('limit', options.limit.toString())
  if (options.offset !== undefined) params.append('offset', options.offset.toString())

  const response = await fetch(`/api/monthly-reports?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch monthly reports')
  }
  return response.json()
}

export const useMonthlyReports = (options: MonthlyReportQueryOptions = {}) => {
  return useQuery({
    queryKey: ['monthly-reports', options],
    queryFn: () => fetchMonthlyReports(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCurrentMonthReport = () => {
  return useQuery({
    queryKey: ['monthly-reports', 'latest'],
    queryFn: async () => {
      const reports = await fetchMonthlyReports({ orderBy: 'desc', limit: 1 })
      return reports[0] || null
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useReportsForYear = (year: number) => {
  return useQuery({
    queryKey: ['monthly-reports', 'year', year],
    queryFn: () => fetchMonthlyReports({
      startYear: year,
      startMonth: 1,
      endYear: year,
      endMonth: 12,
      orderBy: 'asc',
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!year,
  })
}

export const useReportsForDateRange = (
  startMonth: number, 
  startYear: number, 
  endMonth?: number, 
  endYear?: number
) => {
  return useQuery({
    queryKey: ['monthly-reports', 'range', startMonth, startYear, endMonth, endYear],
    queryFn: () => fetchMonthlyReports({
      startMonth,
      startYear,
      endMonth,
      endYear,
      orderBy: 'asc',
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!(startMonth && startYear),
  })
}