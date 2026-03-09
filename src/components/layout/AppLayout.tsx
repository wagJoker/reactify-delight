/**
 * @module components/layout/AppLayout
 * @description Main layout with navigation. Uses Supabase auth.
 */
import { Suspense } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogOut, Plus, List, HelpCircle, LayoutDashboard, UsersRound, Video } from "lucide-react";
import { WebinarDialog } from "@/components/shared/WebinarDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/shared/AvatarUpload";

export function AppLayout() {
  const { user, isAuthenticated, signOut } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: "/events", label: "Події", icon: List },
    { to: "/events/create", label: "Створити", icon: Plus },
    { to: "/my-events", label: "Мої події", icon: CalendarDays },
    { to: "/users", label: "Користувачі", icon: UsersRound },
    { to: "/help", label: "Допомога", icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      toast.error("Помилка виходу");
    }
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <LayoutDashboard className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl font-bold gradient-text">EventHub</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            <WebinarDialog>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5">
                <Video className="h-4 w-4" />
                Вебінар
              </Button>
            </WebinarDialog>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-events"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  {displayName}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Вийти
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Увійти</Button>
              </Link>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <nav className="md:hidden flex border-t border-border overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                  isActive(item.to) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EventHub. Платформа для управління подіями.
        </div>
      </footer>
    </div>
  );
}
