import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-between py-32 px-16 w-full bg-white dark:bg-black sm:items-start">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
        Welcome to Next.js!
      </h1>
    </main>
  );
}
