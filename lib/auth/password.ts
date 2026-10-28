"use server";

import argon2 from "argon2";

export async function pwdHash(password: string) {
  const SECRET: string = process.env.ARGON2_SECRET ?? "";
  if (!SECRET) {
    throw new Error("ARGON2_SECRET is not defined");
  }
  return await argon2.hash(password, {secret: Buffer.from(SECRET)});
}

export async function pwdVerify(hash: string, password: string) {
  const SECRET: string = process.env.ARGON2_SECRET ?? "";
  if (!SECRET) {
    throw new Error("ARGON2_SECRET is not defined");
  }
  return await argon2.verify(hash, password, {secret: Buffer.from(SECRET)});
}
