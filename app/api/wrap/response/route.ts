
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { wrapId, name, isAnonymous, answers, secretMessage, secretUnlockDate } = body;

        if (!wrapId || !answers) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // 1. Create the main response
        const response = await prisma.response.create({
            data: {
                wrapId,
                name: isAnonymous ? null : name,
                isAnonymous,
                answers, // Json
                // photoUrl: TODO
            }
        });

        // 2. If there is a secret message, create it
        if (secretMessage && secretMessage.trim() !== "") {
            await prisma.secretMessage.create({
                data: {
                    wrapId,
                    content: secretMessage,
                    senderName: isAnonymous ? null : name,
                    isAnonymous,
                    unlockDate: secretUnlockDate ? new Date(secretUnlockDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // Default 1 year if missing
                }
            });
        }

        return NextResponse.json({ success: true, id: response.id });
    } catch (error) {
        console.error("[RESPONSE_SUBMIT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
