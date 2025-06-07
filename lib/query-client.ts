'use client'

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
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