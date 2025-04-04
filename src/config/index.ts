export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  auth: {
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
    updateSessionInterval: 24 * 60 * 60, // 24 hours
  },
  map: {
    defaultCenter: {
      lat: 10.762622,
      lng: 106.660172,
    },
    defaultZoom: 13,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
  },
} as const

export type Config = typeof config 