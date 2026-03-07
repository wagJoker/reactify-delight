/**
 * @module pages/UsersPage
 * @description Страница «Пользователи» — список зарегистрированных пользователей.
 * Использует имитацию React Router loader с состоянием загрузки и skeleton.
 */
import { useEffect, useState } from "react";
import type { IUser } from "@/types/user";
import { generateMockUsers } from "@/lib/mockUsers";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User } from "lucide-react";
import { UserListSkeleton } from "@/components/shared/UserCardSkeleton";

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных (loader pattern)
    const timer = setTimeout(() => {
      setUsers(generateMockUsers());
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Пользователи</h1>
        <p className="text-muted-foreground mt-1">
          Зарегистрированные участники платформы
        </p>
      </div>

      {isLoading ? (
        <UserListSkeleton count={8} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <Card
              key={u.id}
              className="glass-card transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 group"
            >
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar className="h-12 w-12 ring-2 ring-border group-hover:ring-primary/40 transition-all">
                  <AvatarImage src={u.avatar} alt={u.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium font-display truncate group-hover:text-primary transition-colors">
                    {u.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 shrink-0" />
                    {u.email}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Участник
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
