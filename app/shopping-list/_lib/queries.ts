import "server-only";
import {prisma} from "@/lib/prisma";
import type {ShoppingListItem} from "@/app/shopping-list/_lib/types";

export async function getShoppingListItemsForUser(
  userId: number,
  hideBought: boolean,
): Promise<ShoppingListItem[]> {
  const items = await prisma.shoppingItem.findMany({
    where: {
      userId,
      ...(hideBought ? {isBought: false} : {}),
    },
    select: {
      id: true,
      amount: true,
      isBought: true,
      createdAt: true,
      ingredient: {
        select: {
          name: true,
        },
      },
      unit: {
        select: {
          symbol: true,
        },
      },
    },
    orderBy: [{isBought: "desc"}, {createdAt: "desc"}, {id: "desc"}],
  });

  return items
    .map((item) => ({
      id: item.id,
      ingredientName: item.ingredient.name,
      amount: item.amount,
      unitSymbol: item.unit.symbol,
      isBought: item.isBought,
      createdAt: item.createdAt,
    }))
    .sort((left, right) => {
      if (left.isBought !== right.isBought) {
        return left.isBought ? -1 : 1;
      }

      return left.ingredientName.localeCompare(right.ingredientName, "de-DE");
    });
}

export async function hasBoughtShoppingItemsForUser(
  userId: number
): Promise<boolean> {
  const count = await prisma.shoppingItem.count({
    where: {
      userId,
      isBought: true,
    },
  });

  return count > 0;
}
