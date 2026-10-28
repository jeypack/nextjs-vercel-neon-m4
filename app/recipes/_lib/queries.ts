import type {Prisma} from "@/lib/generated/prisma/client";
import {prisma} from "@/lib/prisma";
import type {
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
