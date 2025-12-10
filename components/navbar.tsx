'use client';

import Link from 'next/link';
import { Gift, Menu, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto glass-card px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-brand-pink/30 rounded-lg group-hover:rotate-12 transition-transform">
                        <Gift className="w-6 h-6 text-gray-800" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">MemoryWrap</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4">
                    {session ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium hover:opacity-70 flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                            <div className="h-4 w-px bg-black/10 mx-2" />
                            <div className="flex items-center gap-2">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center">
                                        <UserCircle className="w-5 h-5 text-brand-purple" />
                                    </div>
                                )}
                                <span className="text-sm font-medium hidden lg:inline">{session.user?.name?.split(' ')[0]}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/about" className="text-sm font-medium hover:opacity-70">About</Link>
                            <div className="h-4 w-px bg-black/10 mx-2" />
                            <Button variant="ghost" onClick={() => signIn("google")}>Login</Button>
                            <Link href="/dashboard">
                                <Button>Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 hover:bg-black/5 rounded-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-6 right-6 glass p-6 rounded-2xl md:hidden flex flex-col gap-4 shadow-xl"
                    >
                        {session ? (
                            <>
                                <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                                    {session.user?.image && <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full" />}
                                    <div>
                                        <p className="font-bold">{session.user?.name}</p>
                                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                                    </div>
                                </div>
                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                                </Link>
                                <Button variant="destructive" className="w-full justify-start" onClick={() => signOut()}>Sign Out</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => { signIn("google"); setIsOpen(false); }}>Login</Button>
                                <Button onClick={() => { signIn("google"); setIsOpen(false); }}>Get Started</Button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
