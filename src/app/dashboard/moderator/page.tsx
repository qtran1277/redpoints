'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Report, ReportStatus } from '@/types'
import { toast } from 'react-hot-toast'
import { Spinner } from 'react-bootstrap'

export default function ModeratorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedReportType, setSelectedReportType] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [cities, setCities] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [reportTypes, setReportTypes] = useState<Array<{id: string, name: string}>>([])
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card')

  // Fetch report types
  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const res = await fetch('/api/report-types')
        if (!res.ok) throw new Error('Failed to fetch report types')
        const data = await res.json()
        setReportTypes(data)
      } catch (error) {
        console.error('Error fetching report types:', error)
        toast.error('Không thể tải danh sách loại báo cáo')
      }
    }
    fetchReportTypes()
  }, [])

  // Fetch reports and extract cities/districts
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports')
        if (!res.ok) throw new Error('Failed to fetch reports')
        const data = await res.json()
        setReports(data)
        
        // Extract unique cities and districts
        const uniqueCities = Array.from(new Set(data.map((report: Report) => report.city).filter(Boolean))) as string[]
        setCities(uniqueCities)
        
        if (selectedCity) {
          const cityDistricts = Array.from(new Set(
            data
              .filter((report: Report) => report.city === selectedCity)
              .map((report: Report) => report.district)
              .filter(Boolean)
          )) as string[]
          setDistricts(cityDistricts)
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
        toast.error('Không thể tải danh sách báo cáo')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [selectedCity])

  const handleAction = async (reportId: string, action: 'approve' | 'reject') => {
    if (!session?.user || session.user.role !== 'MODERATOR') {
      toast.error('Bạn không có quyền thực hiện hành động này')
      return
    }

    setProcessingId(reportId)
    try {
      // Nếu báo cáo đang ở trạng thái APPROVED hoặc REJECTED, đổi action thành 'pending'
      const report = reports.find(r => r.id === reportId)
      const actualAction = (report?.status === 'APPROVED' || report?.status === 'REJECTED') ? 'pending' : action
      
      const res = await fetch(`/api/reports/${reportId}/${actualAction}`, {
        method: 'PUT'
      })

      if (!res.ok) throw new Error(`Failed to ${action} report`)

      const updatedReport = await res.json()
      setReports(reports.map(r => r.id === reportId ? updatedReport : r))

      let message = ''
      if (actualAction === 'pending') {
        message = report?.status === 'APPROVED' ? 'Đã hủy duyệt báo cáo' : 'Đã hủy từ chối báo cáo'
      } else {
        message = action === 'approve' ? 'Đã phê duyệt báo cáo' : 'Đã từ chối báo cáo'
      }
      toast.success(message)
    } catch (error) {
      console.error(`Error ${action}ing report:`, error)
      toast.error(`Có lỗi xảy ra khi xử lý báo cáo`)
    } finally {
      setProcessingId(null)
    }
  }

  // Filter reports based on selected criteria
  const filteredReports = reports.filter(report => {
    if (selectedCity && report.city !== selectedCity) return false
    if (selectedDistrict && report.district !== selectedDistrict) return false
    if (selectedReportType && report.reportTypeId !== selectedReportType) return false
    if (selectedStatus && report.status !== selectedStatus) return false
    return true
  })

  if (status === 'loading' || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner />
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'MODERATOR') {
    return null
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">Kiểm duyệt báo cáo</h2>
                <div className="btn-group">
                  <button 
                    type="button" 
                    className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('table')}
                  >
                    <i className="bi bi-table me-1"></i>
                    Bảng
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('card')}
                  >
                    <i className="bi bi-grid-3x3-gap me-1"></i>
                    Thẻ
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                  <select
                    className="form-select"
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value)
                      setSelectedDistrict('')
                    }}
                  >
                    <option value="">Tất cả thành phố</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <select
                    className="form-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedCity}
                  >
                    <option value="">Tất cả quận/huyện</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <select
                    className="form-select"
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                  >
                    <option value="">Tất cả loại báo cáo</option>
                    {reportTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Đã từ chối</option>
                  </select>
                </div>
              </div>
              
              {filteredReports.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">Không có báo cáo nào cần kiểm duyệt</p>
                </div>
              ) : viewMode === 'table' ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Thời gian</th>
                        <th scope="col">Loại</th>
                        <th scope="col">Vị trí</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Người báo cáo</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col" style={{ width: '120px' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map(report => (
                        <tr key={report.id}>
                          <td>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>{report.reportType?.name}</td>
                          <td>
                            {report.address || `${report.latitude}, ${report.longitude}`}
                            <div className="mt-1">
                              <a 
                                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                              >
                                <i className="bi bi-map"></i>
                                <span>Xem bản đồ</span>
                              </a>
                            </div>
                          </td>
                          <td>{report.description}</td>
                          <td>{report.user?.name || report.user?.email || 'Ẩn danh'}</td>
                          <td>
                            <span className={`badge ${
                              report.status === 'PENDING' ? 'bg-warning' :
                              report.status === 'APPROVED' ? 'bg-success' :
                              'bg-danger'
                            }`}>
                              {report.status === 'PENDING' ? 'Chờ duyệt' :
                               report.status === 'APPROVED' ? 'Đã duyệt' :
                               'Đã từ chối'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {report.status === 'PENDING' && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleAction(report.id, 'approve')}
                                    disabled={!!processingId}
                                    title="Phê duyệt"
                                  >
                                    {processingId === report.id ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <i className="bi bi-check-circle"></i>
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleAction(report.id, 'reject')}
                                    disabled={!!processingId}
                                    title="Từ chối"
                                  >
                                    {processingId === report.id ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <i className="bi bi-x-circle"></i>
                                    )}
                                  </button>
                                </>
                              )}
                              {report.status === 'APPROVED' && (
                                <button
                                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                  onClick={() => handleAction(report.id, 'reject')}
                                  disabled={!!processingId}
                                  title="Hủy phê duyệt"
                                >
                                  {processingId === report.id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <>
                                      <i className="bi bi-x-lg"></i>
                                      <span>Hủy duyệt</span>
                                    </>
                                  )}
                                </button>
                              )}
                              {report.status === 'REJECTED' && (
                                <button
                                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                  onClick={() => handleAction(report.id, 'approve')}
                                  disabled={!!processingId}
                                  title="Duyệt lại"
                                >
                                  {processingId === report.id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <>
                                      <i className="bi bi-check-lg"></i>
                                      <span>Duyệt lại</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="row g-4">
                  {filteredReports.map(report => (
                    <div key={report.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="card-title mb-1">
                                {report.reportType?.name}
                              </h5>
                              <div className="d-flex align-items-center gap-2">
                                <p className="text-muted small mb-0">
                                  {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                                <span className={`badge ${
                                  report.status === 'PENDING' ? 'bg-warning' :
                                  report.status === 'APPROVED' ? 'bg-success' :
                                  'bg-danger'
                                }`}>
                                  {report.status === 'PENDING' ? 'Chờ duyệt' :
                                   report.status === 'APPROVED' ? 'Đã duyệt' :
                                   'Đã từ chối'}
                                </span>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              {report.status === 'PENDING' && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleAction(report.id, 'approve')}
                                    disabled={!!processingId}
                                    title="Phê duyệt"
                                  >
                                    {processingId === report.id ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <i className="bi bi-check-circle"></i>
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleAction(report.id, 'reject')}
                                    disabled={!!processingId}
                                    title="Từ chối"
                                  >
                                    {processingId === report.id ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <i className="bi bi-x-circle"></i>
                                    )}
                                  </button>
                                </>
                              )}
                              {report.status === 'APPROVED' && (
                                <button
                                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                  onClick={() => handleAction(report.id, 'reject')}
                                  disabled={!!processingId}
                                  title="Hủy phê duyệt"
                                >
                                  {processingId === report.id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <>
                                      <i className="bi bi-x-lg"></i>
                                      <span>Hủy duyệt</span>
                                    </>
                                  )}
                                </button>
                              )}
                              {report.status === 'REJECTED' && (
                                <button
                                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                  onClick={() => handleAction(report.id, 'approve')}
                                  disabled={!!processingId}
                                  title="Duyệt lại"
                                >
                                  {processingId === report.id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <>
                                      <i className="bi bi-check-lg"></i>
                                      <span>Duyệt lại</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          <table className="table table-sm mb-0">
                            <tbody>
                              <tr>
                                <th scope="row" style={{ width: '100px' }}>Vị trí:</th>
                                <td>
                                  {report.address || `${report.latitude}, ${report.longitude}`}
                                  <div className="mt-1">
                                    <a 
                                      href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                                    >
                                      <i className="bi bi-map"></i>
                                      <span>Xem trên bản đồ</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th scope="row">Mô tả:</th>
                                <td>{report.description}</td>
                              </tr>
                              <tr>
                                <th scope="row">Người báo cáo:</th>
                                <td>{report.user?.name || report.user?.email || 'Ẩn danh'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 