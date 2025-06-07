import type { Chat, Message } from "@/types/chat"

// Define messages first
const message1: Message[] = [
  {
    id: "1",
    content: "Привет! Как дела?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    status: "read",
  },
  {
    id: "2",
    content: "Привет! У меня всё отлично, спасибо за вопрос. Я готов помочь вам с любыми задачами. Чем могу быть полезен?",
    sender: "ai",
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    status: "delivered",
  },
  {
    id: "3",
    content: "Можешь помочь с изучением React?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    status: "read",
  },
  {
    id: "4",
    content: "Конечно! React - это отличная библиотека для создания пользовательских интерфейсов. С чего бы вы хотели начать? Могу рассказать об основах компонентов, хуках или чем-то более специфическом.",
    sender: "ai",
    timestamp: new Date(Date.now() - 1000 * 60 * 7),
    status: "delivered",
  },
]

const message2: Message[] = [
  {
    id: "5",
    content: "Расскажи о себе",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    status: "read",
  },
  {
    id: "6",
    content: "Привет! Я Gemini - AI ассистент от Google. Я могу помочь с различными задачами: ответить на вопросы, помочь с написанием текстов, решением проблем и многим другим. Готов к общению!",
    sender: "ai",
    timestamp: new Date(Date.now() - 1000 * 60 * 19),
    status: "delivered",
  },
]

const message3: Message[] = [
  {
    id: "7",
    content: "Привет, Абдулазиз! Как прошла встреча?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: "read",
  },
  {
    id: "8",
    content: "Привет! Встреча прошла отлично, все вопросы решили. Завтра увидимся в офисе?",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    status: "delivered",
  },
  {
    id: "9",
    content: "Да, конечно! До встречи завтра",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    status: "read",
  },
  {
    id: "10",
    content: "Увидимся завтра! 👋",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "delivered",
  },
]

const message4: Message[] = [
  {
    id: "11",
    content: "Бахредин, можешь помочь с проектом?",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: "read",
  },
  {
    id: "12",
    content: "Конечно, что нужно сделать?",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    status: "delivered",
  },
  {
    id: "13",
    content: "Нужно проверить код на ошибки",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.3),
    status: "read",
  },
  {
    id: "14",
    content: "Отправляй, посмотрю сегодня вечером",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.1),
    status: "delivered",
  },
  {
    id: "15",
    content: "Спасибо за помощь! 🙏",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "read",
  },
]

// Now define chats with embedded messages
export const chats: Chat[] = [
  {
    id: "1",
    name: "Fake GPT",
    isOnline: true,
    isAI: true,
    aiType: 'fake',
    lastMessage: "Чем могу помочь?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 0,
    messages: message1,
  },
  {
    id: "2",
    name: "Gemini AI",
    isOnline: true,
    isAI: true,
    aiType: 'gemini',
    lastMessage: "Готов к общению!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 1,
    messages: message2,
  },
  {
    id: "3",
    name: "Абдулазиз Студент",
    isOnline: true,
    isAI: false,
    aiType: null,
    lastMessage: "Увидимся завтра!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
    messages: message3,
  },
  {
    id: "4",
    name: "Бахредин Ментор",
    isOnline: false,
    isAI: false,
    aiType: null,
    lastMessage: "Спасибо за помощь",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    messages: message4,
  },
]

// Legacy exports for compatibility
export const mockChats = chats
export const mockMessages: Record<string, Message[]> = {
  "1": message1,
  "2": message2,
  "3": message3,
  "4": message4,
}
