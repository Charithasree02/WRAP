'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check, Sparkles, Plus, Trash2, GripVertical, Shuffle, Globe, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { THEMES, PROMPT_SETS } from '@/lib/constants';

export default function CreateWrapForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        prompts: [...PROMPT_SETS.FRIENDSHIP], // Default to Friendship set
        theme: 'pastel-sunset',
        title: '',
        nickname: '',
        privacy: 'open',
        allowAnon: true,
        showProfile: true,
    });

    const [customPromptText, setCustomPromptText] = useState('');

    const handleNext = () => setStep((p) => p + 1);
    const handleBack = () => setStep((p) => p - 1);

    // Prompt Handlers
    const addCustomPrompt = () => {
        if (!customPromptText.trim() || formData.prompts.length >= 8) return;
        setFormData(prev => ({ ...prev, prompts: [...prev.prompts, customPromptText] }));
        setCustomPromptText('');
    };

    const removePrompt = (index: number) => {
        setFormData(prev => ({ ...prev, prompts: prev.prompts.filter((_, i) => i !== index) }));
    };

    const loadPromptSet = (key: keyof typeof PROMPT_SETS) => {
        setFormData(prev => ({ ...prev, prompts: [...PROMPT_SETS[key]] }));
    };

    // Submit Handler
    const handleSubmit = async () => {
        if (!formData.title || !formData.nickname) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/wrap/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create wrap');

            const data = await res.json();
            console.log("Create API Response:", data);

            if (!data.id) {
                console.error("Missing ID in response", data);
                alert("Error: Wrap created but ID missing. Check console.");
                return;
            }

            // Redirect to the new dashboard page for this wrap
            router.push(`/dashboard/wrap/${data.id}`);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto glass-card p-4 md:p-8 min-h-[600px] flex flex-col">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn("w-3 h-3 rounded-full transition-colors", step >= i ? "bg-brand-purple" : "bg-gray-200")} />
                    ))}
                </div>
                <span className="text-sm font-medium text-gray-500">Step {step}/4</span>
            </div>

            <div className="flex-1 overflow-y-auto px-1">
                <AnimatePresence mode="wait">

                    {/* STEP 1: PROMPTS */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold">Curate your questions</h2>
                                <p className="text-gray-500">What do you want to ask your friends?</p>
                            </div>

                            <div className="flex gap-2 flex-wrap justify-center mb-6">
                                {(Object.keys(PROMPT_SETS) as Array<keyof typeof PROMPT_SETS>).map(setKey => (
                                    <button
                                        key={setKey}
                                        onClick={() => loadPromptSet(setKey)}
                                        className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold hover:bg-brand-purple hover:text-white transition-colors"
                                    >
                                        Use {setKey} Set
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 max-w-2xl mx-auto">
                                {formData.prompts.map((prompt, idx) => (
                                    <div key={idx} className="group flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <span className="text-gray-400 font-mono text-xs w-6">{idx + 1}</span>
                                        <p className="flex-1 font-medium text-sm">{prompt}</p>
                                        <button onClick={() => removePrompt(idx)} className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {formData.prompts.length < 8 && (
                                    <div className="flex gap-2 mt-4">
                                        <input
                                            className="flex-1 p-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-brand-purple/20"
                                            placeholder="Type your own question..."
                                            value={customPromptText}
                                            onChange={(e) => setCustomPromptText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addCustomPrompt()}
                                        />
                                        <Button onClick={addCustomPrompt} variant="secondary">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: THEME */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold">Choose a Vibe</h2>
                                <p className="text-gray-500">Pick a theme for your wrap page.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setFormData({ ...formData, theme: theme.id })}
                                        className={cn(
                                            "relative h-40 rounded-2xl border-2 transition-all overflow-hidden flex flex-col justify-end p-4 text-left group",
                                            formData.theme === theme.id ? "border-brand-purple ring-4 ring-brand-purple/10" : "border-gray-100 hover:border-gray-200"
                                        )}
                                    >
                                        <div className={cn("absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity bg-gradient-to-br", theme.previewColors)} />
                                        <div className="relative z-10">
                                            <span className="font-bold block">{theme.name}</span>
                                            <span className="text-xs opacity-70">{theme.description}</span>
                                        </div>
                                        {formData.theme === theme.id && (
                                            <div className="absolute top-3 right-3 bg-brand-purple text-white p-1 rounded-full">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: PRIVACY & DETAILS */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-lg mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold">Privacy & Details</h2>
                                <p className="text-gray-500">How should people see you?</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Wrap Title</label>
                                    <input
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none"
                                        placeholder="e.g. My 2025 Memories"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Your Nickname</label>
                                    <input
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none"
                                        placeholder="What friends call you"
                                        value={formData.nickname}
                                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium">Allow Anonymous Messages?</span>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, allowAnon: !formData.allowAnon })}
                                        className={cn("w-10 h-6 rounded-full relative transition-colors", formData.allowAnon ? "bg-green-500" : "bg-gray-300")}
                                    >
                                        <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all", formData.allowAnon ? "left-5" : "left-1")} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium">Link Privacy</span>
                                    </div>
                                    <div className="flex bg-gray-200 p-1 rounded-lg text-xs font-semibold">
                                        <button
                                            onClick={() => setFormData({ ...formData, privacy: 'open' })}
                                            className={cn("px-3 py-1 rounded-md transition-all", formData.privacy === 'open' ? "bg-white shadow text-black" : "text-gray-500")}
                                        >
                                            Open
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, privacy: 'invite' })}
                                            className={cn("px-3 py-1 rounded-md transition-all", formData.privacy === 'invite' ? "bg-white shadow text-black" : "text-gray-500")}
                                        >
                                            Invite
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: PREVIEW & PUBLISH */}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold">Ready to Launch? 🚀</h2>
                                <p className="text-gray-500">Review your wrap settings before creating.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto text-left relative overflow-hidden">
                                <div className={cn("absolute top-0 left-0 w-full h-2 bg-gradient-to-r", THEMES.find(t => t.id === formData.theme)?.previewColors || "from-gray-200 to-gray-400")} />

                                <h3 className="font-bold text-lg mb-1">{formData.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">by {formData.nickname}</p>

                                <div className="space-y-2 mb-6">
                                    <h4 className="text-xs font-bold uppercase text-gray-400">Question Preview</h4>
                                    {formData.prompts.slice(0, 3).map((p, i) => (
                                        <div key={i} className="text-sm truncate">• {p}</div>
                                    ))}
                                    {formData.prompts.length > 3 && <div className="text-xs text-gray-400 italic">+ {formData.prompts.length - 3} more</div>}
                                </div>

                                <div className="flex gap-2">
                                    {formData.allowAnon && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Anon ON</span>}
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{formData.privacy} Mode</span>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full max-w-md bg-brand-purple hover:bg-brand-purple/90 h-14 text-lg shadow-xl shadow-brand-purple/20"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating..." : "Generate My Wrap Link ✨"}
                            </Button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Footer Nav */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 1 ? (
                    <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                ) : <div />}

                {step < 4 && (
                    <Button
                        onClick={handleNext}
                        disabled={(step === 1 && formData.prompts.length === 0) || (step === 3 && (!formData.title || !formData.nickname))}
                    >
                        Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}
