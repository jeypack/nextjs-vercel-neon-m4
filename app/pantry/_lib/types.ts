export type PantryListItem = {
  id: number;
  ingredientName: string;
  quantity: number | null;
  unit: string | null;
  packageSize: number | null;
  packageUnit: string | null;
  expiresAt: Date | null;
  notes: string | null;
  createdAt: Date;
};

export type PantryFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    id?: string[];
    ingredient?: string[];
    quantity?: string[];
    unit?: string[];
    packageSize?: string[];
    packageUnit?: string[];
    expiresAt?: string[];
    notes?: string[];
  };
};

export type PantryValidationIssue = {
  path: readonly PropertyKey[];
  message: string;
};

export type CreatePantryItemServiceInput = {
  userId: number;
  ingredient: string;
  quantity: number | null;
  unit: string | undefined;
  packageSize: number | null;
  packageUnit: string | undefined;
  expiresAt: Date | null;
  notes: string | undefined;
};

export type UpdatePantryItemServiceInput = {
  userId: number;
  id: number;
  quantity: number | null;
  unit: string | undefined;
  packageSize: number | null;
  packageUnit: string | undefined;
  expiresAt: Date | null;
  notes: string | undefined;
};

export type DeletePantryItemServiceInput = {
  userId: number;
  id: number;
};

export type IngredientCategoryKey =
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

export type IngredientCategoryCatalogItem = {
  primary: {name: string; slug: string};
  aliases: {name: string; slug: string}[];
};

export type IngredientCategoryMatcher = {
  key: IngredientCategoryKey;
  keywords: string[];
};