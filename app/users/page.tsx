import UserList from "@/app/users/_components/UserList";
import {prisma} from "@/lib/prisma";

export const metadata = {
  title: "Users",
  description: "List of users",
};

export default async function Page() {
  const users = await prisma.user.findMany({
    orderBy: {createdAt: "desc"},
  });
  console.log(users);
  return (
    <main className="flex flex-1 flex-col gap-4 items-start justify-start px-8 py-10 w-full">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Users</h1>
      <div className="flex flex-col gap-2 w-full">
        <UserList users={users} />
      </div>
    </main>
  );
}
