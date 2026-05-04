import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
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
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} position="bottom" />}
  </QueryClientProvider>
)

export default QueryProvider
