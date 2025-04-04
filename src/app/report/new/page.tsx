'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap'
import { MapPin, Image as ImageIcon, Navigation } from 'lucide-react'
import { toast } from 'react-toastify'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Lấy token từ biến môi trường
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

type ReportType = {
  id: string
  name: string
  description: string
  icon: string
}

const NewReportPage: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [loading, setLoading] = useState(false)
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reportTypeId: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const response = await fetch('/api/report-types')
        if (!response.ok) throw new Error('Failed to fetch report types')
        const data = await response.json()
        setReportTypes(data)
      } catch (error) {
        console.error('Error fetching report types:', error)
        toast.error('Không thể tải danh sách loại báo cáo')
      }
    }

    fetchReportTypes()
  }, [])

  // Khởi tạo bản đồ Mapbox
  useEffect(() => {
    if (map.current) return // Bản đồ đã được khởi tạo

    if (!mapContainer.current) return // Container chưa sẵn sàng

    // Tạo bản đồ mới
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.8342, 21.0278], // Tọa độ Hà Nội
      zoom: 12
    })

    // Thêm điều khiển zoom
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Xử lý sự kiện click trên bản đồ
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat
      
      // Cập nhật marker
      if (marker.current) {
        marker.current.setLngLat([lng, lat])
      } else {
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!)
      }

      // Lấy địa chỉ từ tọa độ
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        )
        const data = await response.json()
        const address = data.display_name

        setLocation({ latitude: lat, longitude: lng, address })
        toast.success('Đã chọn vị trí trên bản đồ')
      } catch (error) {
        console.error('Error getting address:', error)
        toast.error('Không thể lấy địa chỉ từ tọa độ')
      }
    })

    // Cleanup khi component unmount
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      toast.error('Trình duyệt của bạn không hỗ trợ định vị')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Di chuyển bản đồ đến vị trí hiện tại
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15
            })
          }
          
          // Cập nhật marker
          if (marker.current) {
            marker.current.setLngLat([longitude, latitude])
          } else if (map.current) {
            marker.current = new mapboxgl.Marker()
              .setLngLat([longitude, latitude])
              .addTo(map.current)
          }
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          const address = data.display_name

          setLocation({ latitude, longitude, address })
          toast.success('Đã lấy được vị trí hiện tại')
        } catch (error) {
          console.error('Error getting address:', error)
          toast.error('Không thể lấy địa chỉ từ tọa độ')
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        toast.error('Không thể lấy vị trí hiện tại')
        setLoading(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return

    if (!location) {
      toast.error('Vui lòng chọn vị trí trên bản đồ hoặc lấy vị trí hiện tại')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      })

      if (!response.ok) throw new Error('Failed to create report')
      toast.success('Tạo báo cáo thành công')
      router.push('/report/bootstrap')
    } catch (error) {
      console.error('Error creating report:', error)
      toast.error('Không thể tạo báo cáo')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Báo cáo giao thông mới</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Đường ướt trơn trượt sau mưa, Đèn giao thông bị hỏng, Ổ gà lớn trên đường..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Form.Text className="text-muted">
                Nhập tiêu đề ngắn gọn mô tả vấn đề giao thông bạn muốn báo cáo
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ví dụ: Đoạn đường này thường xuyên bị ngập nước sau mưa, gây nguy hiểm cho người điều khiển xe máy. Đã có nhiều vụ tai nạn xảy ra tại đây..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Form.Text className="text-muted">
                Mô tả chi tiết về vấn đề, thời gian xảy ra, mức độ nguy hiểm và bất kỳ thông tin nào khác 
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Loại báo cáo</Form.Label>
              <Form.Select
                value={formData.reportTypeId}
                onChange={(e) => setFormData({ ...formData, reportTypeId: e.target.value })}
                required
              >
                <option value="">Chọn loại báo cáo</option>
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vị trí</Form.Label>
              <div className="d-flex gap-2 align-items-center mb-2">
                <Button
                  variant="outline-primary"
                  onClick={handleLocationClick}
                  disabled={loading}
                  className="d-flex align-items-center gap-2"
                >
                  <Navigation size={16} />
                  Lấy vị trí hiện tại
                </Button>
                {location && (
                  <small className="text-muted">
                    {location.address}
                  </small>
                )}
              </div>
              <div 
                ref={mapContainer} 
                className="map-container" 
                style={{ height: '300px', width: '100%', borderRadius: '4px', overflow: 'hidden' }}
              />
              <Form.Text className="text-muted">
                Nhấp vào bản đồ để chọn vị trí hoặc sử dụng nút "Lấy vị trí hiện tại"
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang xử lý...
                  </>
                ) : (
                  'Gửi báo cáo'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default NewReportPage 