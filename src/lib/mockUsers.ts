/**
 * @module lib/mockUsers
 * @description Генерація мокових користувачів з подіями та датами.
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

const eventIds = ["evt-1", "evt-2", "evt-3", "evt-4", "evt-5", "evt-6", "evt-7", "evt-8"];

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));
  return d.toISOString();
}

export function generateMockUsers(): IUser[] {
  return names.map((name, i) => ({
    id: `user-${i + 1}`,
    email: `${name.split(" ")[0].toLowerCase()}@eventhub.ua`,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    lastSeen: randomDate(7),
    joinedAt: randomDate(365),
    registeredEvents: randomSubset(eventIds, 1, 5),
  }));
}
