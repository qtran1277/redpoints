'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Spinner from '@/components/Spinner'
import ReportList from '@/components/ReportList'
import { Report } from '@/types'

export default function Home() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4 mb-3">Red Points</h1>
          <p className="lead mb-4">Nền tảng cộng đồng giúp cải thiện an toàn giao thông</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-5 mb-3">
                <i className="bi bi-geo-alt text-primary"></i>
              </div>
              <h3 className="h4 mb-3">Báo cáo điểm đen</h3>
              <p className="text-muted">Dễ dàng báo cáo các điểm đen giao thông với vị trí chính xác trên bản đồ và mô tả chi tiết.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-5 mb-3">
                <i className="bi bi-people text-success"></i>
              </div>
              <h3 className="h4 mb-3">Cộng đồng an toàn</h3>
              <p className="text-muted">Cùng nhau xây dựng cộng đồng giao thông an toàn bằng cách chia sẻ thông tin và cảnh báo kịp thời.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-5 mb-3">
                <i className="bi bi-shield-check text-info"></i>
              </div>
              <h3 className="h4 mb-3">Xác minh và xử lý</h3>
              <p className="text-muted">Các báo cáo được xác minh và chuyển đến cơ quan chức năng để xử lý kịp thời, đảm bảo an toàn.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-8 offset-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body p-4">
              <h3 className="h4 mb-3 text-center">Cách thức hoạt động</h3>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="h5 mb-2">
                      <i className="bi bi-1-circle me-2"></i>
                      Đăng nhập
                    </div>
                    <p className="small text-muted">Đăng nhập nhanh chóng với tài khoản Google của bạn</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="h5 mb-2">
                      <i className="bi bi-2-circle me-2"></i>
                      Báo cáo
                    </div>
                    <p className="small text-muted">Chọn vị trí và cung cấp thông tin về điểm đen</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="h5 mb-2">
                      <i className="bi bi-3-circle me-2"></i>
                      Theo dõi
                    </div>
                    <p className="small text-muted">Theo dõi trạng thái xử lý của báo cáo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <p className="lead mb-4">Hãy tham gia cùng chúng tôi để xây dựng một môi trường giao thông an toàn hơn</p>
          <a href="/report" className="btn btn-primary btn-lg">
            <i className="bi bi-plus-circle me-2"></i>
            Tạo báo cáo mới
          </a>
        </div>
      </div>
    </div>
  )
} 