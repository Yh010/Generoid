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

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  codeState:'',
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setCode: (code:string) =>  set({codeState:code })
}))