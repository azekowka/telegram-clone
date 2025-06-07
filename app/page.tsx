'use client'

import dynamic from 'next/dynamic'

// Динамически импортируем главный компонент только на клиенте
const HomePageClient = dynamic(() => import('@/components/home-page-client'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-muted/30">
      <div className="text-lg">Загрузка...</div>
    </div>
  )
})

export default function HomePage() {
  return <HomePageClient />
}
