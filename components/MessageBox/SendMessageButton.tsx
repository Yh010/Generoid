"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chat-store";

interface MessageProps {
  message: string;
}
export function SendMessageButton({ message }: MessageProps) {
  const router = useRouter();
  const addMessage = useChatStore((state) => state.addMessage);

  async function sendMessage() {
    addMessage({ role: "user", content: message });
    const response = await axios.post("/api/ai", {
      message: message,
    });
    addMessage({ role: "assistant", content: response.data.message });

    router.push("/chat");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute bottom-0 right-0.5 w-20 bg-black text-white mb-2 mr-2"
      onClick={sendMessage}
    >
      Generate
    </Button>
  );
}
