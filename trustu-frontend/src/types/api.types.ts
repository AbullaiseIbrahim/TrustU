export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  message: string
  success: boolean
}

export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number
  to: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}
