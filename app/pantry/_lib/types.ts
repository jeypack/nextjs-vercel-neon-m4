export type PantryListItem = {
  id: number;
  ingredientName: string;
  quantity: number | null;
  unit: string | null;
  expiresAt: Date | null;
  notes: string | null;
  createdAt: Date;
};

export const PANTRY_UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "Stück",
  "EL",
  "TL",
  "Prise",
  "Bund",
  "Dose",
  "Packung",
] as const;

export type PantryUnit = (typeof PANTRY_UNITS)[number];

export type PantryFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    ingredient?: string[];
    quantity?: string[];
    unit?: string[];
    expiresAt?: string[];
    notes?: string[];
  };
};