/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
interface Profile {
  email?: string
  name?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function CheckExistingUser(profile:any) {
    const existingUser = await prisma.generoidUsers.findUnique({
        where: { email: profile?.email }
    })
    return existingUser;
}

export async function CreateNewUser(profile:any) {
    await prisma.generoidUsers.create({
        data: {
            email: profile?.email,
            name: profile?.name,
        }
    })
}

export async function CreateNewChat(profile:any,chatName:string) {
    const user = await CheckExistingUser(profile);
    if (!user) throw new Error("User not found")
    return await prisma.chat.create({
        data: {
            userId: user.id,
            name: chatName,
            messages: [] 
        }
    })
}

export async function AddNewMessage(message: Message, chatId: string) {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId }
    })
    if (!chat) throw new Error("Chat not found")
    
    const messages = JSON.parse(JSON.stringify(chat.messages)) as Message[]
    
    return await prisma.chat.update({
        where: { id: chatId },
        data: {
            messages: JSON.parse(JSON.stringify([...messages, message]))
        }
    })
}

export async function GetUserChats(profile: Profile) {
  const user = await CheckExistingUser(profile)
  if (!user) throw new Error("User not found")

  return await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })
}