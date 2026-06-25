"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";
import {
  SignInButton,
  UserButton,
  useUser
} from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 flex justify-between p-4 bg-[#111827]">

      <Link
        href="/"
        className="flex items-center gap-2"
      >
        <Hammer />
        TONYS HARDWARE
      </Link>

      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <button>
            Login
          </button>
        </SignInButton>
      )}

    </nav>
  );
}