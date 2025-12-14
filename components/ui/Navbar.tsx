'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MessageCircle, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
    const { data: session } = useSession()
    const user = session?.user
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="w-full backdrop-blur-xl bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-5 py-4">
                <div className="flex items-center justify-between">
                    {/* BRAND NAME */}
                    <Link
                        href="/"
                        className="text-2xl sm:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">E</span>
                        </div>
                        EchoMind
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <div className="hidden md:flex items-center gap-6">
                        {session && (
                            <>
                                {/* Dashboard Link */}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium group"
                                >
                                    <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Messages Link */}
                                <Link
                                    href="/message"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium group relative"
                                >
                                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Messages</span>
                                    {/* Optional notification badge */}
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                </Link>
                            </>
                        )}

                        {/* User Section */}
                        {session ? (
                            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-white/10">
                                <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                                        {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <span className="text-gray-300 font-medium">
                                        {user?.username || user?.email}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>

                            </div>
                        ) : (
                            <Link href="/sign-in">
                                <Button className="px-6 py-2.5 font-semibold rounded-lg 
                                    bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md 
                                    border border-white/20 text-white 
                                    hover:from-white/20 hover:to-white/10 hover:scale-105 
                                    transition-all duration-300 shadow-lg shadow-white/5">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* MOBILE NAVIGATION */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-2">
                        {session && (
                            <>
                                {/* Mobile User Info */}
                                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                                        {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">
                                            {user?.username || user?.email}
                                        </p>
                                        <p className="text-gray-400 text-xs">{user?.email}</p>
                                    </div>
                                </div>

                                {/* Mobile Dashboard Link */}
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Mobile Messages Link */}
                                <Link
                                    href="/message"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Messages</span>
                                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                </Link>

                                {/* Mobile Logout */}
                                <Button
                                    onClick={() => {
                                        signOut()
                                        setMobileMenuOpen(false)
                                    }}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-3"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </Button>
                            </>
                        )}

                        {!session && (
                            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full px-6 py-3 font-semibold rounded-lg 
                                    bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md 
                                    border border-white/20 text-white 
                                    hover:from-white/20 hover:to-white/10
                                    transition-all duration-300">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}