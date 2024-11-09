"use client";
import { useChatStore } from "@/store/chat-store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export default function ChatPage() {
  const { messages, addMessage } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  //introduce new state here to clear the input box when user sends a message

  async function sendMessage() {
    if (!newMessage.trim()) return;

    addMessage({ role: "user", content: newMessage });

    const response = await axios.post("/api/ai", {
      message: newMessage,
      history: messages,
    });

    addMessage({ role: "assistant", content: response.data.message });

    setNewMessage("");
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-100 mr-auto max-w-[80%]"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="relative">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="pr-24"
        />
        <Button onClick={sendMessage} className="absolute bottom-2 right-2">
          Send
        </Button>
      </div>
    </div>
  );
}
