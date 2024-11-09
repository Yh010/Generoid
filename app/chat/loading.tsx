import { Loader2 } from "lucide-react";

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gray-600 opacity-20 animate-ping"></div>
        <div className="relative rounded-full bg-gray-500 p-8">
          <Loader2 className="w-12 h-12 text-black-600 animate-spin" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-semibold text-black">Loading...</h2>
      <p className="mt-2 text-black text-opacity-80">
        Please wait while we prepare your content
      </p>
    </div>
  );
}
