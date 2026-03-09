/**
 * @module test/EventCard.test
 * @description Unit tests for EventCard component with Supabase types.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EventCard } from "@/components/shared/EventCard";
import type { DbEvent } from "@/hooks/useEvents";

const mockEvent: DbEvent = {
  id: "evt-1",
  title: "React Conf 2026",
  description: "Конференція про React",
  date: "2026-06-15",
  time: "10:00",
  location: "Київ, UNIT.City",
  category: "conference",
  organizer_id: "user-1",
  max_participants: 100,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  registrations: [{ user_id: "user-2" }, { user_id: "user-3" }],
};

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );

// Mock auth store
vi.mock("@/store/authStore", () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
  }),
}));

describe("EventCard", () => {
  it("renders event title", () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    expect(screen.getByText("React Conf 2026")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    expect(screen.getByText("Конференція про React")).toBeInTheDocument();
  });

  it("renders participant count", () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    expect(screen.getByText(/2\/100 учасників/)).toBeInTheDocument();
  });

  it("renders category badge", () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    expect(screen.getByText("Конференція")).toBeInTheDocument();
  });

  it("is a link to event details", () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/events/evt-1");
  });
});
