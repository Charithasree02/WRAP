
'use client';

import { formatDistanceToNow, isAfter } from 'date-fns';
import { Lock, Unlock, Clock } from 'lucide-react';

interface SecretItem {
    id: string;
    wrapTitle: string;
    senderName: string | null;
    unlockDate: Date;
    content: string; // Only shown if unlocked
    isLocked: boolean;
}

export default function SecretVault({ secrets }: { secrets: SecretItem[] }) {
    if (secrets.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">No secret messages yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secrets.map((secret) => (
                <div
                    key={secret.id}
                    className={`p-5 rounded-xl border flex flex-col gap-3 relative overflow-hidden ${secret.isLocked
                            ? 'bg-gray-900 text-white border-gray-800'
                            : 'bg-yellow-50 border-yellow-200 text-gray-800'
                        }`}
                >
                    <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-2 font-medium">
                            {secret.isLocked ? <Lock className="w-4 h-4 text-gray-400" /> : <Unlock className="w-4 h-4 text-yellow-600" />}
                            <span>{secret.senderName || 'Anonymous'}</span>
                        </div>
                        <span className="text-xs opacity-70 bg-black/20 px-2 py-1 rounded">
                            {secret.wrapTitle}
                        </span>
                    </div>

                    <div className="z-10 mt-2">
                        {secret.isLocked ? (
                            <div className="flex flex-col items-center justify-center py-4 gap-2">
                                <Clock className="w-8 h-8 text-gray-600 animate-pulse" />
                                <p className="text-sm font-mono text-gray-400">
                                    Unlocks {formatDistanceToNow(new Date(secret.unlockDate), { addSuffix: true })}
                                </p>
                            </div>
                        ) : (
                            <p className="italic font-serif text-lg leading-relaxed">
                                "{secret.content}"
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
