
"use server";

import * as yup from "yup";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ---------- Validation schemas ----------

const createUserSchema = yup.object({
  name: yup.string().trim().required("Name ist erforderlich"),
  email: yup
    .string()
    .trim()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
});

const updateUserSchema = createUserSchema.shape({
  id: yup.number().integer().positive().required(),
});

const deleteUserSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// ---------- Shared types ----------

export type UserFormState = {
  errors?: {
    id?: string[];
    name?: string[];
    email?: string[];
  };
  message?: string;
};

type UserField = "id" | "name" | "email";

// ---------- Validation error handling ----------

function getValidationErrors(
  error: yup.ValidationError
): UserFormState {
  const errors: NonNullable<UserFormState["errors"]> = {};

  const issues = error.inner.length ? error.inner : [error];

  for (const issue of issues) {
    const field = issue.path as UserField | undefined;

    if (field && ["id", "name", "email"].includes(field)) {
      errors[field] ??= [];
      errors[field]!.push(issue.message);
    }
  }

  return { errors };
}

// ---------- Create ----------

export async function createUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  let data;

  try {
    data = await createUserSchema.validate(
      {
        name: formData.get("name"),
        email: formData.get("email"),
      },
      { abortEarly: false, stripUnknown: true }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return getValidationErrors(error);
    }

    throw error;
  }

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });

  revalidatePath("/users");

  return { message: "User wurde angelegt." };
}

// ---------- Update ----------

export async function updateUser(
  _prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  let data;

  try {
    data = await updateUserSchema.validate(
      {
        id: formData.get("id"),
        name: formData.get("name"),
        email: formData.get("email"),
      },
      { abortEarly: false, stripUnknown: true }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return getValidationErrors(error);
    }

    throw error;
  }

  await prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email,
    },
  });

  revalidatePath("/users");

  return { message: "User wurde gespeichert." };
}

// ---------- Delete ----------

export async function deleteUser(formData: FormData): Promise<void> {
  const data = await deleteUserSchema.validate(
    { id: formData.get("id") },
    { abortEarly: false }
  );

  await prisma.user.delete({
    where: { id: data.id },
  });

  revalidatePath("/users");
}
