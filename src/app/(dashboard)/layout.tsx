"use client";

import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/theme-toggle";
import { selectUser } from "@/lib/features/authentication/authenticationSlice";
import { useAppSelector } from "@/lib/hooks";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useAppSelector(selectUser);

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b flex items-center p-4 justify-end">
        <span className="mr-auto">{`Welcome ${user?.firstName}`}</span>
        <ModeToggle />
        <LogoutButton />
      </header>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
