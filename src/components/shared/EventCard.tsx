/**
 * @module components/shared/EventCard
 * @description Карточка события с эффектами hover и кнопкой записи.
 * Следует SRP — только отображение данных события.
 */
import { Link } from "react-router-dom";
import type { IEvent } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useEventStore } from "@/store/eventStore";
import { toast } from "sonner";
import ElectricBorder from "@/components/ui/electric-border";

interface EventCardProps {
  event: IEvent;
}

const categoryLabels: Record<string, string> = {
  conference: "Конференция",
  meetup: "Митап",
  workshop: "Воркшоп",
  webinar: "Вебинар",
  social: "Нетворкинг",
  other: "Другое",
};

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuthStore();
  const { joinEvent, leaveEvent } = useEventStore();
  const spotsLeft = event.maxParticipants - event.participants.length;
  const isJoined = user ? event.participants.includes(user.id) : false;
  const isOrganizer = user?.id === event.organizerId;

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Войдите в аккаунт для записи");
      return;
    }
    if (isJoined) {
      leaveEvent(event.id, user.id);
      toast.info("Вы отменили запись");
    } else {
      if (spotsLeft <= 0) {
        toast.error("Нет свободных мест");
        return;
      }
      joinEvent(event.id, user.id);
      toast.success("Вы записались на событие!");
    }
  };

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card className="glass-card h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-primary/30 hover:bg-card/95 relative overflow-hidden">
        {/* Gradient accent on hover */}
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
              {event.date} в {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {event.participants.length}/{event.maxParticipants} участников
              {spotsLeft <= 5 && spotsLeft > 0 && (
                <span className="text-warning font-medium ml-1">
                  (осталось {spotsLeft})
                </span>
              )}
            </span>
          </div>

          {/* Кнопка записи */}
          {!isOrganizer && (
            <Button
              size="sm"
              variant={isJoined ? "outline" : "default"}
              className="w-full mt-2 transition-all duration-200"
              onClick={handleRegister}
              disabled={!isJoined && spotsLeft <= 0}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              {isJoined ? "Отменить запись" : spotsLeft <= 0 ? "Мест нет" : "Записаться"}
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
