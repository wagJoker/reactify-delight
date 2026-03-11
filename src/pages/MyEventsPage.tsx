/**
 * @module pages/MyEventsPage
 * @description Personal dashboard — organized & joined events with calendar view.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEvents, type DbEvent } from "@/hooks/useEvents";
import { useAuthStore } from "@/store/authStore";
import { EventCard } from "@/components/shared/EventCard";
import { EventGridSkeleton } from "@/components/shared/EventCardSkeleton";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays, Mail, User as UserIcon, List, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, parseISO } from "date-fns";
import { uk } from "date-fns/locale";

type ViewMode = "list" | "month" | "week";

function CalendarView({ events, viewMode, currentDate, onDateChange }: {
  events: DbEvent[];
  viewMode: "month" | "week";
  currentDate: Date;
  onDateChange: (d: Date) => void;
}) {
  const days = useMemo(() => {
    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: calStart, end: calEnd });
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
  }, [currentDate, viewMode]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DbEvent[]>();
    events.forEach((e) => {
      const key = e.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [events]);

  const goBack = () => onDateChange(viewMode === "month" ? subMonths(currentDate, 1) : subWeeks(currentDate, 1));
  const goForward = () => onDateChange(viewMode === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, 1));

  const weekDayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-display font-semibold capitalize">
          {viewMode === "month"
            ? format(currentDate, "LLLL yyyy", { locale: uk })
            : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: uk })} — ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM yyyy", { locale: uk })}`}
        </h3>
        <Button variant="outline" size="icon" onClick={goForward}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className={`grid grid-cols-7 gap-1 ${viewMode === "week" ? "min-h-[200px]" : ""}`}>
        {weekDayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate.get(dateStr) || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={dateStr}
              className={`border border-border rounded-lg p-1 min-h-[80px] ${viewMode === "week" ? "min-h-[160px]" : ""} ${!isCurrentMonth && viewMode === "month" ? "opacity-40" : ""} ${isToday ? "bg-primary/5 border-primary/30" : "bg-card/50"}`}
            >
              <div className={`text-xs font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, viewMode === "week" ? 5 : 2).map((ev) => (
                  <Link key={ev.id} to={`/events/${ev.id}`}>
                    <div className="text-[10px] leading-tight bg-primary/10 text-primary rounded px-1 py-0.5 truncate hover:bg-primary/20 transition-colors">
                      {ev.time} {ev.title}
                    </div>
                  </Link>
                ))}
                {dayEvents.length > (viewMode === "week" ? 5 : 2) && (
                  <div className="text-[10px] text-muted-foreground text-center">
                    +{dayEvents.length - (viewMode === "week" ? 5 : 2)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyEventsPage() {
  const { data: events = [], isLoading } = useEvents();
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const organized = useMemo(
    () => events.filter((e) => e.organizer_id === user?.id),
    [events, user]
  );

  const joined = useMemo(
    () => events.filter((e) => user && e.registrations?.some((r) => r.user_id === user.id)),
    [events, user]
  );

  const orgPagination = usePagination(organized, { pageSize: 6 });
  const joinPagination = usePagination(joined, { pageSize: 6 });

  const displayName = user?.user_metadata?.display_name || user?.email || "Гість";

  const renderEmpty = (type: "organized" | "joined") => (
    <div className="text-center py-12 space-y-3">
      <p className="text-muted-foreground">
        {type === "joined"
          ? "You are not part of any events yet."
          : "You haven't organized any events yet."}
      </p>
      <Link to="/events">
        <Button variant="outline">Browse public events</Button>
      </Link>
    </div>
  );

  const renderList = (list: typeof events, pagination: ReturnType<typeof usePagination<(typeof events)[0]>>, type: "organized" | "joined") =>
    isLoading ? (
      <EventGridSkeleton count={3} />
    ) : list.length === 0 ? (
      renderEmpty(type)
    ) : viewMode === "list" ? (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagination.items.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        <PaginationControls page={pagination.page} totalPages={pagination.totalPages} onPageChange={pagination.goToPage} />
      </>
    ) : (
      <CalendarView
        events={list}
        viewMode={viewMode as "month" | "week"}
        currentDate={calendarDate}
        onDateChange={setCalendarDate}
      />
    );

  return (
    <div className="page-container animate-fade-in">
      <Card className="glass-card mb-8">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
          <AvatarUpload size="md" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-display font-bold">{displayName}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
              <Mail className="h-3.5 w-3.5" />
              {user?.email ?? "—"}
            </p>
          </div>
          <Link to="/events/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Створити подію
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold">Мої події</h1>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-1" />
            Список
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Місяць
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Тиждень
          </Button>
        </div>
      </div>

      <Tabs defaultValue="organized">
        <TabsList>
          <TabsTrigger value="organized">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            Організую ({organized.length})
          </TabsTrigger>
          <TabsTrigger value="joined">
            <UserIcon className="h-4 w-4 mr-1.5" />
            Беру участь ({joined.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="organized" className="mt-6">
          {renderList(organized, orgPagination, "organized")}
        </TabsContent>
        <TabsContent value="joined" className="mt-6">
          {renderList(joined, joinPagination, "joined")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
