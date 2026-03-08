/**
 * @module components/shared/AvatarUpload
 * @description Компонент завантаження аватара з превʼю та збереженням в localStorage.
 */
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUpload() {
  const { user, login, token } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const currentAvatar = preview || user?.avatar;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Підтримуються лише JPG, PNG та WebP");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Максимальний розмір файлу — 2 МБ");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      // Save to localStorage and update store
      localStorage.setItem("user-avatar", dataUrl);
      if (user && token) {
        login({ ...user, avatar: dataUrl }, token);
      }
      toast.success("Аватар оновлено!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    localStorage.removeItem("user-avatar");
    if (user && token) {
      login(
        { ...user, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}` },
        token
      );
    }
    toast.info("Аватар видалено");
  };

  return (
    <div className="relative group">
      <Avatar className="h-20 w-20 ring-2 ring-primary/30">
        <AvatarImage src={currentAvatar} alt={user?.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
          {user?.name?.split(" ").map((n) => n[0]).join("") ?? "?"}
        </AvatarFallback>
      </Avatar>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Змінити аватар"
      >
        <Camera className="h-6 w-6 text-background" />
      </button>
      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
          aria-label="Видалити аватар"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
