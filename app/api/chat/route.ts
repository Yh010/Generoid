/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { handler } from "../auth/[...nextauth]/route";
import { CreateNewChat, GetUserChats } from "@/app/lib/server/prismaFunctions";

interface SessionType{
    user: {
        email: string
        name: string
        image:string
    }
}

export async function GET() {
    try {
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
        const chats = await GetUserChats(email);
        return NextResponse.json(chats)
    } catch (error:any) {
        console.error('Error fetching chats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chats' }, 
            { status: 500 }
        )
    }
}

export async function POST(req:Request) {
    try {
        const session = await getServerSession(handler);
        console.log(session);
        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' }, 
                { status: 401 }
            )
        }

        const { chatName } = await req.json(); //shouldnt this be req.body.json() ?
        const typedSession = session as SessionType
        const email = typedSession.user.email;

        const newChat = await CreateNewChat(email, chatName);
        return NextResponse.json(newChat)
        
    } catch (error) {
        console.error('Error creating new chat:', error)
        return NextResponse.json(
            { error: 'Failed to create new chat' }, 
            { status: 500 }
        )
    }
}