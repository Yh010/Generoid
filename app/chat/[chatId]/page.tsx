"use client";
import { useChatStore } from "@/store/chat-store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bot, Ellipsis, PenLine, Trash2, Webhook } from "lucide-react";
import CodeSandbox from "@/components/CodeSandbox/CodeSandbox";
import Thinking from "@/components/ChatPage/Thinking";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PageProp {
  params: {
    chatId: string;
  };
}
export default function Page({ params }: PageProp) {
  const { messages, addMessage, codeState, setCode, fetchChatMessages } =
    useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //introduce new state here to clear the input box when user sends a message
  async function sendMessage() {
    if (!newMessage.trim()) return;
    setIsLoading(true);
    await addMessage(params.chatId, {
      role: "user",
      content: newMessage,
    });

    const response = await axios.post("/api/ai", {
      message: newMessage,
      history: messages,
    });
    await addMessage(params.chatId, {
      role: "assistant",
      content: response.data.description,
    });
    setCode(response.data.code);
    setIsLoading(false);
    setNewMessage("");
  }

  useEffect(() => {
    fetchChatMessages(params.chatId);
    //TODO: BUG: On page refresh, the code and preview section lose their values => so add these zustand actions here in the useEffect
  }, [params.chatId, fetchChatMessages]);
  return (
    <div className="flex justify-center h-screen">
      <div className="w-1/2 pb-6 px-6 pt-4">
        <div className="flex justify-between items-center">
          <div>chat name : {params.chatId}</div>
          <Popover>
            <PopoverTrigger className="hover:bg-slate-100 rounded-lg p-1">
              <Ellipsis />
            </PopoverTrigger>
            <PopoverContent className="w-full space-y-3">
              <div className="flex space-x-3">
                <PenLine /> <p>Rename</p>
              </div>
              <div className="flex space-x-3">
                <Trash2 /> <p>Delete</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-4 mb-4 pt-8 overflow-auto max-h-[85%] w-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex ${
                message.role === "user"
                  ? "mr-auto w-full"
                  : "mr-auto w-full bg-gray-100"
              }`}
            >
              <div className="mr-3">
                {message.role === "user" ? <Webhook /> : <Bot />}
              </div>

              {message.content}
            </div>
          ))}
          {isLoading && <Thinking />}
          <div className="fixed bottom-2 w-[38%]">
            <div className="relative">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="pr-24 rounded-lg bg-white resize-none"
              />
              <Button
                onClick={sendMessage}
                className="absolute bottom-2 right-2"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <CodeSandbox code={codeState} type="react" />
      </div>
    </div>
  );
}
