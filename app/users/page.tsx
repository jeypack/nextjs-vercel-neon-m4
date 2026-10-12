import {createUser, updateUser, deleteUser} from "@/app/users/_lib/users";
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
      <form
        action={createUser}
        className="flex flex-row gap-2 justify-center items-center mb-2"
      >
        <input
          className="border border-gray-300 rounded px-4 py-2"
          name="name"
          placeholder="Name"
        />
        <input
          className="border border-gray-300 rounded px-4 py-2"
          name="email"
          placeholder="Email"
        />
        <button
          className="cursor-pointer bg-blue-500 font-bold text-white text-lg px-4 py-1.5 rounded"
          type="submit"
        >
          Create
        </button>
      </form>
      <div className="flex flex-col gap-2 w-full">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-gray-600 flex flex-col sm:flex-row gap-2 justify-between items-baseline rounded px-4 py-2"
          >
            <p className="sm:basis-1/15">{user.id}</p>

            {/* Update */}
            <form
              action={updateUser}
              className="flex flex-1 flex-wrap items-center gap-2"
            >
              <input type="hidden" name="id" value={user.id} />

              <input
                className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2"
                name="name"
                defaultValue={user.name ?? "N/A"}
                placeholder="Name"
                required
              />

              <input
                className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2"
                name="email"
                type="email"
                defaultValue={user.email ?? "N/A"}
                placeholder="E-Mail"
                required
              />

              <p className="sm:basis-5/15 text-center text-gray-300">
                {user.createdAt.toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <button
                className="cursor-pointer rounded bg-green-600 px-4 py-2 font-bold text-white"
                type="submit"
              >
                Update
              </button>
            </form>

            {/* Delete */}
            <form action={deleteUser} className="sm:basis-1/15">
              <input type="hidden" name="id" value={user.id} />

              <button
                className="cursor-pointer rounded bg-red-600 px-4 py-2 font-bold text-white"
                type="submit"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
