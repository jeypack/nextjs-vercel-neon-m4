import Counter from "@/app/_components/Counter";
import Link from "next/link";

export const metadata = {
  title: "Home",
  description: "Welcome to the Next.js homepage",
};

export default function Page() {
  return (
    <main className="flex flex-1 flex-col gap-4 items-start justify-start px-8 py-10 w-full">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
        Welcome to Next.js!
      </h1>
      <Link
        className="text-emerald-600 hover:underline hover:underline-offset-2"
        href="https://www.google.com"
      >
        Go to Google
      </Link>
      <Counter />
    </main>
  );
}
