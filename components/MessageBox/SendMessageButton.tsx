"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useChatStore, useUserChatStore } from "@/store/chat-store";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface MessageProps {
  message: string;
}
export function SendMessageButton({ message }: MessageProps) {
  const { setCode } = useChatStore();
  const { userChats, addNewChat } = useUserChatStore();
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const addMessage = useChatStore((state) => state.addMessage);

  const getTargetChatId = async (): Promise<string> => {
    const newChat = await addNewChat(`Chat ${userChats.length + 1}`);
    return newChat.id;
  };

  async function sendMessage() {
    try {
      setIsLoading(true);
      const chatId = await getTargetChatId();

      addMessage(chatId, { role: "user", content: message });
      const response = await axios.post("/api/ai", {
        message: message,
      });

      addMessage(chatId, {
        role: "assistant",
        content: response.data.description,
      });
      setCode(response.data.code);
      if (chatId) {
        router.push(`/chat/${chatId}`);
      } else {
        console.error("Failed to get or create a valid chat ID");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute bottom-0 right-0.5 w-20 bg-black text-white mb-2 mr-2"
      onClick={sendMessage}
    >
      {loading ? (
        <Loader2 className="w-12 h-12 text-black-600 animate-spin" />
      ) : (
        "Generate"
      )}
    </Button>
  );
}
