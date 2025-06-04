"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Smile, Paperclip, Phone, Video, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Chat, Message } from "@/types/chat"
import { MessageBubble } from "@/components/message-bubble"
import { EmojiPicker } from "@/components/emoji-picker"

interface ChatAreaProps {
  chat?: Chat
  messages: Message[]
  onSendMessage: (content: string) => void
  onBackToSidebar: () => void
  isMobile: boolean
}

export function ChatArea({ chat, messages, onSendMessage, onBackToSidebar, isMobile }: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate AI typing indicator
  useEffect(() => {
    if (chat?.isAI && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === "user") {
        setIsTyping(true)
        const timer = setTimeout(() => setIsTyping(false), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [messages, chat?.isAI])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput)
      setMessageInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji)
    setShowEmojiPicker(false)
    // Focus back to textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center text-muted-foreground">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Выберите чат</h3>
          <p className="text-sm">Выберите чат из списка, чтобы начать общение</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onBackToSidebar} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                chat.isAI ? "bg-purple-500" : "bg-blue-500"
              }`}
            >
              {chat.isAI ? "🤖" : chat.name.charAt(0).toUpperCase()}
            </div>
            {chat.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 online-indicator rounded-full border-2 border-background"></div>
            )}
          </div>

          <div>
            <h2 className="font-medium text-foreground">{chat.name}</h2>
            <p className="text-sm text-muted-foreground">
              {chat.isAI ? "ИИ-ассистент" : chat.isOnline ? "в сети" : "был(а) недавно"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-area-bg chat-background">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isConsecutive={
              index > 0 &&
              messages[index - 1].sender === message.sender &&
              new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 60000
            }
          />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 typing-indicator text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 typing-dot rounded-full animate-bounce"></div>
              <div className="w-2 h-2 typing-dot rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 typing-dot rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span>{chat.name} печатает...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area p-4">
        <div className="flex items-end gap-3">
          <Button variant="ghost" size="sm" className="p-2 mb-1">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={messageInput}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="min-h-[40px] max-h-[120px] resize-none border-gray-300 rounded-2xl pr-12"
              rows={1}
            />
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-1 p-2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5" />
              </Button>
              <EmojiPicker
                isOpen={showEmojiPicker}
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 mb-1"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
