import { User2 } from "lucide-react";
import "../globals.css";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-slate-200 p-4 flex justify-between items-center">
        <p>A simple Card</p>
        <div>
          <User2 />
        </div>
      </div>

      {children}
    </div>
  );
}
