import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Welcome to my app. I was too scared to put things directly in the Home
      component, so please click this button to continue.
      <Link href="/puzzle" className="bg-emerald-600">
        <span>Thanks</span>
      </Link>
    </main>
  );
}
