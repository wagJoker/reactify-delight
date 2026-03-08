/**
 * @module pages/LandingPage
 * @description Стартовая страница в стиле reactbits.dev — тёмная тема, анимации, CTA.
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  Zap,
  ArrowRight,
  BookOpen,
  Video,
  Globe,
  Shield,
  LayoutDashboard,
  Star,
} from "lucide-react";
import { WebinarDialog } from "@/components/shared/WebinarDialog";

const features = [
  {
    icon: CalendarDays,
    title: "Управління подіями",
    desc: "Створюйте, редагуйте та керуйте подіями з інтуїтивним інтерфейсом.",
  },
  {
    icon: Users,
    title: "Спільнота учасників",
    desc: "Об'єднуйте людей зі спільними інтересами з усієї України.",
  },
  {
    icon: Zap,
    title: "Миттєві сповіщення",
    desc: "Отримуйте оновлення про події в реальному часі.",
  },
  {
    icon: Shield,
    title: "Безпечна платформа",
    desc: "JWT-авторизація та захист персональних даних.",
  },
];

const stats = [
  { value: "500+", label: "Подій створено" },
  { value: "2.5K", label: "Учасників" },
  { value: "50+", label: "Міст України" },
  { value: "99.9%", label: "Uptime" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(224,25%,6%)] text-[hsl(210,20%,98%)] overflow-hidden">
      {/* Announcement bar */}
      <div className="relative z-10 border-b border-[hsl(245,58%,30%/0.3)] bg-[hsl(245,58%,51%/0.08)] py-2.5 text-center text-sm">
        <span className="text-[hsl(245,58%,70%)]">🚀 EventHub v2.0 — </span>
        <span className="text-[hsl(210,20%,80%)]">нові можливості для організаторів подій в Україні</span>
      </div>

      {/* Navigation */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-[hsl(245,58%,60%)]" />
          <span className="font-display text-xl font-bold bg-gradient-to-r from-[hsl(245,58%,60%)] to-[hsl(160,60%,45%)] bg-clip-text text-transparent">
            EventHub
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[hsl(220,10%,60%)]">
          <a href="#features" className="hover:text-[hsl(210,20%,98%)] transition-colors">Можливості</a>
          <a href="#stats" className="hover:text-[hsl(210,20%,98%)] transition-colors">Статистика</a>
          <a href="https://swagger-docs.example.com" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(210,20%,98%)] transition-colors flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> API Docs
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-[hsl(210,20%,80%)] hover:text-[hsl(210,20%,98%)] hover:bg-[hsl(245,58%,51%/0.15)]">
              Увійти
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-[hsl(0,0%,100%)]">
              Почати безкоштовно
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 text-center">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(245,58%,51%/0.12)] blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[hsl(160,60%,45%/0.08)] blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(245,58%,51%/0.3)] bg-[hsl(245,58%,51%/0.1)] px-4 py-1.5 text-sm mb-8">
            <Star className="h-4 w-4 text-[hsl(245,58%,60%)]" />
            <span className="text-[hsl(245,58%,70%)]">Нове</span>
            <span className="text-[hsl(210,20%,80%)]">Реєстрація на вебінари</span>
            <ArrowRight className="h-3.5 w-3.5 text-[hsl(210,20%,60%)]" />
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Платформа подій
            <br />
            <span className="bg-gradient-to-r from-[hsl(245,58%,60%)] to-[hsl(160,60%,50%)] bg-clip-text text-transparent">
              для України
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-[hsl(220,10%,55%)] mb-10 leading-relaxed">
            Створюйте та знаходьте конференції, мітапи, воркшопи та вебінари.
            Об'єднуйте спільноту розробників, дизайнерів та підприємців.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events">
              <Button size="lg" className="bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-[hsl(0,0%,100%)] px-8 text-base h-12 rounded-xl">
                <Globe className="h-5 w-5 mr-2" />
                Переглянути події
              </Button>
            </Link>
            <WebinarDialog>
              <Button size="lg" variant="outline" className="border-[hsl(245,58%,51%/0.3)] text-[hsl(210,20%,85%)] hover:bg-[hsl(245,58%,51%/0.1)] hover:border-[hsl(245,58%,51%/0.5)] px-8 text-base h-12 rounded-xl bg-transparent">
                <Video className="h-5 w-5 mr-2" />
                Записатись на вебінар
              </Button>
            </WebinarDialog>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 border-y border-[hsl(224,20%,15%)] bg-[hsl(224,25%,8%/0.8)] backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="font-display text-4xl font-bold bg-gradient-to-r from-[hsl(245,58%,60%)] to-[hsl(160,60%,50%)] bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-sm text-[hsl(220,10%,55%)] mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Все для управління подіями
          </h2>
          <p className="text-[hsl(220,10%,55%)] max-w-xl mx-auto">
            Потужні інструменти для організаторів та учасників
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="bg-[hsl(224,25%,10%)] border-[hsl(224,20%,18%)] hover:border-[hsl(245,58%,51%/0.4)] transition-all duration-300 group h-full">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-[hsl(245,58%,51%/0.1)] flex items-center justify-center mb-4 group-hover:bg-[hsl(245,58%,51%/0.2)] transition-colors">
                    <f.icon className="h-6 w-6 text-[hsl(245,58%,60%)]" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-[hsl(220,10%,55%)] leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* API Docs section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <Card className="bg-gradient-to-r from-[hsl(224,25%,10%)] to-[hsl(245,30%,12%)] border-[hsl(245,58%,51%/0.2)] overflow-hidden">
          <CardContent className="p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold mb-3">API Документація</h3>
              <p className="text-[hsl(220,10%,55%)] mb-6 leading-relaxed">
                Повна Swagger/OpenAPI документація для інтеграції з EventHub API.
                REST endpoints для подій, авторизації та управління користувачами.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/api/docs" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-[hsl(0,0%,100%)]">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Swagger UI
                  </Button>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-[hsl(245,58%,51%/0.3)] text-[hsl(210,20%,85%)] hover:bg-[hsl(245,58%,51%/0.1)] bg-transparent">
                    GitHub
                  </Button>
                </a>
              </div>
            </div>
            <div className="w-full sm:w-auto shrink-0">
              <div className="rounded-xl bg-[hsl(224,25%,6%)] border border-[hsl(224,20%,18%)] p-4 font-mono text-xs text-[hsl(220,10%,55%)] min-w-[280px]">
                <p className="text-[hsl(160,60%,50%)]">GET /api/events</p>
                <p className="text-[hsl(245,58%,60%)]">POST /api/events</p>
                <p className="text-[hsl(38,92%,50%)]">PUT /api/events/:id</p>
                <p className="text-[hsl(0,72%,51%)]">DELETE /api/events/:id</p>
                <p className="text-[hsl(160,60%,50%)]">POST /api/auth/login</p>
                <p className="text-[hsl(160,60%,50%)]">POST /api/auth/register</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[hsl(224,20%,15%)] py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[hsl(220,10%,45%)]">
          <p>© 2026 EventHub. Платформа подій для України.</p>
          <div className="flex gap-6">
            <a href="/api/docs" className="hover:text-[hsl(210,20%,80%)] transition-colors">API Docs</a>
            <Link to="/help" className="hover:text-[hsl(210,20%,80%)] transition-colors">Допомога</Link>
            <Link to="/events" className="hover:text-[hsl(210,20%,80%)] transition-colors">Події</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
