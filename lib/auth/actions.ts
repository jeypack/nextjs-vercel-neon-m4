"use server";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth/session";
import {pwdHash, pwdVerify} from "@/lib/auth/password";

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

  const passwordHash = await pwdHash(password);
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

  //redirect("/user");
  revalidatePath("/");
  return {success: "Du bist erfolgreich angemeldet."};
}

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  /* 
  const passwordHash = await pwdHash(password);
  console.log("passwordHash:", passwordHash);
  // 1. $argon2id$v=19$m=65536,p=4,t=3$dHcOpii6Y3wYkSN4LVchJA$FWkPX3VxGhY4XfaapwjS1QB2S+ITDyu/jfbjRzVU9EE
  // 2. $argon2id$v=19$m=65536,p=4,t=3$4f0+geE100hN1rKmUxPVtA$KGoB2JtXp+dkouItQ+ahKDkpw1CRD6J7v9C3BAUzBJM
 */
  const user = await prisma.user.findUnique({
    where: {email},
  });

  if (!user || !(await pwdVerify(user.passwordHash, password))) {
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

  //redirect("/user");
  revalidatePath("/");
  return {success: "Du bist erfolgreich angemeldet."};
}

export async function updateProfile(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await getCurrentUser();

  if (!user) {
    return {error: "Bitte melde dich zuerst an."};
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password || confirmPassword) {
    if (password.length < 8) {
      return {error: "Das neue Passwort muss mindestens 8 Zeichen haben."};
    }

    if (password !== confirmPassword) {
      return {error: "Die neuen Passwörter stimmen nicht überein."};
    }
  }

  try {
    const passwordHash = password ? await pwdHash(password) : undefined;

    await prisma.user.update({
      where: {id: user.id},
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        ...(passwordHash ? {passwordHash} : {}),
      },
    });
  } catch {
    return {
      error:
        "Das Profil konnte nicht gespeichert werden. Bitte versuche es erneut.",
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
      where: { id: sessionId },
    });
  }

  cookieStore.delete("sessionId");

  revalidatePath("/");
  //redirect("/user");
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

  if (!account || !(await pwdVerify(account.passwordHash, password))) {
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
