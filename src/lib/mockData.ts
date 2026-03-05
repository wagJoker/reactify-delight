/**
 * @module lib/mockData
 * @description Генерация моковых данных для разработки.
 */
import type { IEvent, EventCategory } from "@/types/event";

const categories: EventCategory[] = [
  "conference", "meetup", "workshop", "webinar", "social", "other",
];

const titles = [
  "React Conf 2026",
  "TypeScript Meetup",
  "DevOps Workshop",
  "AI & ML Webinar",
  "Networking Evening",
  "Code Review Session",
  "Frontend Architecture Talk",
  "Cloud Native Summit",
  "Open Source Hackathon",
  "UX Design Sprint",
];

const locations = [
  "Москва, Технопарк",
  "Санкт-Петербург, Лофт",
  "Онлайн (Zoom)",
  "Казань, IT-Park",
  "Новосибирск, Академгородок",
];

export function generateMockEvents(): IEvent[] {
  return titles.map((title, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i * 3 + 1);

    return {
      id: `evt-${i + 1}`,
      title,
      description: `Описание события "${title}". Присоединяйтесь к нам для обсуждения актуальных тем в сфере IT и технологий. Будут интересные доклады и нетворкинг.`,
      date: date.toISOString().split("T")[0],
      time: `${10 + (i % 8)}:00`,
      location: locations[i % locations.length],
      category: categories[i % categories.length],
      organizerId: "user-1",
      maxParticipants: 20 + i * 10,
      participants: Array.from({ length: i * 2 }, (_, j) => `user-${j + 2}`),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}
