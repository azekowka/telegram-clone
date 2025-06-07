import type { Chat } from '@/types/chat'

export function clearAllLocalStorageData() {
  localStorage.removeItem('telegram-chats')
  localStorage.removeItem('telegram-messages')
  localStorage.removeItem('user-profile')
  localStorage.removeItem('user-preferences')
}

export function resetChatsData() {
  localStorage.removeItem('telegram-chats')
  // Принудительно перезагружаем страницу для очистки кеша React Query
  window.location.reload()
}

export function validateAndFixChatsData(): Chat[] | null {
  try {
    const storedChats = localStorage.getItem('telegram-chats')
    if (!storedChats) return null

    const parsedChats = JSON.parse(storedChats)
    
    // Проверяем и исправляем структуру данных
    const validatedChats = parsedChats.map((chat: any) => ({
      ...chat,
      messages: Array.isArray(chat.messages) ? chat.messages : [],
      lastMessageTime: chat.lastMessageTime ? new Date(chat.lastMessageTime) : undefined,
    }))

    // Сохраняем исправленные данные
    localStorage.setItem('telegram-chats', JSON.stringify(validatedChats))
    
    return validatedChats
  } catch (error) {
    console.error('Error validating chats data:', error)
    // Если данные повреждены, очищаем их
    localStorage.removeItem('telegram-chats')
    return null
  }
}

// Функция для миграции старых данных в новый формат
export function migrateOldDataFormat() {
  try {
    const oldChats = localStorage.getItem('telegram-chats')
    const oldMessages = localStorage.getItem('telegram-messages')

    if (oldChats && oldMessages) {
      const chats = JSON.parse(oldChats)
      const messages = JSON.parse(oldMessages)

      // Объединяем чаты с сообщениями
      const migratedChats = chats.map((chat: Chat) => ({
        ...chat,
        messages: messages[chat.id] || [],
        lastMessageTime: chat.lastMessageTime ? new Date(chat.lastMessageTime) : undefined,
      }))

      // Сохраняем в новом формате
      localStorage.setItem('telegram-chats', JSON.stringify(migratedChats))
      
      // Удаляем старый формат
      localStorage.removeItem('telegram-messages')
      
      console.log('Data migrated successfully')
      return true
    }
  } catch (error) {
    console.error('Error during data migration:', error)
    return false
  }
  
  return false
} 