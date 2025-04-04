export const REPORT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  DRIVER: 'DRIVER',
} as const

export const DASHBOARD_VIEW = {
  CARD: 'card',
  TABLE: 'table',
  MAP: 'map',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
  },
  REPORTS: {
    LIST: '/api/reports',
    DETAIL: (id: string) => `/api/reports/${id}`,
    CREATE: '/api/reports',
    UPDATE: (id: string) => `/api/reports/${id}`,
    DELETE: (id: string) => `/api/reports/${id}`,
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    REPORTS: '/api/dashboard/reports',
  },
} as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Bạn không có quyền truy cập',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
  INVALID_INPUT: 'Dữ liệu không hợp lệ',
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ',
} as const

export const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',
  APPROVED: 'Duyệt thành công',
  REJECTED: 'Từ chối thành công',
} as const 