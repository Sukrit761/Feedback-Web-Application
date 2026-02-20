'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MessageCircle, LogOut, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
    const [user, setUser] = useState<any>(null)
    const [scrolled, setScrolled] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/me", { credentials: "include" })
                const data = await res.json()
                setUser(data.user)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleLogout = async () => {
        await fetch("/api/logout")
        setUser(null)
        setUserMenuOpen(false)
        router.push("/")
        router.refresh()
    }

    const navLinks = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/message", label: "Messages", icon: MessageCircle },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <nav
            className={`w-full sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-gray-950/95 backdrop-blur-xl shadow-xl shadow-black/30 border-b border-white/8"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-3xl font-bold tracking-tight text-orange-500 hover:text-white/80 transition-colors"
                    >
                        Echo<span className="text-orange-400">Mind</span>
                    </Link>

                    {/* Center nav links */}
                    {user && (
                        <div className="flex items-center gap-1">
                            {navLinks.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive(href)
                                            ? "bg-white/10 text-white"
                                            : "text-white/60 hover:text-white hover:bg-white/6"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                    {isActive(href) && (
                                        <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-green-400" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {loading ? (
                            /* Skeleton */
                            <div className="h-8 w-24 rounded-lg bg-white/8 animate-pulse" />
                        ) : user ? (
                            /* User menu */
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(v => !v)}
                                    className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 hover:border-white/20 transition-all duration-150 text-white text-sm font-medium"
                                >
                                    {/* Avatar initials */}
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white uppercase select-none">
                                        {(user.username || user.email || "U")[0]}
                                    </span>
                                    <span className="max-w-[96px] truncate text-white/80">
                                        {user.username || user.email}
                                    </span>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${
                                            userMenuOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Dropdown */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="px-3 py-2.5 border-b border-white/8">
                                            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm text-white truncate mt-0.5">{user.username || user.email}</p>
                                        </div>
                                        <div className="p-1.5">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/sign-in">
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors">
                                        Log in
                                    </button>
                                </Link>
                                <Link href="/sign-up">
                                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors shadow-lg shadow-indigo-500/20">
                                        Get started
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}