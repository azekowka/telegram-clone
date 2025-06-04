import type { Chat, Message } from "@/types/chat"

export const mockChats: Chat[] = [
  {
    id: "1",
    name: "GPT Assistant",
    isOnline: true,
    isAI: true,
    lastMessage: "Чем могу помочь?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 0,
  },
  {
    id: "2",
    name: "Claude AI",
    isOnline: true,
    isAI: true,
    lastMessage: "Готов к общению!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 1,
  },
  {
    id: "3",
    name: "Анна Петрова",
    isOnline: true,
    isAI: false,
    lastMessage: "Увидимся завтра!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
  },
  {
    id: "4",
    name: "Иван Сидоров",
    isOnline: false,
    isAI: false,
    lastMessage: "Спасибо за помощь",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
  },
  {
    id: "5",
    name: "Coding Assistant",
    isOnline: true,
    isAI: true,
    lastMessage: "Помогу с программированием",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
  },
]

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Привет! Как дела?",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: "read",
    },
    {
      id: "2",
      content:
        "Привет! У меня всё отлично, спасибо за вопрос. Я готов помочь вам с любыми задачами. Чем могу быть полезен?",
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
      content:
        "Конечно! React - это отличная библиотека для создания пользовательских интерфейсов. С чего бы вы хотели начать? Могу рассказать об основах компонентов, хуках или чем-то более специфическом.",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "5",
      content: "Расскажи о себе",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      status: "read",
    },
    {
      id: "6",
      content:
        "Я Claude - ИИ-ассистент, созданный Anthropic. Я могу помочь с различными задачами: от написания текстов до решения сложных проблем. Готов к общению!",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 19),
      status: "delivered",
    },
  ],
  "3": [
    {
      id: "7",
      content: "Привет, Анна! Как прошла встреча?",
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
  ],
  "4": [
    {
      id: "11",
      content: "Иван, можешь помочь с проектом?",
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
  ],
  "5": [
    {
      id: "16",
      content: "Помоги с TypeScript",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: "read",
    },
    {
      id: "17",
      content:
        "С удовольствием помогу с TypeScript! Это мощный инструмент для разработки. С какой конкретной задачей нужна помощь? Типизация, интерфейсы, дженерики или что-то другое?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
      status: "delivered",
    },
  ],
}
