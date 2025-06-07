'use client'

import { Suspense } from 'react'
import HomePageClient from '@/components/home-page-client'

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-muted/30">
        <div className="text-lg">Загрузка приложения...</div>
      </div>
    }>
      <HomePageClient />
    </Suspense>
  )
}
