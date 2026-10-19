import {prisma} from "../lib/prisma";
import bcrypt from "bcryptjs";

async function seed() {
  if (process.env.VERCEL_ENV === "production") {
    console.log("Auto-seed disabled for production.");
    return;
  }

  // ---------- Test user ----------
  const email = "alice@test.com";

  const existingUser = await prisma.user.findUnique({
    where: {email},
  });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash("Test1234", 12);

    await prisma.user.create({
      data: {
        firstName: "Alice",
        lastName: "Alisson",
        email,
        passwordHash,
        role: "USER",
      },
    });

    console.log("Seed user created.");
  } else {
    console.log("Seed user already exists. Skipping.");
  }

  // ---------- Admin ----------
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured.");
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: {email: adminEmail},
    update: {
      // Vorhandenen Admin nicht verändern.
    },
    create: {
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin seeded (created or already exists).");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
