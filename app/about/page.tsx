'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Built for Nostalgia 💭</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    MemoryWrap was born from the idea that our best memories live in our friends' minds. We built a digital vault to collect, cherish, and wrap them up.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="bg-brand-blue/20 rounded-3xl p-8 aspect-square flex items-center justify-center transform hover:rotate-2 transition-transform">
                    <span className="text-9xl">🎁</span>
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Why MemoryWrap?</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Every year, meaningful moments get lost in group chats. We wanted a dedicated space to answer the deep questions, leave secret notes for the future, and visualize the "vibe" of your friendships through AI.
                    </p>
                    <ul className="space-y-3">
                        {["Secure & Private", "AI-Powered Insights", "Beautifully Designed", "Forever Free Access"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="glass-card p-12 text-center rounded-3xl bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 border-none">
                <h2 className="text-2xl font-bold mb-4">Ready to wrap your year?</h2>
                <Link href="/dashboard">
                    <Button size="lg" className="rounded-full px-8">
                        Create Your Wrap <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </div>

            <footer className="mt-20 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                Made with <Heart className="w-4 h-4 text-red-400 fill-current" /> by the MemoryWrap Team
            </footer>
        </div>
    );
}
