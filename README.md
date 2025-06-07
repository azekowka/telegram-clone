# Telegram Clone with Gemini - nFactorial WEB 1.2. & 1.3. homework

Демо видео: https://youtu.be/bIi-U2EXfTA
Деплоймент: https://telegram-clone-six-nu.vercel.app/

## Getting started

1. **Установите зависимости**:
   ```bash
   npm i
   ```

2. **Переименуйте .env.example на .env, и вставьте API keys**:
   ```bash
   cp .env.example .env
   ```
   ```bash
    GEMINI_API_KEY=your_api_key_here
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Build check**:
   ```bash
   npm run build
   ```

## 🔄 TanStack Query Implementation

This project uses **TanStack Query (React Query)** for efficient data fetching, caching, and state management. Here's how it was implemented:

### 📦 Dependencies Added
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 🏗️ Architecture Overview

#### 1. **Core Setup**
- **`components/query-provider.tsx`** - QueryClient provider wrapper with devtools
- **`app/layout.tsx`** - App wrapped with QueryProvider for global access
- **`lib/query-client.ts`** - QueryClient configuration (optional, for static setup)

#### 2. **Custom Hooks Structure**
```
hooks/
├── use-chat-queries.ts    # Chat-related queries & mutations
└── use-user-queries.ts    # User profile & preferences
```

#### 3. **Utility Functions**
- **`lib/localStorage-utils.ts`** - Data validation, migration, and cleanup

### 🎯 Key Features Implemented

#### **Chat Management Hooks:**
```typescript
// Fetch all chats with automatic caching
const { data: chats, isLoading } = useChats()

// Send messages with AI integration  
const sendMessage = useSendMessage()

// Add new messages optimistically
const addMessage = useAddMessage()

// Update chat properties
const updateChat = useUpdateChat()
```

#### **User Management Hooks:**
```typescript
// User profile data
const { data: profile } = useUserProfile()

// User preferences/settings
const { data: preferences } = useUserPreferences()

// Update profile/preferences
const updateProfile = useUpdateProfile()
const updatePreferences = useUpdatePreferences()
```

### ⚡ Performance Benefits

1. **Intelligent Caching:**
   - Chats: 30 seconds stale time
   - User data: 5-10 minutes stale time
   - Automatic background refetching

2. **Optimistic Updates:**
   - Messages appear instantly
   - UI updates before server confirmation
   - Automatic rollback on errors

3. **Error Handling:**
   - Automatic retries (1 attempt)
   - Graceful error states
   - Data validation and recovery

### 🔄 Data Migration

The implementation includes automatic migration from the old localStorage format:
```typescript
// Old format: Separate chats and messages
localStorage: {
  'telegram-chats': Chat[],
  'telegram-messages': Record<string, Message[]>
}

// New format: Embedded messages in chats
localStorage: {
  'telegram-chats': Chat[] // with messages: Message[] property
}
```

### 🛠️ Query Key Structure
```typescript
// Hierarchical query keys for cache management
chatKeys = {
  all: ['chats'],
  chat: (id) => ['chats', id],
  messages: (chatId) => ['chats', chatId, 'messages']
}

userKeys = {
  all: ['user'],
  profile: () => ['user', 'profile'], 
  preferences: () => ['user', 'preferences']
}
```

### 🔧 Configuration
```typescript
// QueryClient defaults
{
  queries: {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 10 * 60 * 1000,          // 10 minutes  
    retry: 1,                         // 1 retry on error
    refetchOnWindowFocus: false,      // No refetch on focus
  }
}
```

### 🎨 UI Integration

- **Loading States:** Spinners during message sending
- **Error Boundaries:** Graceful error handling
- **Optimistic Updates:** Instant UI feedback
- **Background Sync:** Seamless data updates

### 🚀 Development Tools

- **React Query DevTools** available in development mode
- Query inspection and debugging
- Cache visualization
- Network request monitoring

This implementation provides a robust, scalable foundation for data management while maintaining excellent user experience through optimistic updates and intelligent caching.
