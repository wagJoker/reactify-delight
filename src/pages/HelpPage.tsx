/**
 * @module pages/HelpPage
 * @description Страница помощи с FAQ и документацией API.
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const faq = [
  {
    q: "Как создать событие?",
    a: 'Нажмите кнопку "Создать" в навигации, заполните форму и нажмите "Создать событие".',
  },
  {
    q: "Как присоединиться к событию?",
    a: 'Откройте карточку события и нажмите "Присоединиться". Если места закончились, кнопка будет неактивна.',
  },
  {
    q: "Как отменить участие?",
    a: 'Откройте событие, в котором участвуете, и нажмите "Покинуть событие".',
  },
  {
    q: "Как редактировать событие?",
    a: "Только организатор может редактировать или удалять своё событие через страницу деталей.",
  },
  {
    q: "Есть ли API документация?",
    a: "Да, Swagger-документация доступна по пути /api/docs на бэкэнде. Ниже приведён список эндпоинтов.",
  },
];

const endpoints = [
  { method: "POST", path: "/api/auth/register", desc: "Регистрация" },
  { method: "POST", path: "/api/auth/login", desc: "Авторизация" },
  { method: "GET", path: "/api/events", desc: "Список событий" },
  { method: "GET", path: "/api/events/:id", desc: "Детали события" },
  { method: "POST", path: "/api/events", desc: "Создание события" },
  { method: "PUT", path: "/api/events/:id", desc: "Обновление события" },
  { method: "DELETE", path: "/api/events/:id", desc: "Удаление события" },
  { method: "POST", path: "/api/events/:id/join", desc: "Присоединиться" },
  { method: "POST", path: "/api/events/:id/leave", desc: "Покинуть" },
];

const methodColors: Record<string, string> = {
  GET: "bg-accent text-accent-foreground",
  POST: "bg-primary text-primary-foreground",
  PUT: "bg-warning text-foreground",
  DELETE: "bg-destructive text-destructive-foreground",
};

export default function HelpPage() {
  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-display font-bold mb-2">Допомога</h1>
      <p className="text-muted-foreground mb-8">
        Опис проекту, FAQ та API-документація
      </p>

      {/* Project description */}
      <Card className="glass-card mb-8 border-primary/20">
        <CardHeader>
          <CardTitle className="font-display">Про проект</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">EventHub</strong> — веб-платформа для створення, пошуку та управління подіями в Україні. Проект створений як повноцінний SPA з акцентом на сучасний дизайн та найкращі практики розробки.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium text-foreground text-xs mb-1">Frontend</p>
              <p className="text-xs">React 18, TypeScript, Zustand, React Router, Tailwind CSS, shadcn/ui, Recharts, Framer Motion</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium text-foreground text-xs mb-1">Backend</p>
              <p className="text-xs">NestJS, TypeORM, PostgreSQL, JWT-авторизація, Swagger/OpenAPI документація</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-medium text-foreground text-xs mb-1">Ключові можливості</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>CRUD подій з категоріями, фільтрацією та пагінацією</li>
              <li>Реєстрація / скасування участі з перевіркою місць</li>
              <li>Особистий кабінет з завантаженням аватара</li>
              <li>Профілі користувачів з аналітикою (Recharts)</li>
              <li>Реєстрація на вебінари з Zod-валідацією</li>
              <li>JWT-авторизація та захист маршрутів (ProtectedRoute)</li>
              <li>Code splitting (React.lazy), skeleton loaders, анімації</li>
              <li>Адаптивний дизайн, dark-ready дизайн-система</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle className="font-display">FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display">API Эндпоинты (Swagger)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Badge className={`${methodColors[ep.method]} font-mono text-xs min-w-[60px] justify-center`}>
                  {ep.method}
                </Badge>
                <code className="text-sm font-mono flex-1">{ep.path}</code>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
