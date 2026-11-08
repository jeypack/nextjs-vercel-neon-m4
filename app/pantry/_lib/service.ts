import {isPackageUnit, isPantryUnit} from "@/app/_lib/units";
import {
  CATEGORY_CATALOG,
  determineIngredientCategory,
} from "@/app/pantry/_lib/category";
import {prisma} from "@/lib/prisma";
import type {
  CreatePantryItemServiceInput,
  DeletePantryItemServiceInput,
  PantryFormState,
  UpdatePantryItemServiceInput,
} from "@/app/pantry/_lib/types";

function normalizeIngredientName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeUnit(value: string | undefined) {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

function validationError(
  errors: PantryFormState["errors"],
  message = "Bitte prüfe deine Eingaben.",
): PantryFormState {
  return {
    success: false,
    errors,
    message,
  };
}

export async function createPantryItemWithIngredient(
  input: CreatePantryItemServiceInput,
): Promise<PantryFormState> {
  const normalizedUnit = normalizeUnit(input.unit);
  const normalizedPackageUnit = normalizeUnit(input.packageUnit);
  const normalizedIngredientName = normalizeIngredientName(input.ingredient);

  if (
    input.quantity !== null &&
    (!Number.isFinite(input.quantity) || input.quantity <= 0)
  ) {
    return validationError({
      quantity: ["Die Menge muss größer als 0 sein."],
    });
  }

  if (input.expiresAt && Number.isNaN(input.expiresAt.getTime())) {
    return validationError({
      expiresAt: ["Bitte gib ein gültiges Ablaufdatum ein."],
    });
  }

  if (!normalizedUnit) {
    return validationError({
      unit: ["Bitte wähle eine Einheit aus."],
    });
  }

  if (!isPantryUnit(normalizedUnit)) {
    return validationError({
      unit: ["Bitte wähle eine gültige Einheit aus der Liste."],
    });
  }

  if (
    input.packageSize !== null &&
    (!Number.isFinite(input.packageSize) || input.packageSize <= 0)
  ) {
    return validationError({
      packageSize: ["Die Packungsgröße muss größer als 0 sein."],
    });
  }

  if (normalizedPackageUnit && !isPackageUnit(normalizedPackageUnit)) {
    return validationError({
      packageUnit: ["Bitte wähle eine gültige Einheit für die Packungsgröße."],
    });
  }

  const hasPackageSize = input.packageSize !== null;
  const hasPackageUnit = normalizedPackageUnit !== null;

  if (hasPackageSize !== hasPackageUnit) {
    return validationError({
      packageSize: hasPackageSize
        ? undefined
        : ["Bitte gib eine Packungsgröße ein."],
      packageUnit: hasPackageUnit
        ? undefined
        : ["Bitte wähle eine Einheit zur Packungsgröße."],
    });
  }

  if (
    normalizedUnit &&
    ["Dose", "Packung"].includes(normalizedUnit) &&
    (!hasPackageSize || !hasPackageUnit)
  ) {
    return validationError({
      packageSize: [
        "Für Dose oder Packung ist die Packungsgröße erforderlich.",
      ],
      packageUnit: [
        "Für Dose oder Packung ist die Packungseinheit erforderlich.",
      ],
    });
  }

  if (!normalizedIngredientName) {
    return validationError({
      ingredient: ["Bitte gib eine gültige Zutat ein."],
    });
  }

  await prisma.$transaction(async (tx) => {
    const existingIngredient = await tx.ingredient.findFirst({
      where: {
        name: {
          equals: normalizedIngredientName,
          mode: "insensitive",
        },
      },
    });

    let ingredientId = existingIngredient?.id;

    if (!ingredientId) {
      const categoryKey = determineIngredientCategory(normalizedIngredientName);
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
      });

      const category =
        existingCategory ??
        (await tx.ingredientCategory.upsert({
          where: {slug: categoryMeta.primary.slug},
          update: {},
          create: {
            name: categoryMeta.primary.name,
            slug: categoryMeta.primary.slug,
          },
        }));

      const ingredientRecord = await tx.ingredient.create({
        data: {
          name: normalizedIngredientName,
          categoryId: category.id,
        },
      });

      ingredientId = ingredientRecord.id;
    }

    if (!ingredientId) {
      throw new Error("Ingredient konnte nicht erstellt oder gefunden werden.");
    }

    const unitRecord = await tx.unit.findFirst({
      where: {
        OR: [{symbol: normalizedUnit}, {name: normalizedUnit}],
      },
      select: {id: true},
    });

    if (!unitRecord) {
      throw new Error("Einheit konnte nicht gefunden werden.");
    }

    let packageUnitId: number | null = null;

    if (normalizedPackageUnit) {
      const packageUnitRecord = await tx.unit.findUnique({
        where: {symbol: normalizedPackageUnit},
        select: {id: true},
      });

      if (!packageUnitRecord) {
        throw new Error("Packungseinheit konnte nicht gefunden werden.");
      }

      packageUnitId = packageUnitRecord.id;
    }

    await tx.pantryItem.create({
      data: {
        userId: input.userId,
        ingredientId,
        quantity: input.quantity,
        unitId: unitRecord.id,
        packageSize: input.packageSize,
        packageUnitId,
        expiresAt: input.expiresAt,
        notes: input.notes && input.notes.trim() ? input.notes.trim() : null,
      },
    });
  });

  return {
    success: true,
    message: "Dein Vorratseintrag wurde gespeichert.",
  };
}

