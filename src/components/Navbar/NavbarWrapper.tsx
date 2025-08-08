"use client";

import { usePathname } from "next/navigation";
import Navbar from ".";

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRoomPage = pathname?.startsWith("/room/");

  return (
    <>
      {!isRoomPage && <Navbar />}
      {children}
    </>
  );
}
