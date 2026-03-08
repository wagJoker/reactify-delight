/**
 * @module pages/MyEventsPage
 * @description Личный кабинет — управление своими событиями и записями.
 * Вкладки: организую, участвую. Кнопки создания/редактирования.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEventStore } from "@/store/eventStore";
import { useAuthStore } from "@/store/authStore";
import { EventCard } from "@/components/shared/EventCard";
import { EventGridSkeleton } from "@/components/shared/EventCardSkeleton";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, CalendarDays, Mail, User as UserIcon } from "lucide-react";

export default function MyEventsPage() {
  const { events, loadMockData } = useEventStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMockData();
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [loadMockData]);

  const organized = useMemo(
    () => events.filter((e) => e.organizerId === user?.id),
    [events, user]
  );

  const joined = useMemo(
    () => events.filter((e) => user && e.participants.includes(user.id)),
    [events, user]
  );

  const orgPagination = usePagination(organized, { pageSize: 6 });
  const joinPagination = usePagination(joined, { pageSize: 6 });

  const renderList = (list: typeof events, pagination: ReturnType<typeof usePagination<typeof events[0]>>) =>
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
      {/* Профиль пользователя */}
      <Card className="glass-card mb-8">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
          <AvatarUpload />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-display font-bold">{user?.name ?? "Гость"}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
              <Mail className="h-3.5 w-3.5" />
              {user?.email ?? "—"}
            </p>
          </div>
          <Link to="/events/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Создать событие
            </Button>
          </Link>
        </CardContent>
      </Card>

      <h1 className="text-3xl font-display font-bold mb-6">Мои события</h1>

      <Tabs defaultValue="organized">
        <TabsList>
          <TabsTrigger value="organized">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            Организую ({organized.length})
          </TabsTrigger>
          <TabsTrigger value="joined">
            <UserIcon className="h-4 w-4 mr-1.5" />
            Участвую ({joined.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organized" className="mt-6">
          {renderList(organized)}
        </TabsContent>
        <TabsContent value="joined" className="mt-6">
          {renderList(joined)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
