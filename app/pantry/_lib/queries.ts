import {prisma} from "@/lib/prisma";
import type {PantryListItem} from "@/app/pantry/_lib/types";

export async function getIngredientNames(): Promise<string[]> {
  const ingredients = await prisma.ingredient.findMany({
    select: {name: true},
    orderBy: {name: "asc"},
  });

  return ingredients.map((ingredient) => ingredient.name);
}

export async function getPantryItemsForUser(
  userId: number,
): Promise<PantryListItem[]> {
  const pantryItems = await prisma.pantryItem.findMany({
    where: {userId},
    select: {
      id: true,
      quantity: true,
      unit: {
        select: {
          name: true,
        },
      },
      packageSize: true,
      packageUnit: {
        select: {
          symbol: true,
        },
      },
      expiresAt: true,
      notes: true,
      createdAt: true,
      ingredient: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{expiresAt: {sort: "asc", nulls: "last"}}, {createdAt: "desc"}],
  });

  return pantryItems.map((item) => ({
    id: item.id,
    ingredientName: item.ingredient.name,
    quantity: item.quantity,
    unit: item.unit.name,
    packageSize: item.packageSize,
    packageUnit: item.packageUnit?.symbol ?? null,
    expiresAt: item.expiresAt,
    notes: item.notes,
    createdAt: item.createdAt,
  }));
}
