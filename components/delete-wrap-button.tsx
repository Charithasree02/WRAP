"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteWrapButton({ wrapId, wrapTitle }: { wrapId: string, wrapTitle: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${wrapTitle}"? This action cannot be undone.`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/wrap/${wrapId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete wrap. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Delete Wrap
        </Button>
    );
}
