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
import { BadgeIndianRupee, LogOut, MapPinHouse, Settings, ShoppingCart, SquarePlus, UserRoundPlus, UsersRound } from "lucide-react";
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
            <Link href={'/'} className="flex flex-col justify-start text-start gap-2">
                <span className="text-2xl font-semibold text-[#ecedee]">Open Leads</span>
                <Box>
                    <h3 className="text-md font-medium text-[#ecedee]">Hello, {agent?.name.split(" ")[0]}</h3>
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
                        isActive={activeSidebar.startsWith("/dashboard/all-leads")}
                        href="/dashboard/all-leads"
                        icon={<MapPinHouse color={getIconColor("/dashboard/all-leads")}/>}
                    />
                </SidebarMenu>

                <SidebarMenu title="Plans">
                    <SidebarItem 
                        title="Buy Plan" 
                        isActive={activeSidebar === "/dashboard/buy-plan"}
                        href="/dashboard/buy-plan"
                        icon={<ShoppingCart size={24} color={getIconColor("/dashboard/buy-plan")} />}
                    />

                    <SidebarItem 
                        title="Your Plan" 
                        isActive={activeSidebar === "/dashboard/your-plan"}
                        href="/dashboard/your-plan"
                        icon={<BadgeIndianRupee size={24} color={getIconColor("/dashboard/your-plan")} />}
                    />
                </SidebarMenu>

                <SidebarMenu title="Controllers">

                    <SidebarItem 
                        title="Settings" 
                        isActive={activeSidebar === "/dashboard/settings"}
                        href="/dashboard/settings"
                        icon={<Settings size={24} color={getIconColor("/dashboard/settings")} />}
                    />

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