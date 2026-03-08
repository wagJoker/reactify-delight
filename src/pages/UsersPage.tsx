/**
 * @module pages/UsersPage
 * @description Сторінка «Користувачі» зі списком та діалогом профілю.
 */
import { useEffect, useState } from "react";
import type { IUser } from "@/types/user";
import { generateMockUsers } from "@/lib/mockUsers";
import { useEventStore } from "@/store/eventStore";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Clock } from "lucide-react";
import { UserListSkeleton } from "@/components/shared/UserCardSkeleton";
import { UserProfileDialog } from "@/components/shared/UserProfileDialog";

function formatLastSeen(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "онлайн";
  if (mins < 60) return `${mins} хв тому`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} год тому`;
  const days = Math.floor(hours / 24);
  return `${days} дн тому`;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { loadMockData } = useEventStore();

  useEffect(() => {
    loadMockData();
    const timer = setTimeout(() => {
      setUsers(generateMockUsers());
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [loadMockData]);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Користувачі</h1>
        <p className="text-muted-foreground mt-1">
          Зареєстровані учасники платформи
        </p>
      </div>

      {isLoading ? (
        <UserListSkeleton count={8} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <Card
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className="glass-card transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 group cursor-pointer"
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
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 shrink-0" />
                    {formatLastSeen(u.lastSeen)}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  <User className="h-3 w-3 mr-1" />
                  {u.registeredEvents?.length || 0} подій
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UserProfileDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
    </div>
  );
}
