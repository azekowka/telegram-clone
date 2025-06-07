'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Типы для пользовательских настроек
interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'ru' | 'en'
  notifications: boolean
  soundEnabled: boolean
  fontSize: 'small' | 'medium' | 'large'
  chatBackground: string
}

interface UserProfile {
  id: string
  name: string
  username: string
  avatar?: string
  status: string
  lastSeen: Date
}

// Ключи для запросов
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  preferences: () => [...userKeys.all, 'preferences'] as const,
  settings: (section: string) => [...userKeys.all, 'settings', section] as const,
}

// Хук для получения профиля пользователя
export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async (): Promise<UserProfile> => {
      // Здесь можно заменить на реальный API вызов
      const storedProfile = localStorage.getItem('user-profile')
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile)
        return {
          ...parsed,
          lastSeen: new Date(parsed.lastSeen)
        }
      }
      
      // Возвращаем моковый профиль
      return {
        id: 'user-1',
        name: 'Вы',
        username: '@you',
        status: 'В сети',
        lastSeen: new Date(),
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  })
}

// Хук для получения пользовательских настроек
export function useUserPreferences() {
  return useQuery({
    queryKey: userKeys.preferences(),
    queryFn: async (): Promise<UserPreferences> => {
      const storedPrefs = localStorage.getItem('user-preferences')
      if (storedPrefs) {
        return JSON.parse(storedPrefs)
      }
      
      // Возвращаем настройки по умолчанию
      return {
        theme: 'system',
        language: 'ru',
        notifications: true,
        soundEnabled: true,
        fontSize: 'medium',
        chatBackground: 'default',
      }
    },
    staleTime: 10 * 60 * 1000, // 10 минут
  })
}

// Хук для обновления профиля пользователя
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      // В реальном приложении здесь был бы API вызов
      const currentProfile = queryClient.getQueryData<UserProfile>(userKeys.profile())
      const updatedProfile = { ...currentProfile, ...updates }
      
      localStorage.setItem('user-profile', JSON.stringify(updatedProfile))
      return updatedProfile
    },
    onSuccess: (data) => {
      // Обновляем кеш профиля
      queryClient.setQueryData(userKeys.profile(), data)
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
    },
  })
}

// Хук для обновления настроек
export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      const currentPrefs = queryClient.getQueryData<UserPreferences>(userKeys.preferences())
      const updatedPrefs = { ...currentPrefs, ...updates }
      
      localStorage.setItem('user-preferences', JSON.stringify(updatedPrefs))
      return updatedPrefs
    },
    onSuccess: (data) => {
      // Обновляем кеш настроек
      queryClient.setQueryData(userKeys.preferences(), data)
    },
    onError: (error) => {
      console.error('Error updating preferences:', error)
    },
  })
}

// Хук для очистки пользовательских данных (выход из аккаунта)
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Очищаем localStorage
      localStorage.removeItem('user-profile')
      localStorage.removeItem('user-preferences')
      localStorage.removeItem('telegram-chats')
      localStorage.removeItem('telegram-messages')
      
      return true
    },
    onSuccess: () => {
      // Очищаем весь кеш
      queryClient.clear()
    },
  })
} 