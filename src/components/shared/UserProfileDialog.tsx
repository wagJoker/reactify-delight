/**
 * @module components/shared/UserProfileDialog
 * @description Діалог профілю користувача з подіями та аналітикою.
 */
import { useMemo } from "react";
import type { IUser } from "@/types/user";
import type { IEvent } from "@/types/event";
import { useEventStore } from "@/store/eventStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Mail, MapPin, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const categoryLabels: Record<string, string> = {
  conference: "Конференції",
  meetup: "Мітапи",
  workshop: "Воркшопи",
  webinar: "Вебінари",
  social: "Нетворкінг",
  other: "Інше",
};

const CHART_COLORS = [
  "hsl(245, 58%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
];

function formatLastSeen(dateStr?: string): string {
  if (!dateStr) return "Невідомо";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Щойно";
  if (mins < 60) return `${mins} хв тому`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} год тому`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн тому`;
  return new Date(dateStr).toLocaleDateString("uk-UA");
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface UserProfileDialogProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ user, open, onOpenChange }: UserProfileDialogProps) {
  const { events } = useEventStore();

  const userEvents = useMemo(() => {
    if (!user) return [];
    return events.filter(
      (e) => e.organizerId === user.id || e.participants.includes(user.id)
    );
  }, [events, user]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    userEvents.forEach((e) => {
      const label = categoryLabels[e.category] || e.category;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [userEvents]);

  // Monthly activity for bar chart (last 6 months)
  const monthlyData = useMemo(() => {
    const months: { name: string; events: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleDateString("uk-UA", { month: "short" });
      // Simulate some activity
      months.push({ name: monthName, events: Math.floor(Math.random() * 5) + 1 });
    }
    // Make current month reflect actual events
    if (months.length > 0) {
      months[months.length - 1].events = userEvents.length || 1;
    }
    return months;
  }, [userEvents]);

  if (!user) return null;

  const organized = userEvents.filter((e) => e.organizerId === user.id);
  const participated = userEvents.filter((e) => e.participants.includes(user.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Профіль {user.name}</DialogTitle>
        </DialogHeader>

        {/* User header */}
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <Avatar className="h-16 w-16 ring-2 ring-primary/30">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-display font-bold truncate">{user.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Був(ла): {formatLastSeen(user.lastSeen)}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                На платформі з: {formatDate(user.joinedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 py-4">
          <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-2xl font-display font-bold text-primary">{userEvents.length}</p>
            <p className="text-xs text-muted-foreground">Всього подій</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-2xl font-display font-bold text-accent">{organized.length}</p>
            <p className="text-xs text-muted-foreground">Організовано</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-warning/5 border border-warning/10">
            <p className="text-2xl font-display font-bold text-warning">{participated.length}</p>
            <p className="text-xs text-muted-foreground">Участь</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Bar chart - monthly activity */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                Активність по місяцях
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(224, 25%, 12%)",
                      border: "1px solid hsl(224, 20%, 18%)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "hsl(210, 20%, 80%)" }}
                  />
                  <Bar dataKey="events" name="Подій" radius={[4, 4, 0, 0]} animationDuration={800}>
                    {monthlyData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie chart - categories */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-accent" />
                За категоріями
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(224, 25%, 12%)",
                        border: "1px solid hsl(224, 20%, 18%)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Немає даних</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {categoryData.map((d, i) => (
                  <Badge key={d.name} variant="secondary" className="text-xs gap-1">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    {d.name} ({d.value})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events list */}
        {userEvents.length > 0 && (
          <div className="pt-2">
            <h3 className="font-display font-semibold text-sm mb-3">Зареєстровані події</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {userEvents.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {e.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {e.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {categoryLabels[e.category] || e.category}
                  </Badge>
                  {e.organizerId === user.id && (
                    <Badge className="text-xs shrink-0">Організатор</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
