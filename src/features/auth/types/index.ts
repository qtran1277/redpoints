export type UserRole = 'ADMIN' | 'MODERATOR' | 'DRIVER'

export type User = {
  id: string
  name: string
  email: string
  image?: string
  role: UserRole
  points: number
  createdAt: Date
  updatedAt: Date
}

export type Session = {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role: UserRole
    points: number
  }
  expires: string
}

export type AuthError = {
  code: string
  message: string
} 