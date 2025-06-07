import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { QueryProvider } from "@/components/query-provider"
import ErrorBoundary from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "Telegram Clone with AI",
  description: "Telegram Clone with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-foreground">
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
