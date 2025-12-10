'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnalyzeButton({ wrapId, hasScore, disabled }: { wrapId: string, hasScore: boolean, disabled?: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/wrap/${wrapId}/analyze`, { method: 'POST' });
            if (!res.ok) throw new Error("Failed");
            router.refresh();
        } catch (e) {
            alert("Analysis failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAnalyze}
            disabled={disabled || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
            ) : hasScore ? (
                <>
                    <Sparkles className="w-4 h-4 mr-2" /> Re-Analyze Vibes
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4 mr-2" /> Reveal Vibe Score
                </>
            )}
        </Button>
    );
}
