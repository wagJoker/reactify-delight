/**
 * @module test/eventStore.test
 * @description Unit-тесты для eventStore
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useEventStore } from "@/store/eventStore";

describe("eventStore", () => {
  beforeEach(() => {
    useEventStore.setState({ events: [], filters: {}, isLoading: false });
  });

  it("addEvent добавляет событие", () => {
    const event = {
      id: "evt-1",
      title: "Test",
      description: "Desc",
      date: "2026-01-01",
      time: "10:00",
      location: "Moscow",
      category: "meetup" as const,
      organizerId: "user-1",
      maxParticipants: 50,
      participants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useEventStore.getState().addEvent(event);
    expect(useEventStore.getState().events).toHaveLength(1);
    expect(useEventStore.getState().events[0].title).toBe("Test");
  });

  it("deleteEvent удаляет событие", () => {
    const event = {
      id: "evt-1",
      title: "Test",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "meetup" as const,
      organizerId: "user-1",
      maxParticipants: 50,
      participants: [],
      createdAt: "",
      updatedAt: "",
    };

    useEventStore.getState().addEvent(event);
    useEventStore.getState().deleteEvent("evt-1");
    expect(useEventStore.getState().events).toHaveLength(0);
  });

  it("joinEvent добавляет участника", () => {
    const event = {
      id: "evt-1",
      title: "Test",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "meetup" as const,
      organizerId: "user-1",
      maxParticipants: 50,
      participants: [],
      createdAt: "",
      updatedAt: "",
    };

    useEventStore.getState().addEvent(event);
    useEventStore.getState().joinEvent("evt-1", "user-2");
    expect(useEventStore.getState().events[0].participants).toContain("user-2");
  });

  it("leaveEvent удаляет участника", () => {
    const event = {
      id: "evt-1",
      title: "Test",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "meetup" as const,
      organizerId: "user-1",
      maxParticipants: 50,
      participants: ["user-2"],
      createdAt: "",
      updatedAt: "",
    };

    useEventStore.getState().addEvent(event);
    useEventStore.getState().leaveEvent("evt-1", "user-2");
    expect(useEventStore.getState().events[0].participants).not.toContain("user-2");
  });

  it("loadMockData загружает моковые данные", () => {
    useEventStore.getState().loadMockData();
    expect(useEventStore.getState().events.length).toBeGreaterThan(0);
  });
});
