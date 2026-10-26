export type PantryListItem = {
  id: number;
  ingredientName: string;
  quantity: number | null;
  unit: string | null;
  expiresAt: Date | null;
  notes: string | null;
  createdAt: Date;
};