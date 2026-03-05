/**
 * @module components/shared/EventCard
 * @description Карточка события для отображения в списке.
 * Следует SRP — только отображение данных события.
 */
import { Link } from "react-router-dom";
import type { IEvent } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";

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
  const spotsLeft = event.maxParticipants - event.participants.length;

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card className="glass-card h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-display leading-tight group-hover:text-primary transition-colors">
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
        </CardContent>
      </Card>
    </Link>
  );
}
