import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { marketplaceApi } from '@/services/marketplace.api'
import { useSnackbar } from '@/app/SnackbarProvider'
import type { CreateMarketplacePayload } from '@/types/marketplace.types'

export const MARKETPLACE_KEYS = {
  list: (params?: Record<string, unknown>) => ['marketplace', params] as const,
  userList: ['marketplace', 'user'] as const,
}

export const useMarketplaceListings = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: MARKETPLACE_KEYS.list(params),
    queryFn: () => marketplaceApi.list(params),
    staleTime: 30_000,
  })

export const useUserMarketplaceListings = () =>
  useQuery({
    queryKey: MARKETPLACE_KEYS.userList,
    queryFn: marketplaceApi.userList,
    staleTime: 30_000,
  })

export const useCreateMarketplaceListing = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMarketplacePayload) => marketplaceApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] })
      showSuccess('Product listed for sale!')
    },
    onError: () => {
      showError('Failed to list product.')
    },
  })
}

export const useDeleteMarketplaceListing = () => {
  const { showInfo, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => marketplaceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] })
      showInfo('Listing removed.')
    },
    onError: () => {
      showError('Failed to remove listing.')
    },
  })
}
