import "../globals.css";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      hi chat from layout
      {children}
    </div>
  );
}
