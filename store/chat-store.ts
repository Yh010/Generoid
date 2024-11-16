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
  chatId: string
}

interface UserChatStore{
  userChats: UserChat[]  
  addNewChat: (newChat: UserChat) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  codeState:'',
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setCode: (code:string) =>  set({codeState:code })
}))

export const UserChatStore = create<UserChatStore>((set) => ({
  userChats: [],
  addNewChat: (newChat) => set((state) => ({ userChats: [...state.userChats, newChat] }))
  //TODO: Add delete & rename user chat 
}))