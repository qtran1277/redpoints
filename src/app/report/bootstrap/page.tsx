'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container, Row, Col, Card, Badge, Button, Spinner, Tab, Nav } from 'react-bootstrap'
import { AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Image as ImageIcon, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import 'bootstrap-icons/font/bootstrap-icons.css'

type Report = {
  id: string
  title: string
  description: string
  latitude: number
  longitude: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reportType: {
    id: string
    name: string
    icon: string | null
  }
  images: string[]
  createdAt: string
  updatedAt: string
  address?: string
}

export default function BootstrapReportPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [addresses, setAddresses] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports/driver')
        if (!response.ok) {
          throw new Error('Không thể tải danh sách báo cáo')
        }
        const data = await response.json()
        setReports(data)
        
        // Fetch addresses for all reports
        const addressPromises = data.map((report: Report) => 
          getAddressFromCoordinates(report.latitude, report.longitude)
            .then(address => ({ id: report.id, address }))
        )
        
        const addressResults = await Promise.all(addressPromises)
        const addressMap: Record<string, string> = {}
        addressResults.forEach(result => {
          addressMap[result.id] = result.address
        })
        setAddresses(addressMap)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchReports()
    }
  }, [session])

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      return data.display_name || 'Không thể lấy địa chỉ'
    } catch (error) {
      console.error('Error getting address:', error)
      return 'Không thể lấy địa chỉ'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning" className="d-flex align-items-center gap-1"><Clock size={14} /> Chờ duyệt</Badge>
      case 'APPROVED':
        return <Badge bg="success" className="d-flex align-items-center gap-1"><CheckCircle size={14} /> Đã duyệt</Badge>
      case 'REJECTED':
        return <Badge bg="danger" className="d-flex align-items-center gap-1"><XCircle size={14} /> Từ chối</Badge>
      default:
        return null
    }
  }

  const filteredReports = reports.filter(report => {
    if (activeTab === 'all') return true
    return report.status === activeTab
  })

  if (status === 'loading' || loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger" role="alert">
          <AlertTriangle className="me-2" />
          {error}
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Báo cáo của tôi</h1>
        <Button 
          variant="primary" 
          onClick={() => router.push('/report/new')}
        >
          Tạo báo cáo mới
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'all'} 
                onClick={() => setActiveTab('all')}
              >
                Tất cả ({reports.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'PENDING'} 
                onClick={() => setActiveTab('PENDING')}
              >
                Chờ duyệt ({reports.filter(r => r.status === 'PENDING').length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'APPROVED'} 
                onClick={() => setActiveTab('APPROVED')}
              >
                Đã duyệt ({reports.filter(r => r.status === 'APPROVED').length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'REJECTED'} 
                onClick={() => setActiveTab('REJECTED')}
              >
                Từ chối ({reports.filter(r => r.status === 'REJECTED').length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {filteredReports.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <AlertTriangle size={48} className="text-muted" />
              </div>
              <h5>Chưa có báo cáo nào</h5>
              <p className="text-muted">Bạn chưa có báo cáo nào trong danh mục này</p>
              <Button 
                variant="primary" 
                onClick={() => router.push('/report/new')}
              >
                Tạo báo cáo mới
              </Button>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredReports.map((report) => (
                <Col key={report.id}>
                  <Card className="h-100 shadow-sm">
                    {report.images && report.images.length > 0 && (
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={report.images[0]} 
                          alt={report.title}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {report.images.length > 1 && (
                          <Badge 
                            bg="dark" 
                            className="position-absolute top-0 end-0 m-2"
                          >
                            +{report.images.length - 1}
                          </Badge>
                        )}
                      </div>
                    )}
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{report.title}</h5>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="card-text text-muted small mb-3">{report.description}</p>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <Badge 
                          bg="light" 
                          text="dark" 
                          className="d-flex align-items-center gap-1" 
                          style={{ maxWidth: '100%', cursor: 'pointer' }}
                          onClick={() => window.open(`https://www.google.com/maps?q=${report.latitude},${report.longitude}`, '_blank')}
                        >
                          <MapPin size={14} className="flex-shrink-0" />
                          <span 
                            className="text-truncate" 
                            style={{ maxWidth: 'calc(100% - 20px)' }}
                            title={addresses[report.id] || 'Đang tải địa chỉ...'}
                          >
                            {addresses[report.id] || 'Đang tải địa chỉ...'}
                          </span>
                        </Badge>
                        <Badge bg="light" text="dark" className="d-flex align-items-center gap-1">
                          <Calendar size={14} />
                          {format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge bg="info" className="d-flex align-items-center gap-1">
                          {report.reportType.icon ? (
                            (() => {
                              const [iconName, iconColor] = report.reportType.icon.split(':')
                              const colorClass = iconColor === 'danger' ? 'text-danger' : 
                                                iconColor === 'warning' ? 'text-warning' : 
                                                'text-primary'
                              
                              return (
                                <span className={colorClass}>
                                  <i className={`bi ${iconName}`} style={{ fontSize: '14px' }}></i>
                                </span>
                              )
                            })()
                          ) : (
                            <AlertTriangle size={14} className="text-warning" />
                          )}
                          {report.reportType.name}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
} 