"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = useAuth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-8 lg:p-20 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center w-full max-w-md mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold">
          Soldi
        </h1>
        <div className="w-full">
          <SignIn />
        </div>
      </main>
    </div>
  );
}
