import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { proxyApi } from '@/services/proxy.api'
import { useSnackbar } from '@/app/SnackbarProvider'
import type { CreateProxyPayload } from '@/types/proxy.types'

export const PROXY_KEYS = {
  list: (params?: Record<string, unknown>) => ['proxy', params] as const,
  userList: ['proxy', 'user'] as const,
}

export const useProxyListings = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: PROXY_KEYS.list(params),
    queryFn: () => proxyApi.list(params),
    staleTime: 30_000,
  })

export const useUserProxyListings = () =>
  useQuery({
    queryKey: PROXY_KEYS.userList,
    queryFn: proxyApi.userList,
    staleTime: 30_000,
  })

export const useCreateProxy = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProxyPayload) => proxyApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proxy'] })
      showSuccess('Proxy service listed!')
    },
    onError: () => {
      showError('Failed to create proxy listing.')
    },
  })
}

export const useDeleteProxy = () => {
  const { showInfo, showError } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => proxyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proxy'] })
      showInfo('Proxy listing removed.')
    },
    onError: () => {
      showError('Failed to remove listing.')
    },
  })
}
