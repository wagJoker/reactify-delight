/**
 * @module pages/CreateEventPage
 * @description Страница создания/редактирования события.
 * Используется для обоих сценариев (DRY принцип).
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "@/store/eventStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { EventCategory, CreateEventDTO } from "@/types/event";

const categories: { value: EventCategory; label: string }[] = [
  { value: "conference", label: "Конференция" },
  { value: "meetup", label: "Митап" },
  { value: "workshop", label: "Воркшоп" },
  { value: "webinar", label: "Вебинар" },
  { value: "social", label: "Нетворкинг" },
  { value: "other", label: "Другое" },
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { events, addEvent, updateEvent } = useEventStore();
  const { user } = useAuthStore();

  const isEditing = Boolean(id);
  const existingEvent = isEditing ? events.find((e) => e.id === id) : null;

  const [form, setForm] = useState<CreateEventDTO>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "meetup",
    maxParticipants: 50,
  });

  useEffect(() => {
    if (existingEvent) {
      setForm({
        title: existingEvent.title,
        description: existingEvent.description,
        date: existingEvent.date,
        time: existingEvent.time,
        location: existingEvent.location,
        category: existingEvent.category,
        maxParticipants: existingEvent.maxParticipants,
      });
    }
  }, [existingEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.date || !form.time || !form.location) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (isEditing && id) {
      updateEvent(id, form);
      toast.success("Событие обновлено");
      navigate(`/events/${id}`);
    } else {
      const newEvent = {
        ...form,
        id: `evt-${Date.now()}`,
        organizerId: user?.id ?? "user-1",
        participants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addEvent(newEvent);
      toast.success("Событие создано!");
      navigate("/events");
    }
  };

  const updateField = <K extends keyof CreateEventDTO>(key: K, value: CreateEventDTO[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-container max-w-2xl animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            {isEditing ? "Редактировать событие" : "Создать событие"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Название *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="React Conf 2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Расскажите о событии..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Дата *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Время *</Label>
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField("time", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Место *</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Москва, Технопарк"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => updateField("category", v as EventCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Макс. участников</Label>
                <Input
                  id="max"
                  type="number"
                  min={1}
                  value={form.maxParticipants}
                  onChange={(e) => updateField("maxParticipants", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">
                {isEditing ? "Сохранить" : "Создать событие"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
