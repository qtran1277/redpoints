import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

// Log environment variables
console.log('=== Environment Variables ===')
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET)
console.log('NEXTAUTH_SECRET length:', process.env.NEXTAUTH_SECRET?.length)
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET)
console.log('GITHUB_ID:', process.env.GITHUB_ID)
console.log('GITHUB_SECRET:', process.env.GITHUB_SECRET)
console.log('DATABASE_URL:', process.env.DATABASE_URL)

// Test database connection
console.log('=== Testing Database Connection ===')
prisma.$connect()
  .then(() => {
    console.log('Database connection successful')
  })
  .catch((error) => {
    console.error('Database connection failed:', error)
  })

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`, data ? JSON.stringify(data) : '')
}

function logTime(startTime: number, label: string) {
  const duration = Date.now() - startTime
  log(`${label} took ${duration}ms`)
  return duration
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user }) {
      const startTime = Date.now()
      log('signIn started', { email: user.email })

      if (!user.email) {
        log('signIn failed: no email')
        return false
      }

      try {
        log('upserting user', { email: user.email })
        const upsertStart = Date.now()
        
        const result = await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            name: user.name || '',
            role: Role.DRIVER,
            points: 0,
            isBlocked: false
          }
        })

        logTime(upsertStart, 'prisma.user.upsert')
        logTime(startTime, 'signIn total')
        log('signIn completed', { userId: result.id })
        
        return !!result
      } catch (error) {
        log('signIn error', { error })
        return false
      }
    },
    async session({ session, token }) {
      const startTime = Date.now()
      log('session started', { email: session.user?.email })

      if (!session.user?.email) {
        log('session skipped: no email')
        return session
      }

      try {
        log('finding user', { email: session.user.email })
        const findStart = Date.now()
        
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, role: true, points: true, isBlocked: true }
        })

        logTime(findStart, 'prisma.user.findUnique')
        
        if (user) {
          session.user.id = user.id
          session.user.role = user.role
          session.user.points = user.points
          session.user.isBlocked = user.isBlocked
          log('session user data', { userId: user.id, role: user.role })
        } else {
          log('session warning: user not found', { email: session.user.email })
        }
      } catch (error) {
        log('session error', { error })
      }

      logTime(startTime, 'session total')
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
} 