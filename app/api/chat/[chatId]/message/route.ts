import { handler } from "@/app/api/auth/[...nextauth]/route";
import { AddNewMessage, GetChatMessages } from "@/app/lib/server/prismaFunctions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface SessionType{
    user: {
        email: string
        name: string
        image:string
    }
}

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

export async function GET( 
  request: NextRequest,
  { params }: { params: { chatId: string } }) {
    try {
        const {chatId} = params;
        const session = await getServerSession(handler);
        console.log(session);
        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' }, 
                { status: 401 }
            )
        }
        const typedSession = session as SessionType
        const email = typedSession.user.email;
        const chatMessages = await GetChatMessages(email, chatId);
        return NextResponse.json(chatMessages)

    } catch (error) {
        console.error('Error fetching chat messages:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chat messages' }, 
            { status: 500 }
        )
    }
}
