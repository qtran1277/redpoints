import { useState, useCallback } from 'react'
import { config } from '@/config'

type ApiResponse<T> = {
  data: T | null
  error: string | null
  isLoading: boolean
}

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    isLoading: false,
  })

  const fetchData = useCallback(async (endpoint: string, options: ApiOptions = {}) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setState({ data, error: null, isLoading: false })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setState({ data: null, error: errorMessage, isLoading: false })
      throw error
    }
  }, [])

  return {
    ...state,
    fetchData,
  }
} 