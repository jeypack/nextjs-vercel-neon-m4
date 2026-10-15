export type UserItem = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

export type UserFormState = {
  errors?: {
    id?: string[];
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};
