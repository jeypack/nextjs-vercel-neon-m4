import {prisma} from "../lib/prisma";
import bcrypt from "bcryptjs";

async function seed() {
  if (process.env.VERCEL_ENV === "production") {
    console.log("Auto-seed disabled for production.");
    return;
  }

  const email = "alice@test.com";
  const existingUser = await prisma.user.findUnique({
    where: {email},
  });

  if (existingUser) {
    console.log("Seed user already exists. Skipping.");
    return;
  }

  const passwordHash = await bcrypt.hash("Test1234", 12);

  await prisma.user.create({
    data: {
      firstName: "Alice",
      lastName: "Alisson",
      email,
      passwordHash,
    },
  });

  console.log("Seed user created.");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
