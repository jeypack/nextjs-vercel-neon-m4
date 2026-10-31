export type ShoppingListFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    id?: string[];
    isBought?: string[];
  };
};

export type ShoppingListItem = {
  id: number;
  ingredientName: string;
  amount: number | null;
  unitSymbol: string;
  isBought: boolean;
  createdAt: Date;
};
