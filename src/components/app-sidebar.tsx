import { useState } from "react"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Calendar, 
  Heart,
  Settings,
  LogOut
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { t } from "@/lib/translations"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar"

const items = [
  { title: t("events"), url: "/", icon: LayoutDashboard },
  { title: t("tasks"), url: "/tasks", icon: CheckSquare },
  { title: t("guestList"), url: "/guests", icon: Users },
  { title: t("timeline"), url: "/timeline", icon: Calendar },
  { title: t("vendors"), url: "/vendors", icon: Heart },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="gradient-warm">
        {/* Logo Section */}
        <div className="p-6 border-b border-border/50">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {t("weddingPlanner")}
                </h2>
                <p className="text-xs text-muted-foreground">{t("pro")}</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
              <Heart className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <SidebarGroup
          className="px-3 py-4"
        >
          <SidebarGroupLabel className={`${collapsed ? "sr-only" : ""} text-warm-gray font-medium text-xs uppercase tracking-wider mb-2`}>
            {t("mainNavigation")}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "text-warm-gray hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <span className="font-medium text-sm transition-opacity">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="p-3 border-t border-border/50 mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-warm-gray hover:bg-accent hover:text-accent-foreground transition-all duration-200 w-full text-left">
                  <Settings className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="font-medium text-sm">{t("settings")}</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-warm-gray hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 w-full text-left">
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="font-medium text-sm">{t("logout")}</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}