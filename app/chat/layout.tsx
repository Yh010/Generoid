import "../globals.css";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      Have a great day building and shipping
      {children}
    </div>
  );
}
