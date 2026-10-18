"use client";

import {useActionState} from "react";
import {createUser, updateUser, deleteUser} from "@/app/user/_lib/actions";
import type {UserItem, UserFormState} from "@/app/user/_lib/types";
import DeleteUserDialog from "@/app/user/_components/DeleteUserDialog";
import {useModal} from "@/app/_context/ModalContext";
import {
  primaryButton,
  secondaryButton,
  inputClass,
  tabClass,
  labelClass,
} from "@/app/_lib/tailwind";
import UserRoleList from "@/app/user/_components/UserRoleList";
//import { Role } from "@/lib/generated/prisma/client";

export const initialState: UserFormState = {};

type UserListProps = {
  users: UserItem[];
};

const divClass = "md:min-w-0 flex-1 w-full";

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
      className="mb-8 flex flex-col flex-wrap items-center gap-2 rounded border border-gray-600 p-4 w-full md:flex-row"
    >
      <div className={divClass}>
        <input
          className={inputClass}
          name="firstName"
          placeholder="Vorname"
          required
        />
        <FieldError messages={state.errors?.firstName} />
      </div>

      <div className={divClass}>
        <input
          className={inputClass}
          name="lastName"
          placeholder="Nachname"
          required
        />
        <FieldError messages={state.errors?.lastName} />
      </div>

      <div className={divClass}>
        <input
          className={inputClass}
          name="email"
          type="email"
          placeholder="E-Mail"
          required
        />
        <FieldError messages={state.errors?.email} />
      </div>

      <div className={divClass}>
        <input
          className={inputClass}
          name="password"
          type="password"
          placeholder="Passwort (mind. 8 Zeichen)"
          minLength={8}
          required
        />
        <FieldError messages={state.errors?.password} />
      </div>

      <div className={divClass}>
        <UserRoleList defaultValue={"USER"} />
      </div>

      <button
        className={primaryButton}
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
function UserRow({user, index}: {user: UserItem; index: number}) {
  const [state, formAction, pending] = useActionState(updateUser, initialState);
  const {open, close} = useModal();

  return (
    <div className="flex flex-col items-center justify-between gap-2 rounded border border-gray-600 px-4 py-2 md:flex-row">
      <p className="w-4 text-xs sm:text-sm">{index + 1}</p>
      <form
        action={formAction}
        className="flex min-w-0 flex-1 flex-wrap flex-col md:flex-row items-center justify-center gap-2 w-full"
      >
        <input type="hidden" name="id" value={user.id} />

        <div className={divClass}>
          <input
            className={inputClass}
            name="firstName"
            defaultValue={user.firstName || ""}
            placeholder="Vorname"
            required
          />
          <FieldError messages={state.errors?.firstName} />
        </div>

        <div className={divClass}>
          <input
            className={inputClass}
            name="lastName"
            defaultValue={user.lastName || ""}
            placeholder="Nachname"
            required
          />
          <FieldError messages={state.errors?.lastName} />
        </div>

        <div className={divClass}>
          <UserRoleList defaultValue={user.role} />
        </div>

        <div className={divClass}>
          <input
            className={inputClass}
            name="email"
            type="email"
            defaultValue={user.email}
            placeholder="E-Mail"
            required
          />
          <FieldError messages={state.errors?.email} />
        </div>

        <div className="flex flex-col items-center justify-center sm:basis-3/15">
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
          className="cursor-pointer rounded bg-green-800 hover:bg-green-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
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

      <div className="sm:basis-1/15">
        <button
          type="button"
          className="cursor-pointer rounded bg-red-800 hover:bg-red-700 px-5 py-2 text-sm font-bold text-white"
          onClick={() =>
            open(
              "User löschen",
              <DeleteUserDialog userId={user.id} onCancel={close} />,
            )
          }
        >
          Delete
        </button>
      </div>
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
        {users.map((user, index) => (
          <UserRow key={user.id} user={user} index={index} />
        ))}
      </div>
    </section>
  );
}
