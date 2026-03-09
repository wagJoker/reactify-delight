/**
 * @module pages/MyEventsPage
 * @description Personal dashboard — organized & joined events from Supabase.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useAuthStore } from "@/store/authStore";
import { EventCard } from "@/components/shared/EventCard";
import { EventGridSkeleton } from "@/components/shared/EventCardSkeleton";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, CalendarDays, Mail, User as UserIcon } from "lucide-react";

export default function MyEventsPage() {
  const { data: events = [], isLoading } = useEvents();
  const { user } = useAuthStore();

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

  const renderList = (list: typeof events, pagination: ReturnType<typeof usePagination<(typeof events)[0]>>) =>
    isLoading ? (
      <EventGridSkeleton count={3} />
    ) : list.length === 0 ? (
      <p className="text-center text-muted-foreground py-12">Поки нічого немає</p>
    ) : (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagination.items.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        <PaginationControls page={pagination.page} totalPages={pagination.totalPages} onPageChange={pagination.goToPage} />
      </>
    );

  return (
    <div className="page-container animate-fade-in">
      <Card className="glass-card mb-8">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
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

      <h1 className="text-3xl font-display font-bold mb-6">Мої події</h1>

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
          {renderList(organized, orgPagination)}
        </TabsContent>
        <TabsContent value="joined" className="mt-6">
          {renderList(joined, joinPagination)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
