/**
 * @module lib/mockUsers
 * @description Генерация моковых пользователей для разработки.
 */
import type { IUser } from "@/types/user";

const names = [
  "Алексей Петров",
  "Мария Иванова",
  "Дмитрий Козлов",
  "Елена Смирнова",
  "Андрей Новиков",
  "Ольга Волкова",
  "Сергей Морозов",
  "Анна Лебедева",
];

export function generateMockUsers(): IUser[] {
  return names.map((name, i) => ({
    id: `user-${i + 1}`,
    email: `${name.split(" ")[0].toLowerCase()}@eventhub.ru`,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
  }));
}
