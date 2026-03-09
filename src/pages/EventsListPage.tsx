/**
 * @module pages/EventsListPage
 * @description Events list page with Supabase data, filtering, search and pagination.
 */
import { useMemo, useState, useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "@/components/shared/EventCard";
import { EventGridSkeleton } from "@/components/shared/EventCardSkeleton";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { EventCategory } from "@/types/event";

const categoryOptions: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "Усі категорії" },
  { value: "conference", label: "Конференції" },
  { value: "meetup", label: "Мітапи" },
  { value: "workshop", label: "Воркшопи" },
  { value: "webinar", label: "Вебінари" },
  { value: "social", label: "Нетворкінг" },
  { value: "other", label: "Інше" },
];

export default function EventsListPage() {
  const { data: events = [], isLoading } = useEvents();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || e.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  const { items: paginatedEvents, page, totalPages, goToPage, resetPage } = usePagination(filtered, { pageSize: 6 });

  useEffect(() => { resetPage(); }, [search, category]);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Події</h1>
        <p className="text-muted-foreground mt-1">
          Знайдіть цікаві заходи та приєднуйтесь
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Пошук за назвою..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <EventGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">Подій не знайдено</p>
          <p className="text-sm mt-1">Спробуйте змінити фільтри</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
}
