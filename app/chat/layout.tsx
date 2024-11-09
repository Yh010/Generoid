import "../globals.css";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>chat name</div>

      {children}
    </div>
  );
}
