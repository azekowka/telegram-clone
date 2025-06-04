import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date | string): string {
  // Ensure we have a Date object
  const dateObj = typeof date === "string" ? new Date(date) : date

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "недавно"
  }

  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()

  // Less than 1 minute
  if (diff < 60000) {
    return "сейчас"
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} мин назад`
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours} ч назад`
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days} дн назад`
  }

  // Format as date
  return dateObj.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}
