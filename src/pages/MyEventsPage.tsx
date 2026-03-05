/**
 * @module pages/MyEventsPage
 * @description Страница «Мои события» — календарный вид событий пользователя.
 */
import { useEffect, useMemo } from "react";
import { useEventStore } from "@/store/eventStore";
import { useAuthStore } from "@/store/authStore";
import { EventCard } from "@/components/shared/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyEventsPage() {
  const { events, loadMockData } = useEventStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  const organized = useMemo(
    () => events.filter((e) => e.organizerId === user?.id),
    [events, user]
  );

  const joined = useMemo(
    () => events.filter((e) => user && e.participants.includes(user.id)),
    [events, user]
  );

  const renderList = (list: typeof events) =>
    list.length === 0 ? (
      <p className="text-center text-muted-foreground py-12">Пока ничего нет</p>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    );

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-3xl font-display font-bold mb-6">Мои события</h1>

      <Tabs defaultValue="organized">
        <TabsList>
          <TabsTrigger value="organized">
            Организую ({organized.length})
          </TabsTrigger>
          <TabsTrigger value="joined">
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
