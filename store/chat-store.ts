import { create } from 'zustand'


interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatStore {
  userChats: UserChat[]  
  messages: Message[]
  addMessage: (chatId: string,message: Message) => Promise<void>
  codeState: string
  setCode: (code: string) => void
  isLoading: boolean;
  error: string | null
  currentChat: UserChat | null
  setCurrentChat: (chat: UserChat | null) => void
  clearError: () => void
}

interface UserChat{
  id: string
  name: string
  messages: Message[]
  createdAt:  Date
  //store the code as well?
}

interface UserChatStore{
  userChats: UserChat[]  
  fetchUserChats: () => Promise<void>;
  addNewChat: (chatName: string) => Promise<void>;
  isLoading: boolean;
  error: string | null
 // currentChat: Chat | null
}

export const useChatStore = create<ChatStore>((set) => ({
  userChats: [],
  messages: [],
  codeState: '',
  isLoading: false,
  error: null,
  currentChat: null,
 
  //done
  addMessage: async (chatId: string, message: Message) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      if (!response.ok) throw new Error('Failed to add message')
      const updatedChat = await response.json();
      set(state => ({
        userChats: state.userChats.map(chat => 
          chat.id === chatId ? updatedChat : chat
        ),
        currentChat: state.currentChat?.id === chatId ? updatedChat : state.currentChat
      }))
     
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  //TODO: add fetchChatMessages action


  setCode: (code: string) => set({ codeState: code }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  clearError: () => set({ error: null })
}))

export const useUserChatStore = create<UserChatStore>((set) => ({
  userChats: [],
  isLoading: false,
  error: null, 
  //currentChat: null,
  //done 
  fetchUserChats: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/chat');
      if (!response.ok) throw new Error('Failed to fetch chats')
      const userChats = await response.json()
      set({ userChats })

    } catch (error) {
      set({ error: (error as Error).message })
    }finally {
      set({ isLoading: false })
    }
   
  },

  //done
  addNewChat: async (chatName:string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatName })
      })
      if (!response.ok) throw new Error('Failed to create chat')
      const newChat = await response.json()
      set(state => ({
        userChats: [newChat, ...state.userChats]
      }));
      return newChat
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  //setCurrentChat: (chat) => set({ currentChat: chat }),
  clearError: () => set({ error: null })
  //TODO: Add functions for delete & rename user chat  
}))

// TODO:
// - use of currentChat
// - fix message sending on landing page 
// - why messages arent rendering on the chat page 



//TODO: BUG FIX SOLUTION:
// Using Prisma functions directly in a Zustand store will cause issues because the store runs on the client side
// SOLUTION:
// MAKE API CALLS (FETCH CALLS) FROM THE STORE , AND MOVE THE PRISMA FUNCTIONS TO /API FOLDER
//reference: https://claude.ai/chat/e9131730-8faf-481a-9a50-bad7b0ac2a11
//need to write some store logic as well => properly check that