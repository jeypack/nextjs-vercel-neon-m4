"use server";

import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function createUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email) return;

  await prisma.user.create({
    data: {name, email},
  });

  revalidatePath("/users");
}

export async function updateUser(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!Number.isInteger(id) || id <= 0 || !name || !email) return;

  await prisma.user.update({
    where: {id},
    data: {name, email},
  });

  revalidatePath("/users");
}

export async function deleteUser(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) return;

  await prisma.user.delete({
    where: {id},
  });

  revalidatePath("/users");
}
