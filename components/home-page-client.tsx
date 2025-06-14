"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatArea } from "@/components/chat-area"
import type { Message } from "@/types/chat"
import { useChats, useSendMessage, useAddMessage } from "@/hooks/use-chat-queries"

export default function HomePageClient() {
  const [isClient, setIsClient] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  // TanStack Query hooks - только на клиенте
  const { data: chats = [], isLoading: chatsLoading, error: chatsError } = useChats()
  const sendMessageMutation = useSendMessage()
  const addMessageMutation = useAddMessage()

  // Убеждаемся, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Дополнительная диагностика для Vercel
  useEffect(() => {
    if (chatsError) {
      console.error('Chat loading error on Vercel:', chatsError)
    }
    if (chats.length > 0) {
      console.log('Chats loaded successfully:', chats.length)
    }
  }, [chats, chatsError])

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setShowSidebar(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Показываем загрузку пока не убедимся что мы на клиенте
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/30">
        <div className="text-lg">Инициализация...</div>
      </div>
    )
  }

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  const handleBackToSidebar = () => {
    setShowSidebar(true)
    setActiveChat(null)
  }

  const handleSendMessage = async (content: string) => {
    if (!activeChat || !content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    }

    // Добавляем пользовательское сообщение
    try {
      await addMessageMutation.mutateAsync({
        chatId: activeChat,
        message: newMessage,
      })

      // Получаем текущий чат для проверки AI типа
      const currentChat = chats.find((c) => c.id === activeChat)
      
      if (currentChat?.aiType) {
        // Отправляем запрос к AI с небольшой задержкой
        setTimeout(async () => {
          try {
            const response = await sendMessageMutation.mutateAsync({
              message: content.trim(),
              chatId: activeChat,
              aiType: currentChat.aiType,
            })

            const aiResponse: Message = {
              id: (Date.now() + 1).toString(),
              content: response.response,
              sender: "ai",
              timestamp: new Date(),
              status: "delivered",
            }

            // Добавляем ответ AI
            await addMessageMutation.mutateAsync({
              chatId: activeChat,
              message: aiResponse,
            })
          } catch (error) {
            console.error('Error getting AI response:', error)
            // Добавляем сообщение об ошибке
            const errorMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: "Извините, произошла ошибка при получении ответа. Попробуйте позже.",
              sender: "ai",
              timestamp: new Date(),
              status: "delivered",
            }

            await addMessageMutation.mutateAsync({
              chatId: activeChat,
              message: errorMessage,
            })
          }
        }, 1000 + Math.random() * 2000) // Случайная задержка 1-3 секунды
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Обработка состояний загрузки и ошибок
  if (chatsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/30">
        <div className="text-lg">Загрузка чатов...</div>
      </div>
    )
  }

  if (chatsError) {
    console.error('Full error details:', chatsError)
    return (
      <div className="flex h-screen items-center justify-center bg-red-50">
        <div className="text-center max-w-md p-6">
          <div className="text-red-600 text-lg mb-2">Ошибка загрузки чатов</div>
          <div className="text-sm text-gray-600 mb-4">
            {chatsError instanceof Error ? chatsError.message : 'Неизвестная ошибка'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Попробовать снова
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-xs text-gray-500">
                Детали ошибки (dev only)
              </summary>
              <pre className="mt-2 text-xs text-red-500 overflow-auto">
                {JSON.stringify(chatsError, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  const currentChat = chats.find((c) => c.id === activeChat)
  const currentMessages = activeChat ? currentChat?.messages || [] : []

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <div className={`${isMobile ? (showSidebar ? "w-full" : "hidden") : "w-80"} transition-all duration-300`}>
        <ChatSidebar 
          chats={chats} 
          activeChat={activeChat} 
          onChatSelect={handleChatSelect}
        />
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${isMobile && showSidebar ? "hidden" : "flex"} flex-col`}>
        <ChatArea
          chat={currentChat}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onBackToSidebar={handleBackToSidebar}
          isMobile={isMobile}
          isLoading={sendMessageMutation.isPending || addMessageMutation.isPending}
        />
      </div>
    </div>
  )
} 