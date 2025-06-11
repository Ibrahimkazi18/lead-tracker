import Link from "next/link";

interface ItemProps {
    icon : React.ReactNode;
    title : string;
    isActive ?: boolean;
    href ?: string;
    onClick ?: () => void
}

const SidebarItem = ({ icon, title, isActive, href, onClick } : ItemProps ) => {
  return (
    <Link href={href || ""} className="my-2 block" onClick={onClick}>
        <div className={`flex gap-2 w-full min-h-12 h-full items-center px-[13px] rounded-lg cursor-pointer transition hover:bg-[#2b2f31] ${
            isActive && 'scale-[0.98] dark:bg-[#0f2158] fill-blue-200 dark:hover:bg-[#0f3158d6]'
        }`}>
            {icon}
            <h5 className="text-slate-200 text-lg">
                {title}
            </h5>
        </div>
    </Link>
  )
}

export default SidebarItem