import { create } from 'zustand'

//TODO: Db functions to store everything to db => db code should be in the backend, and things to store in the db =>chathistory and chatid and user details

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
  chatName: string
  //store the code as well?
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

export const useUserChatStore = create<UserChatStore>((set) => ({
  userChats: [],
  addNewChat: (newChat) => set((state) => ({ userChats: [...state.userChats, newChat] }))
  //TODO: Add delete & rename user chat
  //TODO: when new user chat is created, the chat from other userchats should not come in this new chat => that is, contents of other chats shouldnt get mixed
  // solution => associate each userchat and contents with the id like this:
  // userchat-23r2r2r : {
  //    id:
  //    contents: 
  // }
  //properly modify the above structure
  
}))