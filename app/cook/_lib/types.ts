export type RecipeSuggestion = {
  id: number;
  title: string;
  description: string | null;
  instructions: string;
  prepTime: number;
  servings: number;
  category: string;
  ingredients: {
    name: string;
    amount: number | null;
    unit: string | null;
    notes: string | null;
  }[];
  matchedIngredients: string[];
  missingIngredients: string[];
  matchedCount: number;
  missingCount: number;
  totalIngredientCount: number;
  matchRatio: number;
};
