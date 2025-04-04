import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Fetch all report types
    const reportTypes = await prisma.reportType.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        description: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(reportTypes)
  } catch (error) {
    console.error('Error fetching report types:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 