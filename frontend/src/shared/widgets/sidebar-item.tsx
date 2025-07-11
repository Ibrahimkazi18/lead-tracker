"use client"

import type React from "react"

import Link from "next/link"

interface ItemProps {
  icon: React.ReactNode
  title: string
  isActive?: boolean
  href?: string
  onClick?: () => void
}

const SidebarItem = ({ icon, title, isActive, href, onClick }: ItemProps) => {
  const content = (
    <div
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
      }`}
      onClick={onClick}
    >
      <div
        className={`flex-shrink-0 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"}`}
      >
        {icon}
      </div>
      <span className="font-medium text-sm truncate">{title}</span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

export default SidebarItem
