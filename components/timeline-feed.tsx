
'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';

interface TimelineItem {
    id: string;
    wrapTitle: string;
    senderName: string | null;
    message: string; // The "answer" to the first prompt usually, or just content
    createdAt: Date;
    photoUrl?: string | null;
}

export default function TimelineFeed({ items }: { items: TimelineItem[] }) {
    if (items.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">No memories collected yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-start hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0 text-brand-purple">
                        {item.photoUrl ? (
                            <img src={item.photoUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-gray-900 truncate">
                                    {item.senderName || 'Anonymous'}
                                    <span className="text-gray-400 font-normal text-sm ml-2">replied to {item.wrapTitle}</span>
                                </p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="mt-1 text-gray-600 text-sm line-clamp-2">{item.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
