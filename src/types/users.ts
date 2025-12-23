export type UserRole = 'client' | 'cashier' | 'head-cashier' | 'admin' | 'creator' | 'nikitovsky';

export interface RegisteredUser {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  createdAt: string;
  createdBy: string;
}

export interface User {
  role: UserRole;
  name: string;
  phone?: string;
}
