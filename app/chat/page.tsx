"use client";
import { useChatStore } from "@/store/chat-store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { Bot, Webhook } from "lucide-react";
import CodeSandbox from "@/components/CodeSandbox/CodeSandbox";
import Thinking from "@/components/ChatPage/Thinking";

export default function ChatPage() {
  const { messages, addMessage } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latestcode, setlatestcode] = useState("");
  //introduce new state here to clear the input box when user sends a message
  //BUG: why codesandbox doesnt appear after 1st msg? probably we need to put a state in zustand for the latest code and then it will work
  async function sendMessage() {
    if (!newMessage.trim()) return;
    setIsLoading(true);
    addMessage({ role: "user", content: newMessage });

    const response = await axios.post("/api/ai", {
      message: newMessage,
      history: messages,
    });
    addMessage({ role: "assistant", content: response.data.message });
    setlatestcode(response.data.message);
    setIsLoading(false);
    setNewMessage("");
  }

  return (
    <div className="flex justify-center border h-screen">
      <div className="border w-1/2 p-6">
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
          <div className="fixed bottom-2 w-2/5">
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
        <CodeSandbox code={latestcode} type="react" />
      </div>
    </div>
  );
}
