import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string; action: 'approve' | 'reject' } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is moderator
    if (session.user.role !== 'MODERATOR') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { id, action } = params

    // Update report status
    const report = await prisma.report.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        moderatorId: session.user.id,
        rejectionReason: action === 'reject' ? 'Báo cáo không phù hợp' : null
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error(`Error ${params.action}ing report:`, error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 