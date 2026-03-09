/**
 * @module pages/LoginPage
 * @description Страница авторизации и регистрации с zod-валидацией.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LayoutDashboard, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Невірний формат email"),
  password: z.string().min(6, "Мінімум 6 символів"),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Мінімум 2 символи").max(100, "Максимум 100 символів"),
  email: z.string().trim().email("Невірний формат email"),
  password: z.string().min(6, "Мінімум 6 символів").max(128, "Максимум 128 символів"),
});

const recoverySchema = z.object({
  email: z.string().trim().email("Невірний формат email"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [loginForm, setLoginForm] = useState({ email: "oleksandr@eventhub.ua", password: "password123" });
  const [registerForm, setRegisterForm] = useState({ email: "", password: "", name: "" });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryError, setRecoveryError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    const result = loginSchema.safeParse(loginForm);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) errs[String(err.path[0])] = err.message; });
      setLoginErrors(errs);
      return;
    }
    const savedAvatar = localStorage.getItem("user-avatar");
    login(
      {
        id: "user-1",
        email: loginForm.email,
        name: loginForm.email === "oleksandr@eventhub.ua" ? "Олександр Шевченко" : loginForm.email.split("@")[0],
        avatar: savedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Oleksandr`,
      },
      "mock-jwt-token"
    );
    toast.success("Успішний вхід!");
    navigate("/events");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrors({});
    const result = registerSchema.safeParse(registerForm);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) errs[String(err.path[0])] = err.message; });
      setRegErrors(errs);
      return;
    }
    login(
      { id: "user-1", email: registerForm.email, name: registerForm.name },
      "mock-jwt-token"
    );
    toast.success("Реєстрація успішна!");
    navigate("/events");
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    const result = recoverySchema.safeParse({ email: recoveryEmail });
    if (!result.success) {
      setRecoveryError(result.error.errors[0]?.message || "Помилка");
      return;
    }
    toast.success("Інструкції для відновлення пароля надіслано на " + recoveryEmail);
    setRecoveryOpen(false);
    setRecoveryEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <LayoutDashboard className="h-12 w-12 text-primary mb-3" />
          <h1 className="text-3xl font-display font-bold gradient-text">EventHub</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Платформа подій для України
          </p>
        </div>

        <Card className="glass-card">
          <Tabs defaultValue="login">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вхід</TabsTrigger>
                <TabsTrigger value="register">Реєстрація</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="login" className="space-y-4 mt-0">
                <CardDescription>Увійдіть до свого акаунту</CardDescription>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="oleksandr@eventhub.ua"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className={loginErrors.email ? "border-destructive" : ""}
                    />
                    {loginErrors.email && <p className="text-xs text-destructive">{loginErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={`pr-10 ${loginErrors.password ? "border-destructive" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginErrors.password && <p className="text-xs text-destructive">{loginErrors.password}</p>}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setRecoveryOpen(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      Забули пароль?
                    </button>
                  </div>
                  <Button type="submit" className="w-full">
                    Увійти
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-0">
                <CardDescription>Створіть новий акаунт</CardDescription>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Ім'я</Label>
                    <Input
                      id="reg-name"
                      placeholder="Тарас Коваленко"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className={regErrors.name ? "border-destructive" : ""}
                    />
                    {regErrors.name && <p className="text-xs text-destructive">{regErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="user@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className={regErrors.email ? "border-destructive" : ""}
                    />
                    {regErrors.email && <p className="text-xs text-destructive">{regErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className={`pr-10 ${regErrors.password ? "border-destructive" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {regErrors.password && <p className="text-xs text-destructive">{regErrors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full">
                    Зареєструватися
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Password Recovery Dialog */}
      <Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Відновлення пароля</DialogTitle>
            <DialogDescription>
              Введіть email, і ми надішлемо інструкції для скидання пароля.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRecovery} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email</Label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="user@example.com"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className={recoveryError ? "border-destructive" : ""}
              />
              {recoveryError && <p className="text-xs text-destructive">{recoveryError}</p>}
            </div>
            <Button type="submit" className="w-full">
              Надіслати
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
