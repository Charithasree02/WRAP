import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, nickname, theme, prompts, privacy, allowAnon } = body;

        if (!title || !prompts || prompts.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Create unique slug: charu-2025-abc1
        const baseSlug = (nickname || "user").toLowerCase().replace(/[^a-z0-9]/g, "-");
        const uniqueSuffix = Math.random().toString(36).substring(2, 6);
        const linkSlug = `${baseSlug}-${new Date().getFullYear()}-${uniqueSuffix}`;

        const wrap = await prisma.wrap.create({
            data: {
                userId: (session.user as any).id,
                title,
                nickname,
                theme: theme || "pastel-sunset",
                privacy: privacy || "open",
                allowAnon: allowAnon !== undefined ? allowAnon : true,
                linkSlug,
                prompts: {
                    create: prompts.map((q: string, i: number) => ({
                        question: q,
                        order: i,
                    })),
                },
            },
        });

        return NextResponse.json({ success: true, id: wrap.id, slug: linkSlug });
    } catch (error) {
        console.error("[WRAP_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
