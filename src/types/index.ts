export type Role = 'DRIVER' | 'MODERATOR' | 'ADMIN'
export type ReportCategory = 'ACCIDENT_PRONE' | 'TRAFFIC_VIOLATION' | 'ROAD_CONDITION' | 'POLICE_CHECKPOINT' | 'OTHER'

export enum ReportStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
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