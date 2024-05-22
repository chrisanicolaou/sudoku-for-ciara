"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRandomAffirmation } from "./lib/data/affirmations";

export default function Home() {
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    setAffirmation(getRandomAffirmation());
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      {affirmation}
      <Link href="/puzzle" className="bg-emerald-600">
        <span>Take me to sudoku</span>
      </Link>
    </main>
  );
}
