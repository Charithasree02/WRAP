"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Response {
    id: string;
    name: string | null;
    isAnonymous: boolean;
    answers: any;
    createdAt: Date;
    photoUrl?: string | null;
}

interface Prompt {
    id: string;
    question: string;
    order: number;
}

export default function ResponseList({ responses, prompts = [] }: { responses: Response[]; prompts?: Prompt[] }) {
    if (responses.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No responses yet.</p>
                <p className="text-sm text-gray-400">Share your link to get started!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {responses.map((response) => (
                <ResponseCard key={response.id} response={response} prompts={prompts} />
            ))}
        </div>
    );
}

function ResponseCard({ response, prompts }: { response: Response; prompts: Prompt[] }) {
    const [expanded, setExpanded] = useState(false);

    const answersObj = typeof response.answers === 'string'
        ? JSON.parse(response.answers)
        : response.answers as Record<string, string>;

    const answerList = Array.isArray(answersObj) ? answersObj : Object.values(answersObj);

    return (
        <div className="glass-card overflow-hidden transition-all duration-300 border border-white/40 hover:border-white/80">
            <div
                className="p-4 flex items-center justify-between cursor-pointer bg-white/40 hover:bg-white/60 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold">
                        {response.isAnonymous ? <User className="w-5 h-5" /> : (response.name?.[0] || "?")}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">{response.name || "Anonymous"}</h4>
                        <div className="text-xs text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString()} • {answerList.filter(Boolean).length} answers
                        </div>
                    </div>
                </div>
                <div className={cn("p-2 rounded-full bg-white/50 transition-transform", expanded ? "rotate-180" : "")}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
            </div>

            {expanded && (
                <div className="p-4 bg-white/30 border-t border-white/20 space-y-4">
                    {answerList.map((ans: string, i: number) => {
                        const questionText = prompts[i]?.question || `Question ${i + 1}`;
                        return (
                            ans && (
                                <div key={i} className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{questionText}</p>
                                    <p className="text-gray-800 bg-white/60 p-3 rounded-lg text-sm leading-relaxed">{ans}</p>
                                </div>
                            )
                        );
                    })}
                    {answerList.filter(Boolean).length === 0 && (
                        <p className="text-sm text-gray-400 italic">No text answers provided.</p>
                    )}
                </div>
            )}
        </div>
    );
}
