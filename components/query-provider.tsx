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
            // Отключаем рефетч при реконнекте для стабильности
            refetchOnReconnect: false,
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

  // Не рендерим QueryClient до полного монтирования
  if (!mounted) {
    return <div className="flex h-screen items-center justify-center bg-muted/30">
      <div className="text-lg">Загрузка...</div>
    </div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
} 