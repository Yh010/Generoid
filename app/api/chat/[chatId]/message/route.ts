import { handler } from "@/app/api/auth/[...nextauth]/route";
import { AddNewMessage } from "@/app/lib/server/prismaFunctions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function POST(req: Request,
  { params }: { params: { chatId: string } }) {
    try {
        const session = await getServerSession(handler);
        console.log(session);
        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' }, 
                { status: 401 }
            )
        }

        const { message } = await req.json()
        const updatedChat = await AddNewMessage(message, params.chatId);
        return NextResponse.json(updatedChat)
    } catch (error) {
        console.error('Error adding message:', error)
        return NextResponse.json(
            { error: 'Failed to add message' }, 
            { status: 500 }
        )
    }
}

  //TODO: add get ChatMessages endpoint