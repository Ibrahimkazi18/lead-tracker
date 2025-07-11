"use client"

import { Menu, X } from "lucide-react"

interface MobileMenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
      ) : (
        <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
      )}
    </button>
  )
}

export default MobileMenuButton
