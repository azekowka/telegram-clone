"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatArea } from "@/components/chat-area"
import type { Chat, Message } from "@/types/chat"
import { mockChats, mockMessages } from "@/data/mock-data"

export default function HomePage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("telegram-chats")
    const savedMessages = localStorage.getItem("telegram-messages")

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      // Convert date strings back to Date objects
      const chatsWithDates = parsedChats.map((chat: Chat) => ({
        ...chat,
        lastMessageTime: chat.lastMessageTime ? new Date(chat.lastMessageTime) : undefined,
      }))
      setChats(chatsWithDates)
    } else {
      setChats(mockChats)
    }

    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      // Convert date strings back to Date objects
      const messagesWithDates: Record<string, Message[]> = {}
      Object.keys(parsedMessages).forEach((chatId) => {
        messagesWithDates[chatId] = parsedMessages[chatId].map((message: Message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }))
      })
      setMessages(messagesWithDates)
    } else {
      setMessages(mockMessages)
    }

    // Check if mobile
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

  // Save to localStorage when data changes
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("telegram-chats", JSON.stringify(chats))
    }
  }, [chats])

  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem("telegram-messages", JSON.stringify(messages))
    }
  }, [messages])

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

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }))

    // Update last message in chat
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat ? { ...chat, lastMessage: content.trim(), lastMessageTime: new Date() } : chat,
      ),
    )

    // Handle AI responses
    const currentChat = chats.find((c) => c.id === activeChat)
    if (currentChat?.aiType) {
      setTimeout(
        async () => {
          let aiResponseContent: string
          
          if (currentChat.aiType === 'gemini') {
            // Real Gemini AI response
            try {
              const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: content }),
              })
              
              if (response.ok) {
                const data = await response.json()
                aiResponseContent = data.response
              } else {
                aiResponseContent = "Извините, произошла ошибка при обращении к Gemini AI. Попробуйте позже."
              }
            } catch (error) {
              console.error('Error calling Gemini API:', error)
              aiResponseContent = "Извините, произошла ошибка при обращении к Gemini AI. Попробуйте позже."
            }
          } else if (currentChat.aiType === 'fake') {
            // Fake GPT responses
            aiResponseContent = generateFakeAIResponse()
          } else {
            return // No AI response for regular chats
          }

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: aiResponseContent,
            sender: "ai",
            timestamp: new Date(),
            status: "delivered",
          }

          setMessages((prev) => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), aiResponse],
          }))

          // Update chat with AI response
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === activeChat ? { ...chat, lastMessage: aiResponse.content, lastMessageTime: new Date() } : chat,
            ),
          )
        },
        1000 + Math.random() * 2000,
      ) // Random delay 1-3 seconds
    }
  }

  const generateFakeAIResponse = (): string => {
    const responses = [
      "Это интересный вопрос! Позвольте мне подумать над этим.",
      "Я понимаю вашу точку зрения. Вот что я думаю по этому поводу...",
      "Отличный вопрос! Основываясь на моих знаниях, могу сказать следующее:",
      "Это довольно сложная тема. Давайте разберем ее по частям.",
      "Спасибо за вопрос! Вот мой ответ:",
      "Интересно, что вы об этом спрашиваете. Мое мнение таково:",
      "Хм, это заставляет меня задуматься. Вот что я думаю:",
      "Отличная тема для обсуждения! Мой взгляд на это следующий:",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const currentChat = chats.find((c) => c.id === activeChat)
  const currentMessages = activeChat ? messages[activeChat] || [] : []

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <div className={`${isMobile ? (showSidebar ? "w-full" : "hidden") : "w-80"} transition-all duration-300`}>
        <ChatSidebar chats={chats} activeChat={activeChat} onChatSelect={handleChatSelect} />
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${isMobile && showSidebar ? "hidden" : "flex"} flex-col`}>
        <ChatArea
          chat={currentChat}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onBackToSidebar={handleBackToSidebar}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}
