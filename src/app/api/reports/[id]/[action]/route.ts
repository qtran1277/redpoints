import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(request: Request, { params }: any) {
  try {
    const { id, action } = params as { id: string; action: 'approve' | 'reject' }
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reason } = await request.json()

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    if (report.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Report has already been processed' },
        { status: 400 }
      )
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        moderatorId: session.user.id,
        rejectionReason: reason || null,
      },
    })

    if (action === 'approve') {
      // Since there's no Post model, we'll remove this part
      // await prisma.post.update({
      //   where: { id: report.postId },
      //   data: { status: 'removed' },
      // });
    }

    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error('Error processing report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 