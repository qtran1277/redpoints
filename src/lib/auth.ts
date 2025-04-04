import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import Cookies from 'js-cookie'

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
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      log('Starting signIn callback', { email: user.email })
      
      if (!user.email) {
        log('No email provided')
        return false
      }

      try {
        // Check if user exists
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        if (!dbUser) {
          // Create new user if doesn't exist
          log('Creating new user', { email: user.email })
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split('@')[0],
              role: Role.DRIVER,
              points: 0
            }
          })
          log('New user created successfully', { userId: dbUser.id })
        }

        // Link the Google account
        if (account?.provider === 'google') {
          log('Linking Google account')
          try {
            await prisma.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                }
              },
              create: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
              update: {
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            })
            log('Google account linked successfully')
            return true
          } catch (error) {
            log('Error linking Google account', { error })
            return false
          }
        }

        return true
      } catch (error) {
        log('Error in signIn callback', { error })
        return false
      }
    },
    async jwt({ token, user, account }) {
      log('JWT Callback', { token, userId: user?.id })
      
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      
      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token }) {
      log('Session Callback', { sessionUser: session.user, token })

      if (token?.id && token?.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: token.email }
          })

          if (user) {
            session.user.id = user.id
            session.user.role = user.role
            session.user.points = user.points
            log('Session updated with user data', { userId: user.id, role: user.role })
          }
        } catch (error) {
          log('Error in session callback', { error })
        }
      }

      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/error'
  },
  events: {
    async signIn({ user, account, profile }) {
      log('Sign in event', { userId: user.id, email: user.email })
    },
    async signOut({ session, token }) {
      log('Sign out event', { userId: session?.user?.id })
    },
    async session({ session, token }) {
      log('Session event', { userId: session?.user?.id })
    }
  }
} 