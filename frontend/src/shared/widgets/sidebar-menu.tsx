import type React from "react"
interface MenuProps {
  title: string
  children: React.ReactNode
}

const SidebarMenu = ({ title, children }: MenuProps) => {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

export default SidebarMenu
