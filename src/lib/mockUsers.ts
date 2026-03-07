/**
 * @module lib/mockUsers
 * @description Генерация моковых пользователей для разработки.
 */
import type { IUser } from "@/types/user";

const names = [
  "Олександр Шевченко",
  "Марія Коваленко",
  "Дмитро Бондаренко",
  "Оксана Мельник",
  "Андрій Ткаченко",
  "Ольга Кравченко",
  "Сергій Поліщук",
  "Анна Лисенко",
];

export function generateMockUsers(): IUser[] {
  return names.map((name, i) => ({
    id: `user-${i + 1}`,
    email: `${name.split(" ")[0].toLowerCase()}@eventhub.ua`,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
  }));
}
