import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reports = await prisma.report.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        reportType: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching driver reports:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải thông tin báo cáo' },
      { status: 500 }
    )
  }
} 