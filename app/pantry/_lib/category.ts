import type {
  IngredientCategoryCatalogItem,
  IngredientCategoryKey,
  IngredientCategoryMatcher,
} from "@/app/pantry/_lib/types";

export const CATEGORY_CATALOG: Record<
  IngredientCategoryKey,
  IngredientCategoryCatalogItem
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

export const CATEGORY_MATCHERS: IngredientCategoryMatcher[] = [
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

export function determineIngredientCategory(name: string): IngredientCategoryKey {
  const normalizedName = name.trim().toLocaleLowerCase("de-DE");

  for (const matcher of CATEGORY_MATCHERS) {
    if (matcher.keywords.some((keyword) => normalizedName.includes(keyword))) {
      return matcher.key;
    }
  }

  return "vegetables";
}
