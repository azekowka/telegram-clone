"use client"

import { useState } from "react"
import { Search, Plus, Bot, User, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Chat } from "@/types/chat"
import { formatTime } from "@/lib/utils"
import { ThemeSelector } from "@/components/theme-selector"

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: string | null
  onChatSelect: (chatId: string) => void
}

export function ChatSidebar({ chats, activeChat, onChatSelect }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const aiChats = filteredChats.filter((chat) => chat.isAI)
  const humanChats = filteredChats.filter((chat) => !chat.isAI)

  return (
    <div className="h-full sidebar-bg border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Telegram Clone</h1>
          <div className="flex items-center gap-1">
            <ThemeSelector />
            <Button size="sm" variant="ghost" className="p-2">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск чатов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 search-input"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* AI Assistants Section */}
        {aiChats.length > 0 && (
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
              <Bot className="w-4 h-4" />
              ИИ-ассистенты
            </div>
            {aiChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={activeChat === chat.id}
                onClick={() => onChatSelect(chat.id)}
              />
            ))}
          </div>
        )}

        {/* Human Chats Section */}
        {humanChats.length > 0 && (
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
              <User className="w-4 h-4" />
              Люди
            </div>
            {humanChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={activeChat === chat.id}
                onClick={() => onChatSelect(chat.id)}
              />
            ))}
          </div>
        )}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <MessageCircle className="w-8 h-8 mb-2" />
            <p className="text-sm">Чаты не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface ChatItemProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
}

function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isActive ? "chat-item-active" : "chat-item-hover"
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
            chat.isAI ? "bg-purple-500" : "bg-blue-500"
          }`}
        >
          {chat.isAI ? <Bot className="w-6 h-6" /> : chat.name.charAt(0).toUpperCase()}
        </div>
        {chat.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 online-indicator rounded-full border-2 border-background"></div>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
          {chat.lastMessageTime && (
            <span className="text-xs text-muted-foreground">{formatTime(chat.lastMessageTime)}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || "Нет сообщений"}</p>
          {chat.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
