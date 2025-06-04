"use client"

import { Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/theme-context"

const themes = [
  { id: "light", name: "Светлая", color: "bg-white", border: "border-gray-200" },
  { id: "blue", name: "Синяя", color: "bg-blue-500", border: "border-blue-500" },
  { id: "dark", name: "Темная", color: "bg-gray-900", border: "border-gray-700" },
] as const

type ThemeId = typeof themes[number]['id']

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Palette className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id as ThemeId)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full ${themeOption.color} ${themeOption.border} border-2`} />
            <span className="flex-1">{themeOption.name}</span>
            {theme === themeOption.id && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
