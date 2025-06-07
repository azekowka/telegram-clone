'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Создаем клиент в компоненте, чтобы избежать проблем с SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Время кеширования данных (5 минут)
            staleTime: 5 * 60 * 1000,
            // Время хранения неактивных данных в памяти (10 минут)
            gcTime: 10 * 60 * 1000,
            // Повторные запросы при ошибках
            retry: 1,
            // Фоновое обновление при фокусе окна
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
} 