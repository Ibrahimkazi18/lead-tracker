"use client"

import { usePathname, useRouter } from "next/navigation";
import useSidebar from "@/hooks/useSidebar";
import { useEffect } from "react";
import Box from "./box";
import { Sidebar } from "./sidebar-styles";
import Link from "next/link";
import SidebarItem from "./sidebar-item";
import SidebarMenu from "./sidebar-menu";
import Home from "@/assets/icons/home";
import { BadgeCheck, ClipboardList, FilePlus, FolderKanban, LogOut, Settings } from "lucide-react";
import toast from "react-hot-toast";
import useAdmin from "@/hooks/useAdmin";

const SideBarWrapper = () => {
  const {activeSidebar, setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const { admin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route : string) => activeSidebar === route ? '#0085ff' : '#969696';

  const handleLogout = async () => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_SEVER_URI}/logout-admin`, {
            method: "POST",
            credentials: "include",
        });

        router.push("/admin/login");
    } catch (error:any) {
        toast.error(error.message);
    }
  }

  return (
   <Box css={{
        height: '100vh',
        zIndex: 202,
        position: 'sticky',
        padding: '8px',
        top: "0",
        overflowY: 'scroll',
        scrollbarWidth: 'none'
   }}
   className="sidebar-wrapper"
   >
    <Sidebar.Header>
        <Box>
            <Link href={'/'} className="flex justify-center text-center gap-2">
                <Box>
                    <h3 className="text-xl font-medium text-[#ecedee]">Hello {admin?.name.split(" ")[0]},</h3>
                </Box>
            </Link>
        </Box>
    </Sidebar.Header>

    <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
            <SidebarItem 
                title="Dashboard" 
                isActive={activeSidebar === "/admin/dashboard"}
                href="/admin/dashboard"
                icon={<Home fill={getIconColor("/admin/dashboard")} />}
            />

            <div className="mt-2 block">
                <SidebarMenu title="Manage Plans">
                    <SidebarItem 
                        title="Confirm Payments" 
                        isActive={activeSidebar === "/admin/dashboard/confirm-payments"}
                        href="/admin/dashboard/confirm-payments"
                        icon={<BadgeCheck size={26} color={getIconColor("/admin/dashboard/confirm-payments")}/>}
                    />

                    <SidebarItem 
                        title="Active Plans" 
                        isActive={activeSidebar === "/admin/dashboard/active-plans"}
                        href="/admin/dashboard/active-plans"
                        icon={<ClipboardList size={26} color={getIconColor("/admin/dashboard/active-plans")}/>}
                    />
                </SidebarMenu>

                <SidebarMenu title="Plans">
                    <SidebarItem 
                        title="Create Plan" 
                        isActive={activeSidebar === "/admin/dashboard/create-plan"}
                        href="/admin/dashboard/create-plan"
                        icon={<FilePlus size={24} color={getIconColor("/admin/dashboard/create-plan")} />}
                    />

                    <SidebarItem 
                        title="All Plans" 
                        isActive={activeSidebar.startsWith("/admin/dashboard/all-plans")}
                        href="/admin/dashboard/all-plans"
                        icon={<FolderKanban color={getIconColor("/admin/dashboard/all-plans")}/>}
                    />
                </SidebarMenu>

                <SidebarMenu title="Controllers">
                    <SidebarItem 
                        title="Settings" 
                        isActive={activeSidebar === "/admin/dashboard/settings"}
                        href="/admin/dashboard/settings"
                        icon={<Settings size={24} color={getIconColor("/admin/dashboard/settings")} />}
                    />

                    <SidebarItem 
                        title="Logout" 
                        onClick={handleLogout}
                        icon={<LogOut size={24} color={getIconColor("/admin/logout")} />}
                    />
                </SidebarMenu>
            </div>
        </Sidebar.Body>
    </div>
   </Box>
  )
}

export default SideBarWrapper