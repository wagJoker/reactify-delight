/**
 * @module types/user
 * @description Типы для модуля пользователей
 */

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  lastSeen?: string;
  registeredEvents?: string[];
  joinedAt?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}
