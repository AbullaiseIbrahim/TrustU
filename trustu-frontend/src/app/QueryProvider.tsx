import React from 'react'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { emitGlobalApiError, getApiErrorMessage } from '@/utils/errorBus'

const queryClient = new QueryClient({
  // Catch-all error surfacing: every failed query or mutation, anywhere in the
  // app, gets routed to the global snackbar via the error bus — regardless of
  // whether the hook that made the call has its own success/error handling.
  // See src/utils/errorBus.ts for why this can't just call useSnackbar() here.
  queryCache: new QueryCache({
    onError: (error) => emitGlobalApiError(getApiErrorMessage(error)),
  }),
  mutationCache: new MutationCache({
    onError: (error) => emitGlobalApiError(getApiErrorMessage(error)),
  }),
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        const e = error as { status?: number }
        if (e?.status && e.status >= 400 && e.status < 500) return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
})

export { queryClient }

const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

export default QueryProvider
