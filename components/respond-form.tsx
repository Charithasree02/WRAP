'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Image as ImageIcon, CheckCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RespondFormProps {
    wrap: {
        id: string;
        title: string;
        nickname: string;
        theme: string;
        prompts: string[];
    }
}

export default function RespondForm({ wrap }: RespondFormProps) {
    const [submitted, setSubmitted] = useState(false);
    const [step, setStep] = useState(0); // 0 to prompts.length + 1
    const [answers, setAnswers] = useState<string[]>(new Array(wrap.prompts.length).fill(''));
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [name, setName] = useState('');
    const [secretMessage, setSecretMessage] = useState('');

    const handleNext = () => setStep((p) => p + 1);
    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/wrap/response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wrapId: wrap.id, // We need to ensure we pass ID, not just title/slug
                    name,
                    isAnonymous,
                    answers,
                    secretMessage,
                    // secretUnlockDate: TODO
                }),
            });

            if (!res.ok) throw new Error("Failed");

            setSubmitted(true);
        } catch (e) {
            console.error(e);
            alert("Failed to submit. Try again.");
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-6 max-w-md mx-auto glass-card"
            >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Sent with love! 💌</h2>
                <p className="text-gray-600 mb-8">Your memory has been locked in {wrap.nickname}'s vault. It will be revealed in their 2025 Wrap.</p>
                <Link href="/">
                    <Button variant="outline">Create your own Wrap</Button>
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            {/* Progress Bar */}
            <div className="h-1 bg-white/30 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${((step + 1) / (wrap.prompts.length + 2)) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                {step < wrap.prompts.length ? (
                    <motion.div
                        key={`prompt-${step}`}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="glass-card p-8 min-h-[400px] flex flex-col"
                    >
                        <span className="text-sm font-medium opacity-60 uppercase tracking-widest mb-4">Prompt {step + 1}/{wrap.prompts.length}</span>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">{wrap.prompts[step]}</h2>

                        <textarea
                            className="w-full h-40 bg-white/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black/10 resize-none text-lg"
                            placeholder="Type your answer here..."
                            value={answers[step]}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[step] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            autoFocus
                        />

                        <div className="mt-auto flex justify-end pt-6">
                            <Button size="lg" onClick={handleNext} disabled={!answers[step]}>
                                Next <Send className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="final"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 space-y-8"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Final Touches ✨</h2>
                            <p className="opacity-70">Add a secret message or stay anonymous.</p>
                        </div>

                        <div className="bg-white/50 p-4 rounded-xl space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Lock className="w-5 h-5 text-brand-pink" />
                                <span className="font-bold">Secret Message (Optional)</span>
                            </div>
                            <p className="text-xs opacity-70">This message will remain locked until the unlock date.</p>
                            <textarea
                                className="w-full h-24 bg-white rounded-lg p-3 text-sm focus:outline-none"
                                placeholder="Write something confidential..."
                                value={secretMessage}
                                onChange={(e) => setSecretMessage(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                                <span className="font-medium">Stay Anonymous?</span>
                                <button
                                    onClick={() => setIsAnonymous(!isAnonymous)}
                                    className={cn("w-12 h-6 rounded-full transition-colors relative", isAnonymous ? "bg-black" : "bg-black/10")}
                                >
                                    <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all", isAnonymous ? "left-7" : "left-1")} />
                                </button>
                            </div>

                            {!isAnonymous && (
                                <input
                                    className="w-full p-4 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}
                        </div>

                        <Button className="w-full text-lg h-14" onClick={handleSubmit} disabled={!isAnonymous && !name}>
                            Submit MemoryWrap
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
