/**
 * @module test/EventCard.test
 * @description Unit-тесты для компонента EventCard
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { EventCard } from "@/components/shared/EventCard";
import type { IEvent } from "@/types/event";

const mockEvent: IEvent = {
  id: "evt-1",
  title: "React Conf 2026",
  description: "Конференция по React",
  date: "2026-06-15",
  time: "10:00",
  location: "Москва",
  category: "conference",
  organizerId: "user-1",
  maxParticipants: 100,
  participants: ["user-2", "user-3"],
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("EventCard", () => {
  it("отображает название события", () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText("React Conf 2026")).toBeInTheDocument();
  });

  it("отображает описание", () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText("Конференция по React")).toBeInTheDocument();
  });

  it("отображает количество участников", () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText(/2\/100 участников/)).toBeInTheDocument();
  });

  it("отображает категорию", () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText("Конференция")).toBeInTheDocument();
  });

  it("является ссылкой на детали события", () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/events/evt-1");
  });
});
