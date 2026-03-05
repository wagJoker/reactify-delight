/**
 * @module store/eventStore
 * @description Zustand store для управления событиями.
 * Следует OCP — легко расширяется новыми действиями без модификации существующих.
 */
import { create } from "zustand";
import type { IEvent, EventFilters } from "@/types/event";
import { generateMockEvents } from "@/lib/mockData";

interface EventState {
  events: IEvent[];
  filters: EventFilters;
  isLoading: boolean;
  setEvents: (events: IEvent[]) => void;
  addEvent: (event: IEvent) => void;
  updateEvent: (id: string, data: Partial<IEvent>) => void;
  deleteEvent: (id: string) => void;
  joinEvent: (eventId: string, userId: string) => void;
  leaveEvent: (eventId: string, userId: string) => void;
  setFilters: (filters: EventFilters) => void;
  setLoading: (loading: boolean) => void;
  loadMockData: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  filters: {},
  isLoading: false,
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({ events: [event, ...state.events] })),
  updateEvent: (id, data) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  joinEvent: (eventId, userId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId && !e.participants.includes(userId)
          ? { ...e, participants: [...e.participants, userId] }
          : e
      ),
    })),
  leaveEvent: (eventId, userId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId
          ? { ...e, participants: e.participants.filter((p) => p !== userId) }
          : e
      ),
    })),
  setFilters: (filters) => set({ filters }),
  setLoading: (isLoading) => set({ isLoading }),
  loadMockData: () => {
    if (get().events.length === 0) {
      set({ events: generateMockEvents() });
    }
  },
}));
