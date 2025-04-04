import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
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
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account }) {
      console.log('=== Auth Event: Sign In ===')
      console.log('Provider:', account?.provider)
      console.log('User email:', user.email)
      console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
    },
    async signOut({ session }) {
      console.log('=== Auth Event: Sign Out ===')
      console.log('User email:', session?.user?.email)
    }
  },
  session: {
    strategy: 'jwt',
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
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
        }
      }
      return token
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
    },
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.log('No email provided');
        return false;
      }

      try {
        // Set timeout for database operations
        const timeoutPromise = new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 8000)
        );

        const dbOperation = async () => {
          // Check if user exists and create if not - using upsert for single operation
          const upsertUser = await prisma.user.upsert({
            where: {
              email: user.email as string,
            },
            update: {}, // No updates if exists
            create: {
              email: user.email as string,
              name: typeof user.name === 'string' ? user.name : '',
              points: 0,
              role: Role.DRIVER,
            },
          });
          
          console.log(upsertUser.id ? 'Updated existing user:' : 'Created new user:', user.email);
          return true;
        };

        // Race between timeout and db operation
        return await Promise.race([dbOperation(), timeoutPromise]);
      } catch (error) {
        console.error('Database error during auth:', error);
        return false;
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
} 