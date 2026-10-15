"use client";

import {useActionState} from "react";
import {createUser, updateUser, deleteUser} from "@/app/users/_lib/actions";
import type {UserItem, UserFormState} from "@/app/users/_lib/types";

export const initialState: UserFormState = {};

type UserListProps = {
  users: UserItem[];
};

function FieldError({messages}: {messages?: string[]}) {
  if (!messages?.length) return <p className="w-full text-sm"></p>;

  return (
    <p className="w-full truncate text-sm text-red-600" role="alert">
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
      className="mb-8 flex flex-wrap items-center gap-2 rounded border border-gray-600 p-4"
    >
      <div className="min-w-0 flex-1">
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          name="firstName"
          placeholder="Vorname"
          required
        />
        <FieldError messages={state.errors?.firstName} />
      </div>

      <div className="min-w-0 flex-1">
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          name="lastName"
          placeholder="Nachname"
          required
        />
        <FieldError messages={state.errors?.lastName} />
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

      <div className="min-w-0 flex-1">
        <input
          className="w-full rounded border border-gray-300 px-3 py-2"
          name="password"
          type="password"
          placeholder="Passwort (mind. 8 Zeichen)"
          minLength={8}
          required
        />
        <FieldError messages={state.errors?.password} />
      </div>

      <button
        className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none focus:outline focus:outline-white hover:bg-gray-700 dark:bg-gray-800 "
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
        className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2"
      >
        <input type="hidden" name="id" value={user.id} />

        <div className="min-w-0 flex-1">
          <input
            className="w-full rounded border border-gray-300 px-3 py-2"
            name="firstName"
            defaultValue={user.firstName}
            placeholder="Vorname"
            required
          />
          <FieldError messages={state.errors?.firstName} />
        </div>

        <div className="min-w-0 flex-1">
          <input
            className="w-full rounded border border-gray-300 px-3 py-2"
            name="lastName"
            defaultValue={user.lastName}
            placeholder="Nachname"
            required
          />
          <FieldError messages={state.errors?.lastName} />
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
          <FieldError messages={state.errors?.email} />
        </div>

        <div className="flex flex-col items-center justify-center sm:basis-5/15">
          <p className="text-center text-sm text-gray-500">
            {new Date(user.createdAt).toLocaleString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <FieldError messages={state.errors?.id} />
        </div>

        <button
          className="cursor-pointer rounded bg-green-600 px-4 py-1 text-sm font-bold text-white disabled:opacity-50"
          type="submit"
          disabled={pending}
        >
          {pending ? "Speichert …" : "Update"}
        </button>

        {state.message && (
          <p className="w-full text-sm text-green-700" role="status">
            {state.message}
          </p>
        )}
      </form>

      <form action={deleteUser} className="sm:basis-1/15">
        <input type="hidden" name="id" value={user.id} />

        <button
          className="cursor-pointer rounded bg-red-600 px-4 py-1 text-sm font-bold text-white"
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
