/**
 * @module pages/EventsListPage
 * @description Страница со списком событий с фильтрацией, поиском и skeleton loader.
 */
import { useEffect, useMemo, useState } from "react";
import { useEventStore } from "@/store/eventStore";
import { EventCard } from "@/components/shared/EventCard";
import { EventGridSkeleton } from "@/components/shared/EventCardSkeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { EventCategory } from "@/types/event";

const categoryOptions: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "Все категории" },
  { value: "conference", label: "Конференции" },
  { value: "meetup", label: "Митапы" },
  { value: "workshop", label: "Воркшопы" },
  { value: "webinar", label: "Вебинары" },
  { value: "social", label: "Нетворкинг" },
  { value: "other", label: "Другое" },
];

export default function EventsListPage() {
  const { events, loadMockData } = useEventStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMockData();
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [loadMockData]);

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

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">События</h1>
        <p className="text-muted-foreground mt-1">
          Найдите интересные мероприятия и присоединяйтесь
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию..."
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
          <p className="text-lg">Событий не найдено</p>
          <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
