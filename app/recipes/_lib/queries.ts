import "server-only";
import type {Prisma} from "@/lib/generated/prisma/client";
import {prisma} from "@/lib/prisma";
import type {
  RecipeCreateCategoryOption,
  RecipeEditItem,
  RecipeDetailItem,
  RecipeCategoryOption,
  RecipeFilters,
  RecipeListResult,
  RecipeVisibilityFilter,
} from "@/app/recipes/_lib/types";

function getVisibilityWhere(
  visibility: RecipeVisibilityFilter,
  userId: number | null,
): Prisma.RecipeWhereInput | null {
  if (visibility === "public") {
    return {isPublic: true};
  }

  if (visibility === "private") {
    if (userId === null) {
      return null;
    }

    return {isPublic: false, userId};
  }

  if (userId === null) {
    return {isPublic: true};
  }

  return {
    OR: [{isPublic: true}, {userId}],
  };
}

export async function getPublicRecipesCount(): Promise<number> {
  return prisma.recipe.count({
    where: {
      isPublic: true,
    },
  });
}

export async function getPantryCount(userId: number): Promise<number> {
  return prisma.pantryItem.count({
    where: {
      userId,
    },
  });
}

export async function getShoppingItemCount(userId: number): Promise<number> {
  return prisma.shoppingItem.count({
    where: {
      userId,
    },
  });
}

export async function getMealPlanCount(userId: number): Promise<number> {
  return prisma.mealPlan.count({
    where: {
      userId,
    },
  });
}

export async function getRecipeCategoryOptions(): Promise<
  RecipeCategoryOption[]
> {
  return prisma.recipeCategory.findMany({
    select: {
      slug: true,
      name: true,
    },
    orderBy: [{sortOrder: "asc"}, {name: "asc"}],
  });
}

export async function getRecipesForListing(
  filters: RecipeFilters,
  userId: number | null,
  isAdmin: boolean,
): Promise<RecipeListResult> {
  const visibilityWhere = getVisibilityWhere(filters.visibility, userId);

  if (!visibilityWhere) {
    return {recipes: [], totalCount: 0};
  }

  const andConditions: Prisma.RecipeWhereInput[] = [visibilityWhere];

  if (filters.categorySlug !== "all") {
    andConditions.push({
      category: {slug: filters.categorySlug},
    });
  }

  if (filters.searchQuery) {
    andConditions.push({
      OR: [
        {title: {contains: filters.searchQuery, mode: "insensitive"}},
        {description: {contains: filters.searchQuery, mode: "insensitive"}},
        {
          category: {
            name: {contains: filters.searchQuery, mode: "insensitive"},
          },
        },
        {
          ingredients: {
            some: {
              ingredient: {
                name: {contains: filters.searchQuery, mode: "insensitive"},
              },
            },
          },
        },
      ],
    });
  }

  const where: Prisma.RecipeWhereInput = {
    AND: andConditions,
  };

  const recipes = await prisma.recipe.findMany({
    where,
    select: {
      id: true,
      userId: true,
      title: true,
      description: true,
      prepTime: true,
      servings: true,
      difficulty: true,
      isPublic: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{createdAt: "desc"}, {id: "desc"}],
  });

  return {
    recipes: recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      isPublic: recipe.isPublic,
      categoryName: recipe.category.name,
      canEdit: isAdmin || (userId !== null && recipe.userId === userId),
    })),
    totalCount: recipes.length,
  };
}

export async function getRecipeSearchOptions(
  userId: number | null,
): Promise<{id: number; title: string}[]> {
  return prisma.recipe.findMany({
    where:
      userId === null
        ? {isPublic: true}
        : {
            OR: [{isPublic: true}, {userId}],
          },
    select: {
      id: true,
      title: true,
    },
    orderBy: [{title: "asc"}, {id: "asc"}],
  });
}

export async function getRecipeCreateCategoryOptions(): Promise<
  RecipeCreateCategoryOption[]
> {
  return prisma.recipeCategory.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: [{sortOrder: "asc"}, {name: "asc"}],
  });
}

export async function getIngredientNamesForRecipes(): Promise<string[]> {
  const ingredients = await prisma.ingredient.findMany({
    select: {name: true},
    orderBy: {name: "asc"},
  });

  return ingredients.map((ingredient) => ingredient.name);
}

export async function getUnitNamesForRecipes(): Promise<string[]> {
  const units = await prisma.unit.findMany({
    select: {symbol: true},
    orderBy: [{sortOrder: "asc"}, {name: "asc"}],
  });

  return units.map((unit) => unit.symbol);
}

export async function getRecipeDetailForViewer(
  recipeId: number,
  userId: number | null,
): Promise<RecipeDetailItem | null> {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      ...(userId === null
        ? {isPublic: true}
        : {OR: [{isPublic: true}, {userId}]}),
    },
    select: {
      id: true,
      userId: true,
      title: true,
      description: true,
      instructions: true,
      prepTime: true,
      servings: true,
      difficulty: true,
      isPublic: true,
      category: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      ingredients: {
        select: {
          id: true,
          amount: true,
          unit: {
            select: {
              symbol: true,
            },
          },
          notes: true,
          ingredient: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ingredient: {name: "asc"}}, {id: "asc"}],
      },
    },
  });

  if (!recipe) {
    return null;
  }

  const ownerName = recipe.user
    ? [recipe.user.firstName, recipe.user.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || recipe.user.email
    : null;

  return {
    id: recipe.id,
    userId: recipe.userId,
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    isPublic: recipe.isPublic,
    categoryName: recipe.category.name,
    ownerName,
    ingredients: recipe.ingredients.map((item) => ({
      id: item.id,
      name: item.ingredient.name,
      amount: item.amount,
      unit: item.unit?.symbol ?? null,
      notes: item.notes,
    })),
  };
}

export async function getRecipeForEditor(
  recipeId: number,
  actorId: number,
  isAdmin: boolean,
): Promise<RecipeEditItem | null> {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      ...(isAdmin ? {} : {userId: actorId}),
    },
    select: {
      id: true,
      userId: true,
      categoryId: true,
      title: true,
      description: true,
      instructions: true,
      prepTime: true,
      servings: true,
      difficulty: true,
      isPublic: true,
      ingredients: {
        select: {
          id: true,
          amount: true,
          unit: {
            select: {
              symbol: true,
            },
          },
          notes: true,
          ingredient: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{id: "asc"}],
      },
    },
  });

  if (!recipe) {
    return null;
  }

  return {
    id: recipe.id,
    userId: recipe.userId,
    categoryId: recipe.categoryId,
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    isPublic: recipe.isPublic,
    ingredients: recipe.ingredients.map((item) => ({
      id: item.id,
      name: item.ingredient.name,
      amount: item.amount,
      unit: item.unit?.symbol ?? null,
      notes: item.notes,
    })),
  };
}
