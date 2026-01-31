import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BurgerMenu } from "../ui/BurgerMenu"
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const items: NavItem[] = [
    { name: "Home", url: user ? "/dashboard" : "/", icon: Home },
    { name: "About", url: "/about", icon: Users },
    { name: "Services", url: "/services", icon: Briefcase },
    { name: "Training", url: "/training", icon: GraduationCap },
    { name: "Contact", url: "/contact", icon: Phone },
  ]

  useEffect(() => {
    const currentPath = location.pathname
    if (currentPath.startsWith('/training/') && currentPath !== '/training') {
      setActiveTab("Training")
    } else {
      const activeItem = items.find((item) => item.url === currentPath)
      setActiveTab(activeItem?.name || "Home")
    }
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-center mt-2">
          {/* NAVBAR */}
          <div
            className="
              flex items-center justify-between
              w-full max-w-6xl
              px-2 md:px-3 py-1
              rounded-full
              bg-black/90 backdrop-blur-lg
              border border-cyan-500/30 shadow-lg
              relative z-50
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
              <span className="text-lg font-heading font-semibold hero-text-gradient">
                QThink Solutions
              </span>
            </Link>

            {/* DESKTOP NAV ITEMS */}
            <div className="hidden md:flex items-center gap-1">
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
                    <span>{item.name}</span>
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

            {/* AUTH & BURGER */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1">
                {user ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white/90 hover:text-white hover:bg-cyan-500/20 border-2 border/10 transition"
                    >
                      <LogIn size={14} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500 text-black text-sm font-medium hover:bg-cyan-400 transition border border-cyan-400/30"
                    >
                      <UserPlus size={14} />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Burger */}
              <div className="md:hidden">
                <BurgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 text-lg font-medium p-4 rounded-xl border border-white/5 bg-white/5",
                    isActive ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" : "text-white/80"
                  )}
                >
                  <Icon size={24} />
                  {item.name}
                </Link>
              )
            })}

            <div className="h-px bg-white/10 w-full my-2" />

            {user ? (
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <UserMenu />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium"
                >
                  <LogIn size={20} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500 text-black font-bold"
                >
                  <UserPlus size={20} />
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
