"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {getCurrentUser} from "@/lib/auth/session";
import {prisma} from "@/lib/prisma";
import type {ShoppingListFormState} from "@/app/shopping-list/_lib/types";

const toggleSchema = z.object({
  id: z.coerce.number().int().positive("Ungültiger Einkaufslisten-Eintrag."),
  isBought: z.enum(["true", "false"], {
    message: "Ungültiger Kaufstatus.",
  }),
});

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function roundAmount(value: number) {
  return Math.round(value * 100) / 100;
}

function areAmountsEqual(left: number | null, right: number | null) {
  return left === right;
}

export async function generateShoppingListFromMealPlan(
  prevState: ShoppingListFormState,
  formData: FormData,
): Promise<ShoppingListFormState> {
  void prevState;
  void formData;

  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um deine Einkaufsliste zu erstellen.",
    };
  }

  const mealPlans = await prisma.mealPlan.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startOfToday(),
      },
    },
    select: {
      recipe: {
        select: {
          ingredients: {
            select: {
              ingredientId: true,
              amount: true,
              unitId: true,
            },
          },
        },
      },
    },
  });

  if (mealPlans.length === 0) {
    return {
      success: false,
      message:
        "Keine geplanten Mahlzeiten ab heute gefunden. Plane erst Rezepte im Wochenplan.",
    };
  }

  const requiredByKey = new Map<
    string,
    {
      ingredientId: number;
      unitId: number;
      amount: number | null;
    }
  >();

  for (const plan of mealPlans) {
    for (const ingredient of plan.recipe.ingredients) {
      if (!ingredient.unitId) {
        continue;
      }

      const key = `${ingredient.ingredientId}:${ingredient.unitId}`;
      const existing = requiredByKey.get(key);

      if (!existing) {
        requiredByKey.set(key, {
          ingredientId: ingredient.ingredientId,
          unitId: ingredient.unitId,
          amount: ingredient.amount,
        });
        continue;
      }

      if (existing.amount === null || ingredient.amount === null) {
        existing.amount = null;
        continue;
      }

      existing.amount = existing.amount + ingredient.amount;
    }
  }

  const pantryItems = await prisma.pantryItem.findMany({
    where: {
      userId: user.id,
      quantity: {
        not: null,
      },
    },
    select: {
      ingredientId: true,
      unitId: true,
      quantity: true,
    },
  });

  const pantryByKey = new Map<string, number>();

  for (const pantryItem of pantryItems) {
    if (pantryItem.quantity === null) {
      continue;
    }

    const key = `${pantryItem.ingredientId}:${pantryItem.unitId}`;
    const current = pantryByKey.get(key) ?? 0;
    pantryByKey.set(key, current + pantryItem.quantity);
  }

  const missingItems: Array<{
    userId: number;
    ingredientId: number;
    unitId: number;
    amount: number | null;
    isBought: boolean;
  }> = [];

  for (const required of requiredByKey.values()) {
    const key = `${required.ingredientId}:${required.unitId}`;
    const pantryAmount = pantryByKey.get(key) ?? 0;

    if (required.amount === null) {
      if (pantryAmount <= 0) {
        missingItems.push({
          userId: user.id,
          ingredientId: required.ingredientId,
          unitId: required.unitId,
          amount: null,
          isBought: false,
        });
      }
      continue;
    }

    const missingAmount = roundAmount(required.amount - pantryAmount);

    if (missingAmount > 0) {
      missingItems.push({
        userId: user.id,
        ingredientId: required.ingredientId,
        unitId: required.unitId,
        amount: missingAmount,
        isBought: false,
      });
    }
  }

  let addedCount = 0;
  let updatedCount = 0;
  let deduplicatedCount = 0;

  await prisma.$transaction(async (tx) => {
    const existingOpenItems = await tx.shoppingItem.findMany({
      where: {
        userId: user.id,
        isBought: false,
      },
      select: {
        id: true,
        ingredientId: true,
        unitId: true,
        amount: true,
      },
    });

    const existingByKey = new Map<
      string,
      Array<{id: number; amount: number | null}>
    >();

    for (const item of existingOpenItems) {
      const key = `${item.ingredientId}:${item.unitId}`;
      const current = existingByKey.get(key) ?? [];
      current.push({id: item.id, amount: item.amount});
      existingByKey.set(key, current);
    }

    const itemsToCreate = missingItems.filter((missingItem) => {
      const key = `${missingItem.ingredientId}:${missingItem.unitId}`;
      return !existingByKey.has(key);
    });

    if (itemsToCreate.length > 0) {
      await tx.shoppingItem.createMany({
        data: itemsToCreate,
      });
      addedCount = itemsToCreate.length;
    }

    for (const missingItem of missingItems) {
      const key = `${missingItem.ingredientId}:${missingItem.unitId}`;
      const matches = existingByKey.get(key);

      if (!matches || matches.length === 0) {
        continue;
      }

      const [primary, ...duplicates] = matches;

      if (!areAmountsEqual(primary.amount, missingItem.amount)) {
        await tx.shoppingItem.update({
          where: {
            id: primary.id,
          },
          data: {
            amount: missingItem.amount,
          },
        });
        updatedCount += 1;
      }

      if (duplicates.length > 0) {
        await tx.shoppingItem.deleteMany({
          where: {
            id: {
              in: duplicates.map((duplicate) => duplicate.id),
            },
          },
        });
        deduplicatedCount += duplicates.length;
      }
    }
  });

  revalidatePath("/shopping-list");

  return {
    success: true,
    message:
      addedCount === 0 && updatedCount === 0 && deduplicatedCount === 0
        ? "Keine neuen fehlenden Zutaten gefunden."
        : `${addedCount} ergänzt, ${updatedCount} aktualisiert${
            deduplicatedCount > 0
              ? `, ${deduplicatedCount} doppelte bereinigt`
              : ""
          }.`,
  };
}

export async function toggleShoppingItemBought(
  _prevState: ShoppingListFormState,
  formData: FormData,
): Promise<ShoppingListFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um deine Einkaufsliste zu bearbeiten.",
    };
  }

  const parsed = toggleSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
    isBought: formData.get("isBought")?.toString() ?? "",
  });

  if (!parsed.success) {
    const errors: NonNullable<ShoppingListFormState["errors"]> = {};

    for (const issue of parsed.error.issues) {
      const path = issue.path[0];

      if (typeof path !== "string") {
        continue;
      }

      const key = path as keyof NonNullable<ShoppingListFormState["errors"]>;
      errors[key] ??= [];
      errors[key]!.push(issue.message);
    }

    return {
      success: false,
      message: "Bitte prüfe deine Eingaben.",
      errors,
    };
  }

  const updated = await prisma.shoppingItem.updateMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      isBought: parsed.data.isBought === "true",
    },
  });

  if (updated.count === 0) {
    return {
      success: false,
      message: "Eintrag nicht gefunden oder keine Berechtigung.",
    };
  }

  revalidatePath("/shopping-list");

  return {
    success: true,
    message:
      parsed.data.isBought === "true"
        ? "Als gekauft markiert."
        : "Wieder auf offen gesetzt.",
  };
}
