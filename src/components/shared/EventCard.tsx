/**
 * @module components/shared/EventCard
 * @description Event card with real DB registration.
 */
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, UserPlus, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useJoinEvent, useLeaveEvent, type DbEvent } from "@/hooks/useEvents";
import { toast } from "sonner";
import ElectricBorder from "@/components/ui/electric-border";

interface EventCardProps {
  event: DbEvent;
}

const categoryLabels: Record<string, string> = {
  conference: "Конференція",
  meetup: "Мітап",
  workshop: "Воркшоп",
  webinar: "Вебінар",
  social: "Нетворкінг",
  other: "Інше",
};

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuthStore();
  const joinEvent = useJoinEvent();
  const leaveEvent = useLeaveEvent();

  const participantCount = event.registrations?.length ?? 0;
  const spotsLeft = event.max_participants - participantCount;
  const isJoined = user ? event.registrations?.some((r) => r.user_id === user.id) : false;
  const isOrganizer = user?.id === event.organizer_id;
  const isMutating = joinEvent.isPending || leaveEvent.isPending;

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Увійдіть в акаунт для запису");
      return;
    }
    if (isJoined) {
      leaveEvent.mutate(
        { eventId: event.id, userId: user.id },
        {
          onSuccess: () => toast.info("Ви скасували запис"),
          onError: () => toast.error("Помилка при скасуванні"),
        }
      );
    } else {
      if (spotsLeft <= 0) {
        toast.error("Немає вільних місць");
        return;
      }
      joinEvent.mutate(
        { eventId: event.id, userId: user.id },
        {
          onSuccess: () => toast.success("Ви записались на подію!"),
          onError: (err) => toast.error(err.message || "Помилка при реєстрації"),
        }
      );
    }
  };

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <ElectricBorder
        color="hsl(245, 58%, 51%)"
        speed={0.6}
        chaos={0.08}
        borderRadius={12}
        thickness={1.5}
        className="h-full [&>svg]:opacity-0 [&>svg]:group-hover:opacity-100 [&>svg]:transition-opacity [&>svg]:duration-300 [&>[aria-hidden]]:opacity-0 [&>[aria-hidden]]:group-hover:opacity-60 [&>[aria-hidden]]:transition-opacity [&>[aria-hidden]]:duration-300"
      >
        <Card className="glass-card h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-transparent hover:bg-card/95 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg font-display leading-tight group-hover:text-primary transition-colors duration-200">
                {event.title}
              </CardTitle>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {categoryLabels[event.category] ?? event.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {event.date} о {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {participantCount}/{event.max_participants} учасників
                {spotsLeft <= 5 && spotsLeft > 0 && (
                  <span className="text-warning font-medium ml-1">
                    (залишилось {spotsLeft})
                  </span>
                )}
              </span>
            </div>

            {!isOrganizer && (
              <Button
                size="sm"
                variant={isJoined ? "outline" : "default"}
                className="w-full mt-2 transition-all duration-200"
                onClick={handleRegister}
                disabled={isMutating || (!isJoined && spotsLeft <= 0)}
              >
                {isMutating ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                )}
                {isJoined ? "Скасувати запис" : spotsLeft <= 0 ? "Місць немає" : "Записатися"}
              </Button>
            )}
          </CardContent>
        </Card>
      </ElectricBorder>
    </Link>
  );
}
