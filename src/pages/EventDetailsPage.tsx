/**
 * @module pages/EventDetailsPage
 * @description Страница деталей события с возможностью записи, редактирования и skeleton loader.
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEventStore } from "@/store/eventStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, Users, ArrowLeft, Trash2, Edit, UserPlus } from "lucide-react";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  conference: "Конференция",
  meetup: "Митап",
  workshop: "Воркшоп",
  webinar: "Вебинар",
  social: "Нетворкинг",
  other: "Другое",
};

function DetailsSkeleton() {
  return (
    <div className="page-container animate-fade-in max-w-3xl space-y-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-2/3" />
      <Card className="glass-card">
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
          <div className="grid gap-3 sm:grid-cols-3 pt-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-28" />
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, joinEvent, leaveEvent, deleteEvent, loadMockData } = useEventStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMockData();
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [loadMockData]);

  if (isLoading) return <DetailsSkeleton />;

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-lg text-muted-foreground">Событие не найдено</p>
        <Link to="/events">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к событиям
          </Button>
        </Link>
      </div>
    );
  }

  const isJoined = user ? event.participants.includes(user.id) : false;
  const isOrganizer = user?.id === event.organizerId;
  const spotsLeft = event.maxParticipants - event.participants.length;

  const handleJoin = () => {
    if (!user) {
      toast.error("Войдите в аккаунт");
      return;
    }
    if (spotsLeft <= 0) {
      toast.error("Мест нет");
      return;
    }
    joinEvent(event.id, user.id);
    toast.success("Вы записались на событие!");
  };

  const handleLeave = () => {
    if (!user) return;
    leaveEvent(event.id, user.id);
    toast.info("Вы отменили запись");
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    toast.success("Событие удалено");
    navigate("/events");
  };

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <Link to="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Все события
      </Link>

      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-3xl font-display font-bold">{event.title}</h1>
            <Badge variant="secondary" className="text-sm">
              {categoryLabels[event.category] ?? event.category}
            </Badge>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-4">
            <p className="text-foreground leading-relaxed">{event.description}</p>

            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{event.date} в {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {event.participants.length}/{event.maxParticipants} участников
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {!isOrganizer && (
            isJoined ? (
              <Button variant="outline" onClick={handleLeave}>
                <UserPlus className="h-4 w-4 mr-2" />
                Отменить запись
              </Button>
            ) : (
              <Button onClick={handleJoin} disabled={spotsLeft <= 0}>
                <UserPlus className="h-4 w-4 mr-2" />
                {spotsLeft <= 0 ? "Мест нет" : "Записаться на событие"}
              </Button>
            )
          )}

          {isOrganizer && (
            <>
              <Link to={`/events/${event.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
