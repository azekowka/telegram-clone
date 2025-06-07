export interface Chat {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  isAI: boolean
  aiType?: 'gemini' | 'fake' | null
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  messages?: Message[]
}

export interface Message {
  id: string
  content: string
  sender: "user" | "ai" | "other"
  timestamp: Date
  status: "sent" | "delivered" | "read"
  replyTo?: string
}

export type MessageStatus = "sent" | "delivered" | "read"
