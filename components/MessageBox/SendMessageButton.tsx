import { Button } from "@/components/ui/button";

export function SendMessageButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute bottom-0 right-0.5 w-20 bg-black text-white mb-2 mr-2"
    >
      Generate
    </Button>
  );
}
