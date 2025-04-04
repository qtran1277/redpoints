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
  debug: true,
  logger: {
    error(code, ...message) {
      console.error('AUTH ERROR:', code, message)
    },
    warn(code, ...message) {
      console.warn('AUTH WARN:', code, message)
    },
    debug(code, ...message) {
      console.log('AUTH DEBUG:', code, message)
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    pkceCodeVerifier: {
      name: `__Secure-next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        maxAge: 900
      }
    },
    state: {
      name: `__Secure-next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        maxAge: 900
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('=== Sign In Attempt ===')
      console.log('User:', { email: user.email, name: user.name })
      console.log('Account:', { provider: account?.provider, type: account?.type })
      console.log('Profile:', profile)

      if (!user.email) {
        console.log('Sign in failed: No email provided')
        return false
      }

      const email = typeof user.email === 'string' ? user.email : undefined
      if (!email) {
        console.log('Sign in failed: Invalid email format')
        return false
      }

      try {
        console.log('Starting database transaction')
        const result = await prisma.$transaction(async (tx) => {
          const existingUser = await tx.user.findUnique({
            where: { email },
            select: { id: true, isBlocked: true }
          })

          if (existingUser) {
            console.log('Found existing user:', existingUser)
            return existingUser
          }

          console.log('Creating new user with email:', email)
          return await tx.user.create({
            data: {
              email,
              name: typeof user.name === 'string' ? user.name : undefined,
              role: Role.DRIVER,
              points: 0,
              isBlocked: false
            },
            select: {
              id: true,
              isBlocked: true
            }
          })
        }, {
          maxWait: 5000,
          timeout: 5000
        })

        if (result.isBlocked) {
          console.log('Sign in blocked: User is blocked')
          return false
        }

        console.log('Sign in successful')
        return true
      } catch (error) {
        console.error('Database error during auth:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (!session.user?.email) return session

      try {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { 
            id: true, 
            role: true, 
            points: true, 
            isBlocked: true 
          }
        })
        
        if (user) {
          session.user.id = user.id
          session.user.role = user.role
          session.user.points = user.points
          session.user.isBlocked = user.isBlocked
        }
      } catch (error) {
        console.error('Session error:', error)
      }

      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
} 