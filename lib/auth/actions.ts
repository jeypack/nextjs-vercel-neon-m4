"use server";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {compare, hash} from "bcryptjs";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth/session";

export type AuthState = {
  error?: string;
  success?: string;
};

// Session duration in milliseconds (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function register(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {error: "Bitte gib eine gültige E-Mail-Adresse ein."};
  }

  if (password.length < 8) {
    return {error: "Das Passwort muss mindestens 8 Zeichen haben."};
  }

  if (password !== confirmPassword) {
    return {error: "Die Passwörter stimmen nicht überein."};
  }

  const existingUser = await prisma.user.findUnique({
    where: {email},
    select: {id: true},
  });

  if (existingUser) {
    return {error: "Diese E-Mail-Adresse ist bereits registriert."};
  }

  const passwordHash = await hash(password, 12);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  try {
    const session = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName: firstName || null,
          lastName: lastName || null,
        },
      });

      return tx.session.create({
        data: {
          userId: user.id,
          expiresAt,
        },
      });
    });

    const cookieStore = await cookies();

    cookieStore.set("sessionId", session.id, {
      ...cookieOptions,
      expires: expiresAt,
    });
  } catch {
    return {
      error: "Die Registrierung ist fehlgeschlagen. Bitte versuche es erneut.",
    };
  }

  redirect("/user");
}

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({
    where: {email},
  });

  if (!user || !(await compare(password, user.passwordHash))) {
    return {error: "E-Mail-Adresse oder Passwort ist falsch."};
  }

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("sessionId", session.id, {
    ...cookieOptions,
    expires: expiresAt,
  });

  redirect("/user");
}

export async function updateProfile(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await getCurrentUser();

  if (!user) {
    return {error: "Bitte melde dich zuerst an."};
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {error: "Bitte gib eine gültige E-Mail-Adresse ein."};
  }

  try {
    await prisma.user.update({
      where: {id: user.id},
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });
  } catch {
    return {
      error:
        "Das Profil konnte nicht gespeichert werden. Prüfe bitte, ob die E-Mail bereits verwendet wird.",
    };
  }

  revalidatePath("/user/profile");

  return {success: "Dein Profil wurde gespeichert."};
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (sessionId) {
    await prisma.session.deleteMany({
      where: {id: sessionId},
    });
  }

  cookieStore.delete("sessionId");
  redirect("/user");
}

export async function deleteAccount(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await getCurrentUser();

  if (!user) {
    return {error: "Du bist nicht angemeldet."};
  }

  const password = String(formData.get("password") ?? "");

  const account = await prisma.user.findUnique({
    where: {id: user.id},
    select: {passwordHash: true},
  });

  if (!account || !(await compare(password, account.passwordHash))) {
    return {error: "Das Passwort ist nicht korrekt."};
  }

  await prisma.user.delete({
    where: {id: user.id},
  });

  // Das Session-Cookie entfernen, nachdem der Account gelöscht wurde.
  const cookieStore = await cookies();
  cookieStore.delete("sessionId");

  redirect("/user");
}
