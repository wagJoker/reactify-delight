/**
 * @module pages/CreateEventPage
 * @description Create/edit event page with visibility, date validation, and calendar picker.
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent, useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, CalendarIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { uk } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/types/event";

const categories: { value: EventCategory; label: string }[] = [
  { value: "conference", label: "Конференція" },
  { value: "meetup", label: "Мітап" },
  { value: "workshop", label: "Воркшоп" },
  { value: "webinar", label: "Вебінар" },
  { value: "social", label: "Нетворкінг" },
  { value: "other", label: "Інше" },
];

interface FormState {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  max_participants: number;
  visibility: "public" | "private";
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { data: existingEvent } = useEvent(id);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const isEditing = Boolean(id);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "meetup",
    max_participants: 50,
    visibility: "public",
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
        max_participants: existingEvent.max_participants,
        visibility: (existingEvent.visibility as "public" | "private") || "public",
      });
    }
  }, [existingEvent]);

  const selectedDate = form.date ? parseISO(form.date) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.location) {
      toast.error("Заповніть обов'язкові поля");
      return;
    }
    if (!user) {
      toast.error("Увійдіть в акаунт");
      return;
    }

    // Validate date is not in the past
    const eventDate = parseISO(form.date);
    if (isBefore(eventDate, startOfDay(new Date()))) {
      toast.error("Не можна створити подію в минулому");
      return;
    }

    if (isEditing && id) {
      updateEvent.mutate(
        { id, ...form },
        {
          onSuccess: () => { toast.success("Подію оновлено"); navigate(`/events/${id}`); },
          onError: () => toast.error("Помилка оновлення"),
        }
      );
    } else {
      createEvent.mutate(
        { ...form, organizer_id: user.id },
        {
          onSuccess: (data) => {
            toast.success("Подію створено!");
            navigate(`/events/${data.id}`);
          },
          onError: () => toast.error("Помилка створення"),
        }
      );
    }
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isPending = createEvent.isPending || updateEvent.isPending;

  return (
    <div className="page-container max-w-2xl animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            {isEditing ? "Редагувати подію" : "Створити подію"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Назва *</Label>
              <Input id="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="React Conf 2026" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Опис</Label>
              <Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Розкажіть про подію..." rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Дата *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.date ? format(parseISO(form.date), "PPP", { locale: uk }) : "Оберіть дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => d && updateField("date", format(d, "yyyy-MM-dd"))}
                      disabled={(date) => isBefore(date, startOfDay(new Date()))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Час *</Label>
                <Input id="time" type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Місце *</Label>
              <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Київ, UNIT.City" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Категорія</Label>
                <Select value={form.category} onValueChange={(v) => updateField("category", v as EventCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Макс. учасників</Label>
                <Input id="max" type="number" min={1} value={form.max_participants} onChange={(e) => updateField("max_participants", Number(e.target.value))} />
              </div>
            </div>

            {/* Visibility radio */}
            <div className="space-y-3">
              <Label>Видимість</Label>
              <RadioGroup
                value={form.visibility}
                onValueChange={(v) => updateField("visibility", v as "public" | "private")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="public" id="vis-public" />
                  <Label htmlFor="vis-public" className="flex items-center gap-1.5 cursor-pointer font-normal">
                    <Eye className="h-4 w-4 text-primary" />
                    Публічна
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="private" id="vis-private" />
                  <Label htmlFor="vis-private" className="flex items-center gap-1.5 cursor-pointer font-normal">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    Приватна
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Зберегти" : "Створити подію"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
