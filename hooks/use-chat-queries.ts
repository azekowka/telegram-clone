'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Chat, Message } from '@/types/chat'

// Типы для API
interface SendMessageRequest {
  message: string
  chatId: string
  aiType?: 'gemini' | 'fake' | null
}

interface SendMessageResponse {
  response: string
}

// Ключи для запросов
export const chatKeys = {
  all: ['chats'] as const,
  chat: (id: string) => ['chats', id] as const,
  messages: (chatId: string) => ['chats', chatId, 'messages'] as const,
}

// Хук для получения чатов
export function useChats() {
  return useQuery({
    queryKey: chatKeys.all,
    queryFn: async (): Promise<Chat[]> => {
      // Пытаемся мигрировать старые данные
      const { migrateOldDataFormat, validateAndFixChatsData } = await import('@/lib/localStorage-utils')
      migrateOldDataFormat()
      
      // Проверяем и исправляем данные
      const validatedChats = validateAndFixChatsData()
      if (validatedChats) {
        return validatedChats
      }
      
      // Возвращаем моковые данные, если нет сохраненных
      const { chats } = await import('@/data/mock-data')
      // Убеждаемся, что каждый чат имеет массив сообщений
      return chats.map((chat: Chat) => ({
        ...chat,
        messages: Array.isArray(chat.messages) ? chat.messages : []
      }))
    },
    staleTime: 30 * 1000, // 30 секунд
  })
}

// Хук для получения конкретного чата
export function useChat(chatId: string) {
  return useQuery({
    queryKey: chatKeys.chat(chatId),
    queryFn: async (): Promise<Chat | undefined> => {
      const storedChats = localStorage.getItem('telegram-chats')
      let chats: Chat[] = []
      
      if (storedChats) {
        const parsedChats = JSON.parse(storedChats)
        chats = parsedChats.map((chat: Chat) => ({
          ...chat,
          messages: Array.isArray(chat.messages) ? chat.messages : []
        }))
      } else {
        const { chats: mockChats } = await import('@/data/mock-data')
        chats = mockChats.map((chat: Chat) => ({
          ...chat,
          messages: Array.isArray(chat.messages) ? chat.messages : []
        }))
      }
      
      return chats.find(chat => chat.id === chatId)
    },
    enabled: !!chatId,
  })
}

// Хук для получения сообщений чата
export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: chatKeys.messages(chatId),
    queryFn: async (): Promise<Message[]> => {
      const storedChats = localStorage.getItem('telegram-chats')
      let chats: Chat[] = []
      
      if (storedChats) {
        const parsedChats = JSON.parse(storedChats)
        chats = parsedChats.map((chat: Chat) => ({
          ...chat,
          messages: Array.isArray(chat.messages) ? chat.messages : []
        }))
      } else {
        const { chats: mockChats } = await import('@/data/mock-data')
        chats = mockChats.map((chat: Chat) => ({
          ...chat,
          messages: Array.isArray(chat.messages) ? chat.messages : []
        }))
      }
      
      const chat = chats.find(chat => chat.id === chatId)
      return Array.isArray(chat?.messages) ? chat.messages : []
    },
    enabled: !!chatId,
  })
}

// Хук для отправки сообщения через Gemini AI
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ message, chatId, aiType }: SendMessageRequest): Promise<SendMessageResponse> => {
      if (aiType === 'fake') {
        // Фейковый ответ
        const fakeResponses = [
          "Это имитация GPT. Настоящий AI здесь не используется.",
          "Простая заглушка без реального AI.",
          "Обычная предустановленная фраза вместо AI.",
        ]
        const randomResponse = fakeResponses[Math.floor(Math.random() * fakeResponses.length)]
        return { response: randomResponse }
      }

      if (aiType === 'gemini') {
        // Реальный запрос к Gemini AI
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message to Gemini AI')
        }

        return await response.json()
      }

      // Обычное сообщение без AI
      return { response: 'Message sent' }
    },
    onSuccess: (data, variables) => {
      // Обновляем кеш сообщений чата
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId)
      })
      
      // Обновляем кеш чатов
      queryClient.invalidateQueries({
        queryKey: chatKeys.all
      })
    },
    onError: (error) => {
      console.error('Error sending message:', error)
    },
  })
}

// Хук для обновления чата
export function useUpdateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chatId, updates }: { chatId: string; updates: Partial<Chat> }) => {
      // Здесь можно добавить API вызов для обновления чата
      const chats = queryClient.getQueryData<Chat[]>(chatKeys.all) || []
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          const updatedChat = { ...chat, ...updates }
          // Убеждаемся, что messages всегда является массивом
          updatedChat.messages = Array.isArray(updatedChat.messages) ? updatedChat.messages : []
          return updatedChat
        }
        return chat
      })
      
      // Обновляем localStorage
      localStorage.setItem('telegram-chats', JSON.stringify(updatedChats))
      
      return updatedChats
    },
    onSuccess: () => {
      // Инвалидируем все связанные запросы
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
    },
  })
}

// Хук для добавления нового сообщения
export function useAddMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chatId, message }: { chatId: string; message: Message }) => {
      const chats = queryClient.getQueryData<Chat[]>(chatKeys.all) || []
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          // Убеждаемся, что messages всегда является массивом
          const currentMessages = Array.isArray(chat.messages) ? chat.messages : []
          return {
            ...chat,
            messages: [...currentMessages, message],
            lastMessage: message.content,
            timestamp: message.timestamp,
          }
        }
        return chat
      })
      
      // Обновляем localStorage
      localStorage.setItem('telegram-chats', JSON.stringify(updatedChats))
      
      return updatedChats
    },
    onSuccess: (_, variables) => {
      // Инвалидируем запросы для обновления UI
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.chatId) })
    },
  })
} 