"use server";

import * as yup from "yup";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {getCurrentUser} from "@/lib/auth/session";
import {del, put} from "@vercel/blob";
import type {UserItem, UserFormState} from "@/app/user/_lib/types";

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

// ---------- All Users ----------
export async function getUsers(): Promise<UserItem[]> {
  let users: UserItem[] = [];
  try {
    users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        image: true,
      },
      orderBy: {createdAt: "desc"},
    });
  } catch (error) {
    console.warn(error);
  }
  return users;
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

  revalidatePath("/user");

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

  revalidatePath("/user");

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

  revalidatePath("/user");
}

export async function uploadProfileImage(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Du musst angemeldet sein.");
  }

  const file = formData.get("image");
  console.log("Blob file:", file);
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Bitte wähle ein Bild aus.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Erlaubt sind JPG, PNG und WebP.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Das Bild darf maximal 2 MB groß sein.");
  }

  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[file.type];

  const detectedType = await detectImageType(file);

  if (!detectedType || detectedType !== file.type) {
    throw new Error("Die Datei ist kein gültiges Bild.");
  }

  // Bisheriges Profilbild ermitteln
  const existingUser = await prisma.user.findUnique({
    where: {id: user.id},
    select: {image: true},
  });
  //console.log("Existing user image:", existingUser?.image);
  // Neues Bild hochladen
  const blob = await put(
    `avatars/${user.id}/${crypto.randomUUID()}.${extension}`,
    file,
    {
      access: "public",
      contentType: file.type,
    },
  );

  //console.log("New blob URL:", blob.url);
  // Datenbank aktualisieren
  await prisma.user.update({
    where: {id: user.id},
    data: {image: blob.url},
  });

  // Altes Bild löschen, falls vorhanden
  const oldImage = existingUser?.image;

  if (oldImage && oldImage !== blob.url) {
    await del(oldImage);
  }
  //console.log("Profile image saved for user:", user.id);
  revalidatePath("/user/profile");
}

async function detectImageType(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF....WEBP
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

/* 
import sharp from "sharp";

async function validateImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const metadata = await sharp(buffer).metadata();

  const allowedFormats = ["jpeg", "png", "webp"];

  if (!metadata.format || !allowedFormats.includes(metadata.format)) {
    throw new Error("Ungültiges Bildformat.");
  }

  if (!metadata.width || !metadata.height) {
    throw new Error("Das Bild ist beschädigt.");
  }

  if (metadata.width > 6000 || metadata.height > 6000) {
    throw new Error("Das Bild ist zu groß.");
  }

  return buffer;
} */
