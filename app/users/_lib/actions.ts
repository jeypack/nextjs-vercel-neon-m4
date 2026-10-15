"use server";

import * as yup from "yup";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import type {UserItem, UserFormState} from "@/app/users/_lib/types";

// ---------- Validation schemas ----------
const createUserSchema = yup.object({
  firstName: yup.string().trim().required("Vorname ist erforderlich"),
  lastName: yup.string().trim().required("Nachname ist erforderlich"),
  email: yup
    .string()
    .trim()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  password: yup
    .string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .required("Passwort ist erforderlich"),
});

const updateUserSchema = createUserSchema.omit(["password"]).shape({
  id: yup.number().integer().positive().required(),
});

const deleteUserSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// ---------- Shared types ----------
type UserField = keyof NonNullable<UserFormState["errors"]>;

// ---------- Validation error handling ----------
function getValidationErrors(error: yup.ValidationError): UserFormState {
  const errors: NonNullable<UserFormState["errors"]> = {};
  const issues = error.inner.length ? error.inner : [error];

  for (const issue of issues) {
    const field = issue.path as UserField | undefined;

    if (
      field &&
      ["id", "firstName", "lastName", "email", "password"].includes(field)
    ) {
      errors[field] ??= [];
      errors[field]!.push(issue.message);
    }
  }

  return {errors};
}

// ---------- Create ----------
export async function getUsers(): Promise<UserItem[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
      orderBy: {createdAt: "desc"},
    });
    
    console.log("users", users);

    revalidatePath("/users");

    return users;
  } catch (error) {
    console.warn(error);
    return [];
  }
}

// ---------- Create ----------
export async function createUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  let data;

  try {
    data = await createUserSchema.validate(
      {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
      },
      {abortEarly: false, stripUnknown: true},
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return getValidationErrors(error);
    }

    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
    },
  });

  revalidatePath("/users");

  return {message: "User wurde angelegt."};
}

// ---------- Update ----------
export async function updateUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  let data;

  try {
    data = await updateUserSchema.validate(
      {
        id: formData.get("id"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
      },
      {abortEarly: false, stripUnknown: true},
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return getValidationErrors(error);
    }

    throw error;
  }

  await prisma.user.update({
    where: {id: data.id},
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    },
  });

  revalidatePath("/users");

  return {message: "User wurde gespeichert."};
}

// ---------- Delete ----------
export async function deleteUser(formData: FormData): Promise<void> {
  const data = await deleteUserSchema.validate(
    {id: formData.get("id")},
    {abortEarly: false},
  );

  await prisma.user.delete({
    where: {id: data.id},
  });

  revalidatePath("/users");
}
