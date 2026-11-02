export type RecipesPageSearchParams = {
  [key: string]: string | string[] | undefined;
};

export type RecipeVisibilityFilter = "all" | "public" | "private";

export type RecipeFilters = {
  searchQuery: string;
  categorySlug: string;
  visibility: RecipeVisibilityFilter;
};

export type RecipeCategoryOption = {
  slug: string;
  name: string;
};

export type RecipeListItem = {
  id: number;
  title: string;
  description: string | null;
  prepTime: number;
  servings: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isPublic: boolean;
  categoryName: string;
};

export type RecipeListResult = {
  recipes: RecipeListItem[];
  totalCount: number;
};

export type RecipeFiltersFormProps = {
  filters: RecipeFilters;
  canViewPrivateRecipes: boolean;
};

export type RecipeCreateCategoryOption = {
  id: number;
  name: string;
};

export type RecipeCreateFormProps = {
  categories: RecipeCreateCategoryOption[];
  ingredientNames: string[];
  unitNames: string[];
};

export type RecipeCreateFormState = {
  success?: boolean;
  message?: string;
  recipeId?: number;
  redirectTo?: string;
  ingredientRowErrors?: {
    name?: string;
    amount?: string;
    unit?: string;
    notes?: string;
  }[];
  errors?: {
    title?: string[];
    description?: string[];
    instructions?: string[];
    categoryId?: string[];
    prepTime?: string[];
    servings?: string[];
    difficulty?: string[];
    ingredients?: string[];
  };
};

export type CreateRecipeIngredientInput = {
  name: string;
  amount: number | null;
  unit: string;
  notes: string | null;
};

export type CreateRecipeServiceInput = {
  userId: number;
  categoryId: number;
  title: string;
  description: string | null;
  instructions: string;
  prepTime: number;
  servings: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isPublic: boolean;
  ingredients: CreateRecipeIngredientInput[];
};

export type UpdateRecipeServiceInput = {
  recipeId: number;
  actorId: number;
  isAdmin: boolean;
  categoryId: number;
  title: string;
  description: string | null;
  instructions: string;
  prepTime: number;
  servings: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isPublic: boolean;
  ingredients: CreateRecipeIngredientInput[];
};

export type DeleteRecipeServiceInput = {
  recipeId: number;
  actorId: number;
  isAdmin: boolean;
};

export type RecipeEditItem = {
  id: number;
  userId: number | null;
  categoryId: number;
  title: string;
  description: string | null;
  instructions: string;
  prepTime: number;
  servings: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isPublic: boolean;
  ingredients: {
    id: number;
    name: string;
    amount: number | null;
    unit: string | null;
    notes: string | null;
  }[];
};

export type RecipeEditFormProps = {
  recipe: RecipeEditItem;
  categories: RecipeCreateCategoryOption[];
  ingredientNames: string[];
  unitNames: string[];
};

export type RecipeDetailItem = {
  id: number;
  userId: number | null;
  title: string;
  description: string | null;
  instructions: string;
  prepTime: number;
  servings: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isPublic: boolean;
  categoryName: string;
  ownerName: string | null;
  ingredients: {
    id: number;
    name: string;
    amount: number | null;
    unit: string | null;
    notes: string | null;
  }[];
};

export type RecipeSearchOption = {
  id: number;
  title: string;
};

export type RecipeSearchComboboxProps = {
  name?: string;
  recipes: RecipeSearchOption[];
  showDetail?: boolean;
};
