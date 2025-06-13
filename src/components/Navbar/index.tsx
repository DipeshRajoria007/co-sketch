"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "../ui/button";
import useGetPlatformTheme from "@/hooks/useGetPlatformTheme";

const Navbar = () => {
  const { resolvedTheme } = useGetPlatformTheme();
  const appearance = {
    baseTheme: resolvedTheme,
  };

  return (
    <header className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-color">
              CoSketch
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal" appearance={appearance}>
                <Button variant="outline">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal" appearance={appearance}>
                <Button variant="outline">Sign up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={appearance} />
            </SignedIn>
            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
