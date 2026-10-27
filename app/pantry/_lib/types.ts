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
    ingredient?: string[];
    quantity?: string[];
    unit?: string[];
    packageSize?: string[];
    packageUnit?: string[];
    expiresAt?: string[];
    notes?: string[];
  };
};