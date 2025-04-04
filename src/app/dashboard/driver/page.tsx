import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// Map status to Vietnamese
const statusConfig = {
  PENDING: { label: 'Đang chờ', color: 'bg-yellow-500', icon: Clock },
  APPROVED: { label: 'Đã duyệt', color: 'bg-green-500', icon: CheckCircle },
  REJECTED: { label: 'Từ chối', color: 'bg-red-500', icon: XCircle },
} as const;

interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  createdAt: Date;
  latitude: number;
  longitude: number;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  rejectionReason?: string | null;
  reportType: {
    id: string;
    name: string;
    icon: string;
  };
}

interface ReportCardProps {
  report: Report;
}

export default async function DriverDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'DRIVER') {
    redirect('/')
  }

  // Fetch reports for the current driver
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
  }) as Report[]

  // Group reports by status
  const reportsByStatus = {
    PENDING: reports.filter(report => report.status === 'PENDING'),
    APPROVED: reports.filter(report => report.status === 'APPROVED'),
    REJECTED: reports.filter(report => report.status === 'REJECTED'),
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Báo cáo của tôi</h1>
        <Link href="/report/new">
          <Button>
            <AlertCircle className="mr-2 h-4 w-4" />
            Báo cáo mới
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả ({reports.length})</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt ({reportsByStatus.PENDING.length})</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt ({reportsByStatus.APPROVED.length})</TabsTrigger>
          <TabsTrigger value="rejected">Từ chối ({reportsByStatus.REJECTED.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
          {reports.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Bạn chưa có báo cáo nào
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {reportsByStatus.PENDING.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
          {reportsByStatus.PENDING.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có báo cáo nào đang chờ duyệt
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {reportsByStatus.APPROVED.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
          {reportsByStatus.APPROVED.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có báo cáo nào đã được duyệt
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {reportsByStatus.REJECTED.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
          {reportsByStatus.REJECTED.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có báo cáo nào bị từ chối
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportCard({ report }: ReportCardProps) {
  const StatusIcon = statusConfig[report.status].icon
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {report.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {report.description}
            </CardDescription>
          </div>
          <Badge className={`${statusConfig[report.status].color} text-white`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[report.status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{report.address || 'Chưa có địa chỉ'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {new Date(report.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
          {report.rejectionReason && (
            <div className="flex items-center text-sm text-red-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{report.rejectionReason}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 