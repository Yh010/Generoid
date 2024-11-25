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
  fetchChatMessages: (chatId:string) => Promise<void>
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
  addNewChat: (chatName: string) => Promise<UserChat>;
  isLoading: boolean;
  error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
  userChats: [],
  messages: [],
  codeState: '', //TODO: Bug: need to fix this action to update code and preview state based on chatId
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
        currentChat: state.currentChat?.id === chatId ? updatedChat : state.currentChat,
        messages: updatedChat.messages
      }))
     
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  //TODO: Graceful error handling, eg) if user is logged out => this function gives an error
  //TODO: BUG:
  // const response = await fetch(`/api/chat/${chatId}/message`);
//   80 |       if (!response.ok) {
// > 81 |         throw new Error('Failed to fetch messages')
//      |               ^
//   82 |       }
  //
  //
  fetchChatMessages: async (chatId:string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/chat/${chatId}/message`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const chat = await response.json();
      set(state => ({
        messages: chat.messages,
        currentChat: chat, 
        userChats: state.userChats.map(existingChat => 
          existingChat.id === chatId ? chat : existingChat
        )
      }));
      
    }catch (error) {
      set({ error: (error as Error).message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },


  setCode: (code: string) => set({ codeState: code }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  clearError: () => set({ error: null })
}))

export const useUserChatStore = create<UserChatStore>((set) => ({
  userChats: [],
  isLoading: false,
  error: null, 
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
      const newChat = await response.json();
      console.log(newChat.id)
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
  clearError: () => set({ error: null })
  //TODO: Add functions for delete & rename user chat  
}))

// TODO:
// - use of currentChat
