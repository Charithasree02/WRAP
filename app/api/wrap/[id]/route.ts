
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;

        const wrap = await prisma.wrap.findUnique({
            where: { id }
        });

        if (!wrap) return new NextResponse("Not Found", { status: 404 });

        if (wrap.userId !== (session.user as any).id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.wrap.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DELETE_WRAP]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
