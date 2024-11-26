/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface Message {
  role: 'user' | 'assistant'
  content: string
}
//done
export async function CheckExistingUser(email:any) {
    const existingUser = await prisma.generoidUsers.findUnique({
        where: { email: email }
    })
    return existingUser;
}
//done
export async function CreateNewUser(profile:any) {
    await prisma.generoidUsers.create({
        data: {
            email: profile?.email,
            name: profile?.name,
        }
    })
}

export async function CreateNewChat(email:any,chatName:string) {
    const user = await CheckExistingUser(email);
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

//done
export async function GetUserChats(email:string) {
  const user = await CheckExistingUser(email)
  if (!user) throw new Error("User not found")

  return await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } }, // Include email from the related user
    },
  })
}

//done
export async function GetChatMessages(email:string,chatId:string) {
    const user = await CheckExistingUser(email)
    if (!user) throw new Error("User not found")
    
    return await prisma.chat.findUnique({
        where: {
            id:chatId
        }
    })
}