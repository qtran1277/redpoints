export enum Role {
  DRIVER = 'DRIVER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ReportCategory {
  ACCIDENT_PRONE = 'ACCIDENT_PRONE',
  TRAFFIC_VIOLATION = 'TRAFFIC_VIOLATION',
  ROAD_CONDITION = 'ROAD_CONDITION',
  POLICE_CHECKPOINT = 'POLICE_CHECKPOINT',
  OTHER = 'OTHER'
}

export interface User {
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  role: Role
  points: number
}

export interface Report {
  id: string
  title: string
  description: string
  latitude: number
  longitude: number
  address?: string | null
  city?: string | null
  district?: string | null
  images: string[]
  status: ReportStatus
  createdAt: string
  updatedAt: string
  userId: string
  moderatorId?: string | null
  rejectionReason?: string | null
  reportTypeId: string
  reportType?: {
    id: string
    name: string
    icon: string | null
  }
  user?: {
    name: string | null
    email: string | null
    image: string | null
  }
}

export interface ReportType {
  id: string
  name: string
  description: string
  icon: string
  createdAt: Date
  updatedAt: Date
} 