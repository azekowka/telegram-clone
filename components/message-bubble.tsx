"use client"

import { Check, CheckCheck } from "lucide-react"
import type { Message } from "@/types/chat"
import { formatTime } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
  isConsecutive?: boolean
}

export function MessageBubble({ message, isConsecutive }: MessageBubbleProps) {
  const isUser = message.sender === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} ${isConsecutive ? "mt-1" : "mt-4"}`}>
      <div className={`max-w-[70%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser ? "message-out rounded-br-md" : "message-in rounded-bl-md shadow-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        <div
          className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${isUser ? "justify-end" : "justify-start"}`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isUser && (
            <div className="flex items-center">
              {message.status === "sent" && <Check className="w-3 h-3" />}
              {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
              {message.status === "read" && <CheckCheck className="w-3 h-3 text-blue-500" />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
