export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type ReportType = {
  id: string
  name: string
  description: string
  icon: string
}

export type Report = {
  id: string
  description: string
  status: ReportStatus
  createdAt: Date
  updatedAt: Date
  driverId: string
  moderatorId?: string
  locationId: string
  reportTypeId: string
  rejectionReason?: string
  location: {
    id: string
    name: string
    address: string
    latitude: number
    longitude: number
  }
  reportType: ReportType
}

export type CreateReportInput = {
  description: string
  locationId: string
  reportTypeId: string
}

export type UpdateReportInput = {
  status?: ReportStatus
  rejectionReason?: string
} 