import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  accommodationApi,
  type CreateAccommodationPayload,
  type UpdateAccommodationPayload,
} from '@/services/accommodation.api'
import { useSnackbar } from '@/app/SnackbarProvider'

export const ACCOMMODATION_KEYS = {
  list: (params?: Record<string, unknown>) => ['accommodations', params] as const,
  userList: ['accommodations', 'user'] as const,
  detail: (id: string) => ['accommodations', id] as const,
}

export const useAccommodations = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ACCOMMODATION_KEYS.list(params),
    queryFn: () => accommodationApi.list(params),
    staleTime: 30_000,
  })

export const useUserAccommodations = () =>
  useQuery({
    queryKey: ACCOMMODATION_KEYS.userList,
    queryFn: accommodationApi.userList,
    staleTime: 30_000,
  })

export const useAccommodationDetail = (id: string) =>
  useQuery({
    queryKey: ACCOMMODATION_KEYS.detail(id),
    queryFn: () => accommodationApi.detail(id),
    enabled: !!id,
  })

export const useCreateAccommodation = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAccommodationPayload) => accommodationApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] })
      showSuccess('Accommodation listed successfully!')
    },
    onError: () => {
      showError('Failed to create listing. Please try again.')
    },
  })
}

export const useUpdateAccommodation = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAccommodationPayload) => accommodationApi.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] })
      showSuccess('Accommodation updated successfully!')
    },
    onError: () => {
      showError('Failed to update listing.')
    },
  })
}

export const useDeleteAccommodation = () => {
  const { showInfo, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accommodationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] })
      showInfo('Listing removed.')
    },
    onError: () => {
      showError('Failed to remove listing.')
    },
  })
}
