"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type {
  RecipeSuggestion,
  GeminiRecipeSuggestion,
} from "@/app/cook/_lib/types";

type CookSearchData = {
  input: string;
  selectedIngredients: string[];
  recipes: RecipeSuggestion[];
  geminiRecipes: GeminiRecipeSuggestion[];
  hasSearched: boolean;
  geminiEnabled: boolean;
};

type DataContextType = {
  cookSearch: CookSearchData;
  setCookSearch: Dispatch<SetStateAction<CookSearchData>>;
  resetCookSearch: () => void;
};

const initialCookSearch: CookSearchData = {
  input: "",
  selectedIngredients: [],
  recipes: [],
  geminiRecipes: [],
  hasSearched: false,
  geminiEnabled: false,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({children}: {children: ReactNode}) {
  const [cookSearch, setCookSearch] =
    useState<CookSearchData>(initialCookSearch);

  function resetCookSearch() {
    setCookSearch(initialCookSearch);
  }

  return (
    <DataContext.Provider
      value={{
        cookSearch,
        setCookSearch,
        resetCookSearch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error(
      "useData muss innerhalb eines DataProvider verwendet werden.",
    );
  }

  return context;
}
