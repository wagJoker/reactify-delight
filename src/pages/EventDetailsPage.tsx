/**
 * @module pages/EventDetailsPage
 * @description Event details page with Supabase data.
 */
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEvent, useJoinEvent, useLeaveEvent, useDeleteEvent } from "@/hooks/useEvents";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, Users, ArrowLeft, Trash2, Edit, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  conference: "Конференція",
  meetup: "Мітап",
  workshop: "Воркшоп",
  webinar: "Вебінар",
  social: "Нетворкінг",
  other: "Інше",
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
    </div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading } = useEvent(id);
  const { user } = useAuthStore();
  const joinEvent = useJoinEvent();
  const leaveEvent = useLeaveEvent();
  const deleteEvent = useDeleteEvent();

  if (isLoading) return <DetailsSkeleton />;

  if (!event) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-lg text-muted-foreground">Подію не знайдено</p>
        <Link to="/events">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад до подій
          </Button>
        </Link>
      </div>
    );
  }

  const participantCount = event.registrations?.length ?? 0;
  const isJoined = user ? event.registrations?.some((r) => r.user_id === user.id) : false;
  const isOrganizer = user?.id === event.organizer_id;
  const spotsLeft = event.max_participants - participantCount;

  const handleJoin = () => {
    if (!user) { toast.error("Увійдіть в акаунт"); return; }
    if (spotsLeft <= 0) { toast.error("Місць немає"); return; }
    joinEvent.mutate(
      { eventId: event.id, userId: user.id },
      { onSuccess: () => toast.success("Ви записались на подію!"), onError: () => toast.error("Помилка") }
    );
  };

  const handleLeave = () => {
    if (!user) return;
    leaveEvent.mutate(
      { eventId: event.id, userId: user.id },
      { onSuccess: () => toast.info("Ви скасували запис"), onError: () => toast.error("Помилка") }
    );
  };

  const handleDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: () => { toast.success("Подію видалено"); navigate("/events"); },
      onError: () => toast.error("Помилка видалення"),
    });
  };

  const isMutating = joinEvent.isPending || leaveEvent.isPending;

  return (
    <div className="page-container animate-fade-in max-w-3xl">
      <Link to="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Усі події
      </Link>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-display font-bold">{event.title}</h1>
          <Badge variant="secondary" className="text-sm">
            {categoryLabels[event.category] ?? event.category}
          </Badge>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-4">
            <p className="text-foreground leading-relaxed">{event.description}</p>
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{event.date} о {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>{participantCount}/{event.max_participants} учасників</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          {!isOrganizer && (
            isJoined ? (
              <Button variant="outline" onClick={handleLeave} disabled={isMutating}>
                {isMutating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Скасувати запис
              </Button>
            ) : (
              <Button onClick={handleJoin} disabled={isMutating || spotsLeft <= 0}>
                {isMutating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                {spotsLeft <= 0 ? "Місць немає" : "Записатися на подію"}
              </Button>
            )
          )}
          {isOrganizer && (
            <>
              <Link to={`/events/${event.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteEvent.isPending}>
                {deleteEvent.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Видалити
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
