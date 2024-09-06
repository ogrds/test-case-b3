import { ModeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b flex items-center p-4 justify-end">
        <ModeToggle />
      </header>

      <main className="flex items-center justify-center flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
