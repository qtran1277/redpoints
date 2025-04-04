import { Report, ReportStatus } from '../../reports/types'

export type DashboardStats = {
  totalReports: number
  pendingReports: number
  approvedReports: number
  rejectedReports: number
}

export type DashboardFilters = {
  status?: ReportStatus
  city?: string
  district?: string
  reportType?: string
  startDate?: Date
  endDate?: Date
}

export type DashboardView = 'card' | 'table' | 'map'

export type DashboardState = {
  view: DashboardView
  filters: DashboardFilters
  reports: Report[]
  stats: DashboardStats
  isLoading: boolean
  error: string | null
} 