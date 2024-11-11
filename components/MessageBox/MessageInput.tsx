"use client";
import { Textarea } from "@/components/ui/textarea";
import { SendMessageButton } from "./SendMessageButton";
import { useState } from "react";

export function MessageInput() {
  const [message, setMessage] = useState("");

  return (
    <div className="relative">
      <Textarea
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the component you want to build..."
        className="border border-gray-200 h-24 resize-none"
      />
      {/*TODO: add a loader here in place of the button till the time it gets loaded */}
      <SendMessageButton message={message} />
    </div>
  );
}
