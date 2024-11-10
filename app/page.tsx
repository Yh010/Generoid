import { MessageInput } from "@/components/MessageBox/MessageInput";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="w-1/2 flex flex-col space-y-6">
        <div className="text-black font-bold">Generoid UI builder</div>
        <div className="text-black font-bold text-3xl">
          Build stunning UI components with Generoid
        </div>
        <div>What can I help you ship today?</div>
        <MessageInput />
        <div>Or try these examples</div>
        <div className="flex justify-between">
          <Button variant="outline" className="font-semibold">
            Hero section
          </Button>
          <Button variant="outline" className="font-semibold">
            Features Grid
          </Button>
          <Button variant="outline" className="font-semibold">
            Pricing section
          </Button>
          <Button variant="outline" className="font-semibold">
            Testimonials section
          </Button>
        </div>
      </div>
    </div>
  );
}
