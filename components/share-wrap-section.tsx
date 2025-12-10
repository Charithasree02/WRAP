"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ShareWrapSection({ linkSlug }: { linkSlug: string }) {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/wrap/${linkSlug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 border border-brand-purple/20 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h2 className="text-xl font-bold text-brand-purple mb-2">🎉 Your wrap is ready!</h2>
                <p className="text-gray-600">Share this link with friends to start collecting memories.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm flex-1 truncate select-all">
                    {url}
                </div>
                <Button onClick={handleCopy} className="shrink-0 bg-brand-purple hover:bg-brand-purple/90 min-w-[100px]">
                    {copied ? <><Check className="w-4 h-4 mr-2" /> Copied</> : <><Copy className="w-4 h-4 mr-2" /> Copy Link</>}
                </Button>
            </div>
        </div>
    );
}
