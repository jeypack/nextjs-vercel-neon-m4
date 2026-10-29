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
