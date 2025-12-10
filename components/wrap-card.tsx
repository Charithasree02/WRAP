'use client';

import { motion } from 'framer-motion';
import { Calendar, Lock, Unlock, Users, ChevronRight, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface WrapCardProps {
    title: string;
    responseCount: number;
    vibeScore?: number | null;
    slug: string;
    isLocked: boolean;
    unlockDate?: string;
}

export default function WrapCard({ title, responseCount, vibeScore, slug, isLocked, unlockDate }: WrapCardProps) {
    const [copied, setCopied] = useState(false);

    const copyLink = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to dashboard detail
        e.stopPropagation();

        const url = `${window.location.origin}/wrap/${slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col gap-4 group cursor-pointer border-l-4 border-l-brand-purple hover:shadow-xl transition-all relative"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold group-hover:text-brand-purple transition-colors truncate max-w-[180px]">{title}</h3>
                    <span className="text-xs text-gray-500 font-mono">/{slug}</span>
                </div>

                <button
                    onClick={copyLink}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-brand-purple z-20"
                    title="Copy Link"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
                {typeof vibeScore === 'number' && (
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        {vibeScore}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto pt-4">
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{responseCount}</span>
                </div>
                <div className="flex items-center gap-1">
                    {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </div>
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-brand-purple" />
            </div>
        </motion.div>
    );
}
