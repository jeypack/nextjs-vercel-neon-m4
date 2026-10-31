import {
  CATEGORY_CATALOG,
  determineIngredientCategory,
} from "@/app/pantry/_lib/category";
import {prisma} from "@/lib/prisma";
import type {
  CreateRecipeServiceInput,
  DeleteRecipeServiceInput,
  RecipeCreateFormState,
  UpdateRecipeServiceInput,
} from "@/app/recipes/_lib/types";

function validationError(
  errors: RecipeCreateFormState["errors"],
  message = "Bitte prüfe deine Eingaben.",
): RecipeCreateFormState {
  return {
    success: false,
    errors,
    message,
  };
}

export async function createRecipeWithIngredients(
  input: CreateRecipeServiceInput,
): Promise<RecipeCreateFormState> {
  const categoryExists = await prisma.recipeCategory.findUnique({
    where: {id: input.categoryId},
    select: {id: true},
  });

  if (!categoryExists) {
    return validationError({
      categoryId: ["Bitte wähle eine gültige Rezeptkategorie."],
    });
  }

  const createdRecipeId = await prisma.$transaction(async (tx) => {
    const ingredientIdsByName = new Map<string, number>();
    const unitIdsByKey = new Map<string, number>();
    const units = await tx.unit.findMany({
      select: {
        id: true,
        symbol: true,
      },
    });

    for (const unit of units) {
      unitIdsByKey.set(unit.symbol.toLocaleLowerCase("de-DE"), unit.id);
    }

    for (const ingredientInput of input.ingredients) {
      const normalizedName = ingredientInput.name.trim().replace(/\s+/g, " ");
      const key = normalizedName.toLocaleLowerCase("de-DE");

      if (ingredientIdsByName.has(key)) {
        continue;
      }

      const existingIngredient = await tx.ingredient.findFirst({
        where: {
          name: {
            equals: normalizedName,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

      if (existingIngredient) {
        ingredientIdsByName.set(key, existingIngredient.id);
        continue;
      }

      const categoryKey = determineIngredientCategory(normalizedName);
      const categoryMeta = CATEGORY_CATALOG[categoryKey];
      const categorySlugs = [
        categoryMeta.primary.slug,
        ...categoryMeta.aliases.map((alias) => alias.slug),
      ];
      const categoryNames = [
        categoryMeta.primary.name,
        ...categoryMeta.aliases.map((alias) => alias.name),
      ];

      const existingCategory = await tx.ingredientCategory.findFirst({
        where: {
          OR: [{slug: {in: categorySlugs}}, {name: {in: categoryNames}}],
        },
        select: {
          id: true,
        },
      });

      const categoryId =
        existingCategory?.id ??
        (
          await tx.ingredientCategory.upsert({
            where: {slug: categoryMeta.primary.slug},
            update: {},
            create: {
              name: categoryMeta.primary.name,
              slug: categoryMeta.primary.slug,
            },
            select: {
              id: true,
            },
          })
        ).id;

      const createdIngredient = await tx.ingredient.create({
        data: {
          name: normalizedName,
          categoryId,
        },
        select: {
          id: true,
        },
      });

      ingredientIdsByName.set(key, createdIngredient.id);
    }

    const recipe = await tx.recipe.create({
      data: {
        userId: input.userId,
        categoryId: input.categoryId,
        title: input.title,
        description: input.description,
        instructions: input.instructions,
        prepTime: input.prepTime,
        servings: input.servings,
        difficulty: input.difficulty,
        isPublic: input.isPublic,
        ingredients: {
          create: input.ingredients.map((ingredientInput) => {
            const key = ingredientInput.name
              .trim()
              .replace(/\s+/g, " ")
              .toLocaleLowerCase("de-DE");
            const ingredientId = ingredientIdsByName.get(key);
            const unitId = unitIdsByKey.get(
              ingredientInput.unit.toLocaleLowerCase("de-DE"),
            );

            if (!ingredientId) {
              throw new Error("Ingredient konnte nicht erstellt werden.");
            }

            if (!unitId) {
              throw new Error("Einheit konnte nicht zugeordnet werden.");
            }

            return {
              ingredientId,
              amount: ingredientInput.amount,
              unitId,
              notes: ingredientInput.notes,
            };
          }),
        },
      },
      select: {
        id: true,
      },
    });

    return recipe.id;
  });

  return {
    success: true,
    message: "Rezept wurde erfolgreich erstellt.",
    recipeId: createdRecipeId,
  };
}

async function getOrCreateIngredientIdByName(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  ingredientName: string,
): Promise<number> {
  const normalizedName = ingredientName.trim().replace(/\s+/g, " ");

  const existingIngredient = await tx.ingredient.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  if (existingIngredient) {
    return existingIngredient.id;
  }

  const categoryKey = determineIngredientCategory(normalizedName);
  const categoryMeta = CATEGORY_CATALOG[categoryKey];
  const categorySlugs = [
    categoryMeta.primary.slug,
    ...categoryMeta.aliases.map((alias) => alias.slug),
  ];
  const categoryNames = [
    categoryMeta.primary.name,
    ...categoryMeta.aliases.map((alias) => alias.name),
  ];

  const existingCategory = await tx.ingredientCategory.findFirst({
    where: {
      OR: [{slug: {in: categorySlugs}}, {name: {in: categoryNames}}],
    },
    select: {
      id: true,
    },
  });

  const categoryId =
    existingCategory?.id ??
    (
      await tx.ingredientCategory.upsert({
        where: {slug: categoryMeta.primary.slug},
        update: {},
        create: {
          name: categoryMeta.primary.name,
          slug: categoryMeta.primary.slug,
        },
        select: {
          id: true,
        },
      })
    ).id;

  const createdIngredient = await tx.ingredient.create({
    data: {
      name: normalizedName,
      categoryId,
    },
    select: {
      id: true,
    },
  });

  return createdIngredient.id;
}

export async function updateRecipeWithIngredients(
  input: UpdateRecipeServiceInput,
): Promise<RecipeCreateFormState> {
  const recipe = await prisma.recipe.findUnique({
    where: {id: input.recipeId},
    select: {
      id: true,
      userId: true,
    },
  });

  if (!recipe) {
    return {
      success: false,
      message: "Das Rezept wurde nicht gefunden.",
    };
  }

  const isOwner = recipe.userId === input.actorId;

  if (!input.isAdmin && !isOwner) {
    return {
      success: false,
      message: "Du darfst dieses Rezept nicht bearbeiten.",
    };
  }

  const categoryExists = await prisma.recipeCategory.findUnique({
    where: {id: input.categoryId},
    select: {id: true},
  });

  if (!categoryExists) {
    return validationError({
      categoryId: ["Bitte wähle eine gültige Rezeptkategorie."],
    });
  }

  await prisma.$transaction(async (tx) => {
    const ingredientIdsByName = new Map<string, number>();
    const unitIdsByKey = new Map<string, number>();
    const units = await tx.unit.findMany({
      select: {
        id: true,
        symbol: true,
      },
    });

    for (const unit of units) {
      unitIdsByKey.set(unit.symbol.toLocaleLowerCase("de-DE"), unit.id);
    }

    for (const ingredientInput of input.ingredients) {
      const normalizedName = ingredientInput.name.trim().replace(/\s+/g, " ");
      const key = normalizedName.toLocaleLowerCase("de-DE");

      if (ingredientIdsByName.has(key)) {
        continue;
      }

      const ingredientId = await getOrCreateIngredientIdByName(
        tx,
        normalizedName,
      );
      ingredientIdsByName.set(key, ingredientId);
    }

    await tx.recipeIngredient.deleteMany({
      where: {
        recipeId: input.recipeId,
      },
    });

    await tx.recipe.update({
      where: {
        id: input.recipeId,
      },
      data: {
        categoryId: input.categoryId,
        title: input.title,
        description: input.description,
        instructions: input.instructions,
        prepTime: input.prepTime,
        servings: input.servings,
        difficulty: input.difficulty,
        isPublic: input.isPublic,
        ingredients: {
          create: input.ingredients.map((ingredientInput) => {
            const key = ingredientInput.name
              .trim()
              .replace(/\s+/g, " ")
              .toLocaleLowerCase("de-DE");
            const ingredientId = ingredientIdsByName.get(key);
            const unitId = unitIdsByKey.get(
              ingredientInput.unit.toLocaleLowerCase("de-DE"),
            );

            if (!ingredientId) {
              throw new Error("Ingredient konnte nicht erstellt werden.");
            }

            if (!unitId) {
              throw new Error("Einheit konnte nicht zugeordnet werden.");
            }

            return {
              ingredientId,
              amount: ingredientInput.amount,
              unitId,
              notes: ingredientInput.notes,
            };
          }),
        },
      },
    });
  });

  return {
    success: true,
    message: "Rezept wurde erfolgreich aktualisiert.",
    recipeId: input.recipeId,
  };
}

export async function deleteRecipeByOwnerOrAdmin(
  input: DeleteRecipeServiceInput,
): Promise<RecipeCreateFormState> {
  const recipe = await prisma.recipe.findUnique({
    where: {id: input.recipeId},
    select: {
      id: true,
      userId: true,
    },
  });

  if (!recipe) {
    return {
      success: false,
      message: "Das Rezept wurde nicht gefunden.",
    };
  }

  const isOwner = recipe.userId === input.actorId;

  if (!input.isAdmin && !isOwner) {
    return {
      success: false,
      message: "Du darfst dieses Rezept nicht löschen.",
    };
  }

  await prisma.recipe.delete({
    where: {
      id: input.recipeId,
    },
  });

  return {
    success: true,
    message: "Rezept wurde gelöscht.",
    redirectTo: "/recipes",
  };
}
