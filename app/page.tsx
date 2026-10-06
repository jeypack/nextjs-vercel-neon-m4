import Counter from "@/app/_components/Counter";

export const metadata = {
  title: "Home",
  description: "Welcome to the Next.js homepage",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-start justify-between px-8 py-10 w-full">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
        Welcome to Next.js!
      </h1>
      <Counter />
    </main>
  );
}
