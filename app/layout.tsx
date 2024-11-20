import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import { AppSidebar } from "@/components/Sidebar/appsidebar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Generoid",
  description: "AI generated UI Components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            {/* TODO: Next js capabilities arent being used fully....need to optimize a lot of things */}
            <main className="w-full h-full max-h-screen">{children}</main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
