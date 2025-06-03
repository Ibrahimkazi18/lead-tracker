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
import { BellRing, LogOut, Mail, MapPinHouse, Settings, SquarePlus, UserRoundPlus, UsersRound } from "lucide-react";
import useAgent from "@/hooks/useAgent";
import toast from "react-hot-toast";

const SideBarWrapper = () => {
  const {activeSidebar, setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const { agent } = useAgent();
  const router = useRouter();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route : string) => activeSidebar === route ? '#0085ff' : '#969696';

  const handleLogout = async () => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_SEVER_URI}/logout-user`, {
            method: "POST",
            credentials: "include",
        });

        router.push("/login");
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
                Logo
                <Box>
                    <h3 className="text-xl font-medium text-[#ecedee]">{agent?.name}</h3>
                </Box>
            </Link>
        </Box>
    </Sidebar.Header>

    <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
            <SidebarItem 
                title="Dashboard" 
                isActive={activeSidebar === "/dashboard"}
                href="/dashboard"
                icon={<Home fill={getIconColor("/dashboard")} />}
            />

            <div className="mt-2 block">
                <SidebarMenu title="Referral">
                    <SidebarItem 
                        title="Add Agents" 
                        isActive={activeSidebar === "/dashboard/add-agents"}
                        href="/dashboard/add-agents"
                        icon={<UserRoundPlus size={26} color={getIconColor("/dashboard/add-agents")}/>}
                    />

                    <SidebarItem 
                        title="Your Agents" 
                        isActive={activeSidebar === "/dashboard/all-agents"}
                        href="/dashboard/all-agents"
                        icon={<UsersRound size={26} color={getIconColor("/dashboard/all-agents")}/>}
                    />
                </SidebarMenu>

                <SidebarMenu title="Leads">
                    <SidebarItem 
                        title="Create Lead" 
                        isActive={activeSidebar === "/dashboard/create-lead"}
                        href="/dashboard/create-lead"
                        icon={<SquarePlus size={24} color={getIconColor("/dashboard/create-lead")} />}
                    />

                    <SidebarItem 
                        title="All Leads" 
                        isActive={activeSidebar === "/dashboard/all-leads"}
                        href="/dashboard/all-leads"
                        icon={<MapPinHouse color={getIconColor("/dashboard/all-leads")}/>}
                    />
                </SidebarMenu>

                <SidebarMenu title="Controllers">
                    <SidebarItem 
                        title="Inbox" 
                        isActive={activeSidebar === "/dashboard/inbox"}
                        href="/dashboard/inbox"
                        icon={<Mail size={24} color={getIconColor("/dashboard/inbox")} />}
                    />

                    <SidebarItem 
                        title="Settings" 
                        isActive={activeSidebar === "/dashboard/settings"}
                        href="/dashboard/settings"
                        icon={<Settings size={24} color={getIconColor("/dashboard/settings")} />}
                    />

                    <SidebarItem 
                        title="Notifications" 
                        isActive={activeSidebar === "/dashboard/notifications"}
                        href="/dashboard/notifications"
                        icon={<BellRing size={24} color={getIconColor("/dashboard/notifications")} />}
                    />
                </SidebarMenu>

                <SidebarMenu title="Extras">
                    <SidebarItem 
                        title="Logout" 
                        onClick={handleLogout}
                        icon={<LogOut size={24} color={getIconColor("/logout")} />}
                    />
                </SidebarMenu>
            </div>
        </Sidebar.Body>
    </div>
   </Box>
  )
}

export default SideBarWrapper