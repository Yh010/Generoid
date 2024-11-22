import { CreateNewChat, GetUserChats } from '@/app/lib/server/prismaFunctions'
import { JsonArray } from '@prisma/client/runtime/library'
import { create } from 'zustand'


interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatStore {
  messages: Message[]
  addMessage: (message: Message) => void
  codeState: string
  setCode:(code: string) => void
}

interface UserChat{
  id: string
  name: string
  messages: JsonArray
  email:string
  //store the code as well?
}

interface UserChatStore{
  userChats: UserChat[]  
  fetchUserChats: (email: string) => Promise<void>;
  addNewChat: (newChat: UserChat) => Promise<void>
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  codeState:'',
  addMessage: (message) => 
  set((state) => ({ messages: [...state.messages, message] })),
  setCode: (code:string) =>  set({codeState:code })
}))

export const useUserChatStore = create<UserChatStore>((set) => ({
  userChats: [],
  fetchUserChats: async (email: string) => {
    if (!email) return;
    try {
      const chats = await GetUserChats(email);
      const userChats = chats.map((chat) => ({
        id: chat.id,
        name: chat.name,
        messages: chat.messages,
        email: chat.user.email || "", // Access the included email
      }));
      set({ userChats });
    } catch (error) {
      console.error('Error fetching user chats:', error);
    }
  },
  addNewChat: async (newChat) => {
    if (!newChat.email) return;
    try {
      await CreateNewChat(newChat.email, newChat.name); 
      console.log("reacged her");
      set((state) => ({ userChats: [...state.userChats, newChat] }))
    } catch (error) {
       console.error('Error creating new chat for user:', error);
    }
  }
  //TODO: Add functions for delete & rename user chat  
}))