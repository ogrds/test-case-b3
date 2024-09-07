"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/authentication/authenticationSlice";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleLogout() {
    dispatch(logout());
    router.push("/signup");
  }

  return (
    <Button variant="outline" className="ml-4" onClick={handleLogout}>
      <LogOut className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
