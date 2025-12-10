import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateWrapInsights } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const wrap = await prisma.wrap.findUnique({
            where: { id },
            include: { responses: true }
        });

        if (!wrap) return new NextResponse("Not found", { status: 404 });
        // Authorization: Only owner can analyze
        if (wrap.userId !== (session.user as any).id) return new NextResponse("Forbidden", { status: 403 });

        // Call AI Service
        const insights = await generateWrapInsights(wrap.responses, wrap.title);

        if (!insights) return new NextResponse("No responses to analyze", { status: 400 });

        // Save to DB
        await prisma.wrap.update({
            where: { id: wrap.id },
            data: {
                vibeScore: insights.vibeScore,
                vibeSummary: insights.vibeSummary,
                archetype: insights.archetype,
                keywords: insights.keywords || [],
            }
        });

        return NextResponse.json({ success: true, insights });
    } catch (error) {
        console.error("[ANALYZE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
