"use client"

import * as React from "react"
import { LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type PageType =
  | "home"
  | "students"
  | "courses"
  | "student-courses"
  | "chatbot"
  | "universities"
  | "enrollments"

interface LayoutProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  onLogout: () => void
  children: React.ReactNode
}

export function Navigation({ currentPage, onNavigate, onLogout, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navItems: { label: string; page: PageType }[] = [
    { label: "Home", page: "home" },
    { label: "Students", page: "students" },
    { label: "Courses", page: "courses" },
    { label: "Student Courses", page: "student-courses" },
    { label: "Universities", page: "universities" },
    { label: "Enrollments", page: "enrollments" },
    { label: "Chatbot", page: "chatbot" },
  ]

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-background/95 backdrop-blur-md border-r border-border shadow-md hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center gap-2 border-b border-border px-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CM</span>
          </div>
          <span className="font-bold text-foreground">Campus</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full",
                currentPage === item.page ? "bg-accent text-white" : "text-foreground hover:bg-accent/10"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full bg-background/95 backdrop-blur-md border-r border-border shadow-md flex flex-col">
            {/* Close button */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
              <span className="font-bold text-foreground">Campus</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page)
                    setMobileOpen(false)
                  }}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full",
                    currentPage === item.page ? "bg-accent text-white" : "text-foreground hover:bg-accent/10"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-border">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 p-4">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between h-16 px-4 border-b border-border">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="font-bold text-foreground">Campus</span>
        </div>

        {/* Page content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
