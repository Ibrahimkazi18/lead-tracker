"use client"

import { useEffect, useState, useRef } from "react"
import { Moon, Sun, Monitor } from 'lucide-react'

type Theme = "light" | "dark" | "system"

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system")
  const [isLoading, setIsLoading] = useState(true)
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  // Loading the theme from localStorage or defaulting to system
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme
    const validTheme = storedTheme && ["light", "dark", "system"].includes(storedTheme) ? storedTheme : "system"

    setTheme(validTheme)
    applyTheme(validTheme)
    setIsLoading(false)
  }, [])

  // Update slider position when theme changes
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      updateSliderPosition()
    }
  }, [theme, isLoading])

  // Update slider position on resize
  useEffect(() => {
    const handleResize = () => {
      if (!isLoading) {
        updateSliderPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isLoading, theme])

  const updateSliderPosition = () => {
    const options = ["light", "dark", "system"]
    const activeIndex = options.indexOf(theme)
    const activeButton = buttonsRef.current[activeIndex]
    
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      
      setSliderStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left
      })
    }
  }

  // Apply theme to document
  const applyTheme = (selectedTheme: Theme) => {
    if (selectedTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    } else {
      document.documentElement.classList.toggle("dark", selectedTheme === "dark")
    }
  }

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  if (isLoading) {
    return <div className="w-full h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
  }

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun },
    { value: "dark", icon: Moon },
    { value: "system", icon: Monitor },
  ]

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        className="relative flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700"
      >
        {/* Background slider */}
        <div
          className="absolute top-1 bottom-1 bg-white dark:bg-slate-700 rounded-md shadow-sm transition-all duration-300 ease-out border border-slate-200 dark:border-slate-600"
          style={{
            width: `${sliderStyle.width}px`,
            transform: `translateX(${sliderStyle.left}px)`,
          }}
        />

        {/* Options */}
        {options.map((option, index) => {
          const Icon = option.icon
          const isActive = theme === option.value

          return (
            <button
              key={option.value}
              ref={(el) => (buttonsRef.current[index] = el)}
              onClick={() => handleThemeChange(option.value)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 min-w-0 ${
                isActive
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeToggle
