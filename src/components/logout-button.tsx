"use client";

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
    <button className="w-full text-left" onClick={handleLogout}>
      Sair
    </button>
  );
}
