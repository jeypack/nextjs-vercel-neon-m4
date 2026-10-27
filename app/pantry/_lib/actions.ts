"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {isPackageUnit, isPantryUnit} from "@/app/_lib/units";

import {getCurrentUser} from "@/lib/auth/session";
import {prisma} from "@/lib/prisma";
import type {PantryFormState} from "@/app/pantry/_lib/types";

const pantryItemSchema = z.object({
  ingredient: z
    .string()
    .trim()
    .min(2, "Zutat muss mindestens 2 Zeichen lang sein."),
  quantity: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : Number(value),
    ),
  unit: z.string().optional(),
  packageSize: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : Number(value),
    ),
  packageUnit: z.string().optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : new Date(value),
    ),
  notes: z.string().optional(),
});

function normalizeIngredientName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeUnit(value: string | undefined) {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

type IngredientCategoryKey =
  | "vegetables"
  | "fruit"
  | "herbs"
  | "grains"
  | "legumes"
  | "dairy"
  | "meat"
  | "fish"
  | "oils"
  | "spices"
  | "canned-goods"
  | "baking"
  | "broths";

const CATEGORY_CATALOG: Record<
  IngredientCategoryKey,
  {
    primary: {name: string; slug: string};
    aliases: {name: string; slug: string}[];
  }
> = {
  vegetables: {
    primary: {name: "Gemüse", slug: "gemuese"},
    aliases: [{name: "Vegetables", slug: "vegetables"}],
  },
  fruit: {
    primary: {name: "Obst", slug: "obst"},
    aliases: [{name: "Fruit", slug: "fruit"}],
  },
  herbs: {
    primary: {name: "Kräuter", slug: "kraeuter"},
    aliases: [{name: "Herbs", slug: "herbs"}],
  },
  grains: {
    primary: {name: "Getreide", slug: "getreide"},
    aliases: [{name: "Grains", slug: "grains"}],
  },
  legumes: {
    primary: {name: "Hülsenfrüchte", slug: "huelsenfruechte"},
    aliases: [{name: "Legumes", slug: "legumes"}],
  },
  dairy: {
    primary: {name: "Milchprodukte", slug: "milchprodukte"},
    aliases: [{name: "Dairy", slug: "dairy"}],
  },
  meat: {
    primary: {name: "Fleisch", slug: "fleisch"},
    aliases: [{name: "Meat", slug: "meat"}],
  },
  fish: {
    primary: {name: "Fisch", slug: "fisch"},
    aliases: [{name: "Fish", slug: "fish"}],
  },
  oils: {
    primary: {name: "Öle", slug: "oele"},
    aliases: [{name: "Oils", slug: "oils"}],
  },
  spices: {
    primary: {name: "Gewürze", slug: "gewuerze"},
    aliases: [{name: "Spices", slug: "spices"}],
  },
  "canned-goods": {
    primary: {name: "Konserven", slug: "konserven"},
    aliases: [{name: "Canned goods", slug: "canned-goods"}],
  },
  baking: {
    primary: {name: "Backen", slug: "backen"},
    aliases: [{name: "Baking", slug: "baking"}],
  },
  broths: {
    primary: {name: "Brühen", slug: "bruehen"},
    aliases: [{name: "Broths", slug: "broths"}],
  },
};

const CATEGORY_MATCHERS: Array<{
  key: IngredientCategoryKey;
  keywords: string[];
}> = [
  {
    key: "fruit",
    keywords: ["apfel", "birne", "banane", "zitrone", "limette", "orange"],
  },
  {
    key: "herbs",
    keywords: [
      "basil",
      "peters",
      "koriander",
      "schnittlauch",
      "thymian",
      "oregano",
    ],
  },
  {
    key: "grains",
    keywords: [
      "reis",
      "nudel",
      "pasta",
      "spaghetti",
      "bulgur",
      "mehl",
      "hafer",
    ],
  },
  {key: "legumes", keywords: ["linse", "bohne", "kicher", "erbse"]},
  {
    key: "dairy",
    keywords: [
      "milch",
      "käse",
      "kaese",
      "joghurt",
      "quark",
      "sahne",
      "butter",
      "ei",
    ],
  },
  {
    key: "meat",
    keywords: ["hähn", "haehn", "rind", "schwein", "speck", "hack", "wurst"],
  },
  {key: "fish", keywords: ["lachs", "thun", "fisch", "garnele"]},
  {key: "oils", keywords: ["öl", "oel"]},
  {
    key: "spices",
    keywords: ["pfeffer", "salz", "curry", "paprika", "kreuzkümmel", "chili"],
  },
  {key: "canned-goods", keywords: ["konserve", "dose", "stückig", "passiert"]},
  {key: "baking", keywords: ["back", "natron", "hefe", "stärke", "staerke"]},
  {key: "broths", keywords: ["brühe", "bruehe", "fond"]},
];

function determineIngredientCategory(name: string): IngredientCategoryKey {
  const normalizedName = name.trim().toLocaleLowerCase("de-DE");

  for (const matcher of CATEGORY_MATCHERS) {
    if (matcher.keywords.some((keyword) => normalizedName.includes(keyword))) {
      return matcher.key;
    }
  }

  return "vegetables";
}

export async function createPantryItem(
  _prevState: PantryFormState,
  formData: FormData,
): Promise<PantryFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um deinen Vorrat zu verwalten.",
    };
  }

  const rawData = {
    ingredient: formData.get("ingredient")?.toString() ?? "",
    quantity: formData.get("quantity")?.toString() ?? "",
    unit: formData.get("unit")?.toString() ?? "",
    packageSize: formData.get("packageSize")?.toString() ?? "",
    packageUnit: formData.get("packageUnit")?.toString() ?? "",
    expiresAt: formData.get("expiresAt")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  };

  const parsed = pantryItemSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors: NonNullable<PantryFormState["errors"]> = {};

    for (const issue of parsed.error.issues) {
      if (issue.path[0] && typeof issue.path[0] === "string") {
        const key = issue.path[0] as keyof NonNullable<
          PantryFormState["errors"]
        >;
        errors[key] ??= [];
        errors[key]!.push(issue.message);
      }
    }

    return {
      success: false,
      errors,
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const {
    ingredient,
    quantity,
    unit,
    packageSize,
    packageUnit,
    expiresAt,
    notes,
  } = parsed.data;
  const normalizedUnit = normalizeUnit(unit);
  const normalizedPackageUnit = normalizeUnit(packageUnit);

  if (quantity !== null && (!Number.isFinite(quantity) || quantity <= 0)) {
    return {
      success: false,
      errors: {
        quantity: ["Die Menge muss größer als 0 sein."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return {
      success: false,
      errors: {
        expiresAt: ["Bitte gib ein gültiges Ablaufdatum ein."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  if (normalizedUnit && !isPantryUnit(normalizedUnit)) {
    return {
      success: false,
      errors: {
        unit: ["Bitte wähle eine gültige Einheit aus der Liste."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  if (
    packageSize !== null &&
    (!Number.isFinite(packageSize) || packageSize <= 0)
  ) {
    return {
      success: false,
      errors: {
        packageSize: ["Die Packungsgröße muss größer als 0 sein."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  if (normalizedPackageUnit && !isPackageUnit(normalizedPackageUnit)) {
    return {
      success: false,
      errors: {
        packageUnit: [
          "Bitte wähle eine gültige Einheit für die Packungsgröße.",
        ],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const hasPackageSize = packageSize !== null;
  const hasPackageUnit = normalizedPackageUnit !== null;

  if (hasPackageSize !== hasPackageUnit) {
    return {
      success: false,
      errors: {
        packageSize: hasPackageSize
          ? undefined
          : ["Bitte gib eine Packungsgröße ein."],
        packageUnit: hasPackageUnit
          ? undefined
          : ["Bitte wähle eine Einheit zur Packungsgröße."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  if (
    normalizedUnit &&
    ["Dose", "Packung"].includes(normalizedUnit) &&
    (!hasPackageSize || !hasPackageUnit)
  ) {
    return {
      success: false,
      errors: {
        packageSize: [
          "Für Dose oder Packung ist die Packungsgröße erforderlich.",
        ],
        packageUnit: [
          "Für Dose oder Packung ist die Packungseinheit erforderlich.",
        ],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const normalizedIngredientName = normalizeIngredientName(ingredient);

  if (!normalizedIngredientName) {
    return {
      success: false,
      errors: {
        ingredient: ["Bitte gib eine gültige Zutat ein."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
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

    await tx.pantryItem.create({
      data: {
        userId: user.id,
        ingredientId,
        quantity,
        unit: normalizedUnit,
        packageSize,
        packageUnit: normalizedPackageUnit,
        expiresAt,
        notes: notes && notes.trim() ? notes.trim() : null,
      },
    });
  });

  revalidatePath("/pantry");

  return {
    success: true,
    message: "Dein Vorratseintrag wurde gespeichert.",
  };
}
