import { Textarea } from "@/components/ui/textarea";
import { SendMessageButton } from "./SendMessageButton";
import ComingSoonAlert from "../ComingSoonAlert/ComingSoon";

export function MessageInput() {
  return (
    <div className="relative">
      <Textarea
        placeholder="Type your message here."
        className="border border-gray-200 h-24"
      />
      <ComingSoonAlert component={<SendMessageButton />} />
    </div>
  );
}
