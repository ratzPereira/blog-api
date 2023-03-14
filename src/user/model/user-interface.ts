export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  CHIEF_EDITOR = 'chiefeditor',
  EDITOR = 'editor',
  USER = 'user',
}
