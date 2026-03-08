/**
 * @module components/shared/WebinarDialog
 * @description Діалог реєстрації на вебінар з валідацією та збереженням в localStorage.
 */
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Video, CheckCircle } from "lucide-react";

const webinarSchema = z.object({
  name: z.string().trim().min(2, "Ім'я має містити мінімум 2 символи").max(100, "Максимум 100 символів"),
  email: z.string().trim().email("Невірний формат email").max(255, "Максимум 255 символів"),
  phone: z.string().trim().min(10, "Введіть коректний номер телефону").max(20, "Максимум 20 символів"),
});

export interface WebinarRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
}

function getRegistrations(): WebinarRegistration[] {
  try {
    return JSON.parse(localStorage.getItem("webinar-registrations") || "[]");
  } catch {
    return [];
  }
}

function saveRegistration(reg: WebinarRegistration) {
  const list = getRegistrations();
  list.push(reg);
  localStorage.setItem("webinar-registrations", JSON.stringify(list));
}

interface WebinarDialogProps {
  children: React.ReactNode;
}

export function WebinarDialog({ children }: WebinarDialogProps) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "+380" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = webinarSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Check duplicate
    const existing = getRegistrations();
    if (existing.some((r) => r.email === form.email)) {
      setErrors({ email: "Цей email вже зареєстровано" });
      return;
    }

    saveRegistration({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      registeredAt: new Date().toISOString(),
    });

    setSuccess(true);
    toast.success("Ви успішно зареєстровані на вебінар!");
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setForm({ name: "", email: "", phone: "+380" });
      setErrors({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-accent mx-auto" />
            <DialogTitle className="text-xl font-display">Реєстрацію підтверджено!</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Деталі вебінару будуть надіслані на вашу пошту.
            </p>
            <Button onClick={handleClose}>Закрити</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display">
                <Video className="h-5 w-5 text-primary" />
                Реєстрація на вебінар
              </DialogTitle>
              <DialogDescription>
                «Як створювати успішні IT-події в Україні» — 15 березня 2026, 18:00
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="webinar-name">Ім'я *</Label>
                <Input
                  id="webinar-name"
                  placeholder="Тарас Шевченко"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-email">Email *</Label>
                <Input
                  id="webinar-email"
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-phone">Телефон *</Label>
                <Input
                  id="webinar-phone"
                  type="tel"
                  placeholder="+380 XX XXX XX XX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <Button type="submit" className="w-full">
                Зареєструватися
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
