export type Role = "USER" | "ADMIN";

export type UserItem = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
  role: Role;
  image: string | null;
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
