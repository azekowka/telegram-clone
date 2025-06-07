'use client'

import React, { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  
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

  // Обеспечиваем, что компонент рендерится только на клиенте
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
} 