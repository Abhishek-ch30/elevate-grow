import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import {
  Home,
  Users,
  Briefcase,
  GraduationCap,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "../../contexts/AuthContext"
import { UserMenu } from "../auth/UserMenu"

interface NavItem {
  name: string
  url: string
  icon: any
}

export function TubelightNavbar() {
  const location = useLocation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("Home")

  const items: NavItem[] = [
    { name: "Home", url: user ? "/dashboard" : "/", icon: Home },
    { name: "About", url: "/about", icon: Users },
    { name: "Services", url: "/services", icon: Briefcase },
    { name: "Training", url: "/training", icon: GraduationCap },
    { name: "Contact", url: "/contact", icon: Phone },
  ]

  useEffect(() => {
    const currentPath = location.pathname
    // Check if it's a training detail page (starts with /training/)
    if (currentPath.startsWith('/training/') && currentPath !== '/training') {
      setActiveTab("Training")
    } else {
      const activeItem = items.find((item) => item.url === currentPath)
      setActiveTab(activeItem?.name || "Home")
    }
  }, [location.pathname])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-center mt-2">
        {/* NAVBAR */}
        <div
          className="
            flex items-center justify-between
            w-full max-w-6xl
            px-3 py-1
            rounded-full

            bg-black/90 backdrop-blur-lg

            border border-cyan-500/30 shadow-lg
          "
        >
          {/* LOGO */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white/5 transition"
          >
            <img
              src="https://i.ibb.co/wFJCHfcK/Screenshot-2026-01-21-121113.png"
              alt="QThink Solution Logo"
              className="w-5 h-5 rounded-md object-contain"
            />
            <span className="hidden md:inline text-base font-semibold text-white">
              QThink Solution
            </span>
          </Link>

          {/* NAV ITEMS */}
          <div className="flex items-center gap-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative px-3 py-1.5 rounded-full text-sm transition",
                    "text-white/80 hover:text-cyan-400 hover:bg-white/10",
                    isActive && "text-cyan-400 bg-cyan-500/20 font-semibold"
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={16} />
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 -z-10 rounded-full bg-cyan-500/30 border border-cyan-400/50"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* AUTH */}
          <div className="flex items-center gap-1">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white/90 hover:text-white hover:bg-cyan-500/20 border-2 border/10 transition"
                >
                  <LogIn size={14} />
                  <span className="hidden md:inline">Login</span>
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500 text-black text-sm font-medium hover:bg-cyan-400 transition border border-cyan-400/30"
                >
                  <UserPlus size={14} />
                  <span className="hidden md:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
