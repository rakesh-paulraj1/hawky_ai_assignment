"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile detection and sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const target = event.target as Element;
        if (!target.closest('.sidebar') && !target.closest('.sidebar-toggle')) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex bg-zinc-900">
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div 
        className={cn(
          "sidebar",
          isMobile 
            ? "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out h-screen"
            : "fixed inset-y-0 left-0 z-30 h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          !isMobile && "translate-x-0"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <Sidebar 
          className={cn(
            sidebarCollapsed ? "w-16" : "w-64",
            "lg:w-auto"
          )}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Main content - Add left margin to account for fixed sidebar */}
      <div className={cn(
        "flex-1 flex flex-col bg-zinc-900 min-w-0 transition-all duration-300 h-screen overflow-y-auto",
        !isMobile && !sidebarCollapsed && "ml-64",
        !isMobile && sidebarCollapsed && "ml-16"
      )}>
        {/* Header with toggle button */}
        <header className="bg-zinc-800 border-b border-zinc-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button
              className="sidebar-toggle p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={sidebarOpen}
              aria-controls="sidebar-navigation"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          <h1 className="text-lg font-semibold text-white lg:hidden">Marketing Assistant</h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Content area */}
        <main className={cn("flex-1 overflow-hidden", className)}>
          {children}
        </main>
      </div>
    </div>
  );
} 