/**
 * @module types/event
 * @description Типы и интерфейсы для модуля событий.
 * Следует принципу ISP (Interface Segregation Principle) — 
 * интерфейсы разделены по ответственности.
 */

/** Базовая информация о событии */
export interface IEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  organizerId: string;
  maxParticipants: number;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

/** Категории событий */
export type EventCategory =
  | "conference"
  | "meetup"
  | "workshop"
  | "webinar"
  | "social"
  | "other";

/** DTO для создания события */
export interface CreateEventDTO {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  maxParticipants: number;
}

/** DTO для обновления события */
export interface UpdateEventDTO extends Partial<CreateEventDTO> {}

/** Фильтры для списка событий */
export interface EventFilters {
  category?: EventCategory;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
