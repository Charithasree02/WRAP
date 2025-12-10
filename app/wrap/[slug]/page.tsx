import RespondForm from "@/components/respond-form";
import { notFound } from "next/navigation";

// Mock fetching logic
import { prisma } from "@/lib/prisma";

async function getWrap(slug: string) {
    const wrap = await prisma.wrap.findUnique({
        where: { linkSlug: slug },
        include: { prompts: { orderBy: { order: 'asc' } } }
    });

    if (!wrap) return null;

    return {
        id: wrap.id, // Pass ID
        title: wrap.title,
        nickname: wrap.nickname || "Friend",
        theme: wrap.theme,
        prompts: wrap.prompts.map(p => p.question)
    };
}

export default async function RespondPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // Next.js 15: params is a Promise
    const wrap = await getWrap(slug);

    if (!wrap) {
        return notFound();
    }

    // Theme Handling (Dynamically inject class or pass as prop)
    // Theme Handling
    // Mapping our IDs to full Tailwind classes
    const themeClasses: Record<string, string> = {
        'pastel-sunset': 'bg-gradient-to-br from-pink-100 to-yellow-100 text-gray-800',
        'minimal-white': 'bg-gray-50 text-gray-900',
        'dark-neon': 'bg-gray-950 text-white selection:bg-purple-500',
        'retro-scrapbook': 'bg-amber-50 text-amber-900',
        'polaroid': 'bg-stone-100 text-stone-800',
    };

    const currentTheme = themeClasses[wrap.theme] || themeClasses['pastel-sunset'];

    return (
        <div className={`min-h-screen ${currentTheme} transition-colors duration-500`}>
            <div className="max-w-2xl mx-auto px-6 py-12">
                <header className="text-center mb-10">
                    <div className="w-24 h-24 bg-white/30 rounded-full mx-auto mb-4 backdrop-blur-sm shadow-sm animate-pulse" />
                    <h1 className="text-3xl font-bold mb-2">Write into {wrap.nickname}'s {wrap.title}</h1>
                    <p className="opacity-80">Help create a beautiful memory wrap for {wrap.nickname}.</p>
                </header>

                <RespondForm wrap={wrap} />
            </div>
        </div>
    );
}
