"use client";

import {useActionState} from "react";
import {
  createUser,
  updateUser,
  deleteUser,
  type UserFormState,
} from "@/app/users/_lib/users";

type UserItem = {
  id: number;
  name: string | null;
  email: string;
  createdAt: Date;
};

export const initialState: UserFormState = {};

type UserListProps = {
  users: UserItem[];
};

function FieldError({messages}: {messages?: string[]}) {
  if (!messages?.length) return null;

  return (
    <p className="w-full text-sm text-red-600 truncate" role="alert">
      {messages.join(", ")}
    </p>
  );
}

// ---------- Create form ----------

function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form
      action={formAction}
      className="mb-8 flex flex-wrap items-start gap-2 rounded border border-gray-600 p-4"
    >
      <div className="min-w-0 flex-1">
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          name="name"
          placeholder="Name"
          required
        />
        <FieldError messages={state.errors?.name} />
      </div>

      <div className="min-w-0 flex-1">
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          name="email"
          type="email"
          placeholder="E-Mail"
          required
        />
        <FieldError messages={state.errors?.email} />
      </div>

      <button
        className="cursor-pointer rounded bg-blue-600 px-4 py-2 font-bold text-white disabled:opacity-50"
        type="submit"
        disabled={pending}
      >
        {pending ? "Wird angelegt …" : "Anlegen"}
      </button>

      {state.message && (
        <p className="w-full text-sm text-green-700" role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}

// ---------- Update form for one user ----------

function UserRow({user}: {user: UserItem}) {
  const [state, formAction, pending] = useActionState(updateUser, initialState);

  return (
    <div className="flex flex-col items-center justify-between gap-2 rounded border border-gray-600 px-4 py-2 sm:flex-row">
      <p className="sm:basis-1/15">{user.id}</p>

      <form
        action={formAction}
        className="flex min-w-0 flex-1 flex-wrap justify-center items-center gap-2"
      >
        <input type="hidden" name="id" value={user.id} />

        <div className="min-w-0 flex-1">
          <input
            className="w-full rounded border border-gray-300 px-3 py-2"
            name="name"
            defaultValue={user.name ?? ""}
            placeholder="Name"
            required
          />
          {/* <FieldError messages={state.errors?.name} /> */}
        </div>

        <div className="min-w-0 flex-1">
          <input
            className="w-full rounded border border-gray-300 px-3 py-2"
            name="email"
            type="email"
            defaultValue={user.email}
            placeholder="E-Mail"
            required
          />
          {/* <FieldError messages={state.errors?.email} /> */}
        </div>

        <div className="flex flex-col justify-center items-center sm:basis-5/15">
          <p className="text-center text-sm text-gray-500">
            {user.createdAt.toLocaleString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <FieldError messages={state.errors?.name} />
          <FieldError messages={state.errors?.email} />
        </div>

        <button
          className="cursor-pointer rounded bg-green-600 px-4 py-1 font-bold text-white text-sm disabled:opacity-50"
          type="submit"
          disabled={pending}
        >
          {pending ? "Speichert …" : "Update"}
        </button>

        <FieldError messages={state.errors?.id} />

        {state.message && (
          <p className="w-full text-sm text-green-700" role="status">
            {state.message}
          </p>
        )}
      </form>

      <form action={deleteUser} className="sm:basis-1/15">
        <input type="hidden" name="id" value={user.id} />

        <button
          className="cursor-pointer rounded bg-red-600 px-4 py-1 font-bold text-white text-sm"
          type="submit"
        >
          Delete
        </button>
      </form>
    </div>
  );
}

// ---------- User list ----------

export default function UserList({users}: UserListProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-gray-500">User anlegen</h2>
      <CreateUserForm />

      <h2 className="mb-3 text-lg font-bold text-gray-500">User-Liste</h2>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
}
