/**
 * @module components/layout/AppLayout
 * @description Главный layout приложения с навигацией.
 * Следует SRP — отвечает только за структуру страницы.
 */
import { Suspense } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { CalendarDays, LogOut, Plus, List, HelpCircle, LayoutDashboard, UsersRound } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function AppLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: "/events", label: "События", icon: List },
    { to: "/events/create", label: "Создать", icon: Plus },
    { to: "/my-events", label: "Мои события", icon: CalendarDays },
    { to: "/users", label: "Пользователи", icon: UsersRound },
    { to: "/help", label: "Помощь", icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <LayoutDashboard className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl font-bold gradient-text">
              EventHub
            </span>
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
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-events"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:flex"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-6 w-6 rounded-full ring-1 ring-border object-cover"
                  />
                  {user?.name}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Вийти
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Войти</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {isAuthenticated && (
          <nav className="md:hidden flex border-t border-border overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EventHub. Платформа для управления событиями.
        </div>
      </footer>
    </div>
  );
}
