import {prisma} from "@/lib/prisma";
import type {PantryListItem} from "@/app/pantry/_lib/types";


export async function getPantryItemsForUser(userId: number): Promise<PantryListItem[]> {
  const pantryItems = await prisma.pantryItem.findMany({
    where: {userId},
    select: {
      id: true,
      quantity: true,
      unit: true,
      expiresAt: true,
      notes: true,
      createdAt: true,
      ingredient: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {createdAt: "desc"},
  });

  return pantryItems
    .map((item) => ({
      id: item.id,
      ingredientName: item.ingredient.name,
      quantity: item.quantity,
      unit: item.unit,
      expiresAt: item.expiresAt,
      notes: item.notes,
      createdAt: item.createdAt,
    }))
    .sort((a, b) => {
      const aDate = a.expiresAt ? new Date(a.expiresAt).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.expiresAt ? new Date(b.expiresAt).getTime() : Number.MAX_SAFE_INTEGER;

      return aDate - bDate;
    });
}