export async function updatePantryItemByOwner(
  input: UpdatePantryItemServiceInput,
): Promise<PantryFormState> {
  const normalizedUnit = normalizeUnit(input.unit);
  const normalizedPackageUnit = normalizeUnit(input.packageUnit);

  if (
    input.quantity !== null &&
    (!Number.isFinite(input.quantity) || input.quantity <= 0)
  ) {
    return validationError({
      quantity: ["Die Menge muss größer als 0 sein."],
    });
  }

  if (input.expiresAt && Number.isNaN(input.expiresAt.getTime())) {
    return validationError({
      expiresAt: ["Bitte gib ein gültiges Ablaufdatum ein."],
    });
  }

  if (!normalizedUnit) {
    return validationError({
      unit: ["Bitte wähle eine Einheit aus."],
    });
  }

  if (!isPantryUnit(normalizedUnit)) {
    return validationError({
      unit: ["Bitte wähle eine gültige Einheit aus der Liste."],
    });
  }

  if (
    input.packageSize !== null &&
    (!Number.isFinite(input.packageSize) || input.packageSize <= 0)
  ) {
    return validationError({
      packageSize: ["Die Packungsgröße muss größer als 0 sein."],
    });
  }

  if (normalizedPackageUnit && !isPackageUnit(normalizedPackageUnit)) {
    return validationError({
      packageUnit: ["Bitte wähle eine gültige Einheit für die Packungsgröße."],
    });
  }

  const hasPackageSize = input.packageSize !== null;
  const hasPackageUnit = normalizedPackageUnit !== null;

  if (hasPackageSize !== hasPackageUnit) {
    return validationError({
      packageSize: hasPackageSize
        ? undefined
        : ["Bitte gib eine Packungsgröße ein."],
      packageUnit: hasPackageUnit
        ? undefined
        : ["Bitte wähle eine Einheit zur Packungsgröße."],
    });
  }

  if (
    normalizedUnit &&
    ["Dose", "Packung"].includes(normalizedUnit) &&
    (!hasPackageSize || !hasPackageUnit)
  ) {
    return validationError({
      packageSize: [
        "Für Dose oder Packung ist die Packungsgröße erforderlich.",
      ],
      packageUnit: [
        "Für Dose oder Packung ist die Packungseinheit erforderlich.",
      ],
    });
  }

  const unitRecord = await prisma.unit.findFirst({
    where: {
      OR: [{symbol: normalizedUnit}, {name: normalizedUnit}],
    },
    select: {id: true},
  });

  if (!unitRecord) {
    return validationError({
      unit: ["Bitte wähle eine gültige Einheit aus der Liste."],
    });
  }

  let packageUnitId: number | null = null;

  if (normalizedPackageUnit) {
    const packageUnitRecord = await prisma.unit.findUnique({
      where: {symbol: normalizedPackageUnit},
      select: {id: true},
    });

    if (!packageUnitRecord) {
      return validationError({
        packageUnit: [
          "Bitte wähle eine gültige Einheit für die Packungsgröße.",
        ],
      });
    }

    packageUnitId = packageUnitRecord.id;
  }

  const updated = await prisma.pantryItem.updateMany({
    where: {
      id: input.id,
      userId: input.userId,
    },
    data: {
      quantity: input.quantity,
      unitId: unitRecord.id,
      packageSize: input.packageSize,
      packageUnitId,
      expiresAt: input.expiresAt,
      notes: input.notes && input.notes.trim() ? input.notes.trim() : null,
    },
  });

  if (updated.count === 0) {
    return {
      success: false,
      message: "Eintrag nicht gefunden oder keine Berechtigung.",
    };
  }

  return {
    success: true,
    message: "Vorratseintrag wurde aktualisiert.",
  };
}

export async function deletePantryItemByOwner(
  input: DeletePantryItemServiceInput,
): Promise<PantryFormState> {
  const deleted = await prisma.pantryItem.deleteMany({
    where: {
      id: input.id,
      userId: input.userId,
    },
  });

  if (deleted.count === 0) {
    return {
      success: false,
      message: "Eintrag nicht gefunden oder keine Berechtigung.",
    };
  }

  return {
    success: true,
    message: "Vorratseintrag wurde gelöscht.",
  };
}
