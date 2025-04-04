import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: any) {
  try {
    const { id } = params as { id: string };
    
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is moderator
    if (session.user.role !== 'MODERATOR') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Update report status back to pending
    const report = await prisma.report.update({
      where: { id },
      data: {
        status: 'PENDING',
        moderatorId: null,
        rejectionReason: null
      },
      include: {
        reportType: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error setting report to pending:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 