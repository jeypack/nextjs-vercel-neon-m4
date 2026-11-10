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

export type GeminiRecipeSuggestion = {
  id: string;
  title: string;
  adopted: boolean;
  description: string;
  instructions: string;
  prepTime: number;
  servings: number;
  ingredients: {
    name: string;
    amount: number | null;
    unit: string;
    notes: string;
  }[];
};
