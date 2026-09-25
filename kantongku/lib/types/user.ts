export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed password
  createdAt: Date;
}

export type UserSafe = Omit<User, 'password'>;

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

export interface AuthState {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
}
