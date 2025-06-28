"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ className, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Chat",
      href: "/chat",
      icon: "💬",
      description: "AI chat assistant"
    },
    {
      name: "Campaign",
      href: "/campaign",
      icon: "🎯",
      description: "Manage marketing campaigns"
    },
    
  ];

  return (
    <div className={cn("bg-zinc-900 border-r border-gray-700 min-h-screen flex flex-col transition-all duration-300", className)}>
      <div className={cn("flex-1", collapsed ? "p-2" : "p-4 lg:p-6")}>
        <div className={cn("flex items-center space-x-2 mb-6 lg:mb-8", collapsed && "justify-center")}>
          {!collapsed && (
            <h1 className="text-lg lg:text-xl font-bold text-white truncate">Marketing Assistant</h1>
          )}
          {/* Collapse button - only show on desktop */}
          <button
            className="hidden lg:flex p-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 ml-auto"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-white" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        <nav className={cn("space-y-1 lg:space-y-2", collapsed && "space-y-2")}>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center transition-all duration-200 group",
                  collapsed 
                    ? "justify-center px-2 py-3 rounded-lg" 
                    : "space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg",
                  isActive
                    ? "bg-zinc-800 text-white shadow-lg"
                    : "text-gray-300 hover:bg-zinc-800 hover:text-white hover:shadow-md"
                )}
                title={collapsed ? item.name : undefined}
              >
                <span className={cn(
                  "flex-shrink-0",
                  collapsed ? "text-xl" : "text-base lg:text-lg"
                )}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-sm lg:text-base">{item.name}</div>
                    <div className={cn(
                      "text-xs transition-colors duration-200 truncate",
                      isActive ? "text-gray-200" : "text-gray-400 group-hover:text-gray-300"
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer */}
      <div className={cn("border-t border-gray-700", collapsed ? "p-2" : "p-3 lg:p-4")}>
        {!collapsed && (
          <div className="text-xs text-gray-400 text-center">
            Marketing Assistant v1.0(Profile details)
          </div>
        )}
      </div>
    </div>
  );
} 