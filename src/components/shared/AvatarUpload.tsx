/**
 * @module components/shared/AvatarUpload
 * @description Avatar with upload capability. Saves to storage and profiles table.
 */
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useProfile, useUpdateAvatar } from "@/hooks/useProfile";
import { toast } from "sonner";

interface AvatarUploadProps {
  editable?: boolean;
  size?: "sm" | "md" | "lg";
  userId?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-16 w-16",
  lg: "h-20 w-20",
};

export function AvatarUpload({ editable = true, size = "lg", userId }: AvatarUploadProps) {
  const { user } = useAuthStore();
  const { data: profile } = useProfile(userId || user?.id);
  const updateAvatar = useUpdateAvatar();
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email || "?";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Файл занадто великий (макс. 2 МБ)");
      return;
    }

    updateAvatar.mutate(file, {
      onSuccess: () => toast.success("Аватар оновлено!"),
      onError: () => toast.error("Помилка завантаження аватару"),
    });
  };

  return (
    <div className="relative group">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-primary/30`}>
        {profile?.avatar_url && (
          <AvatarImage src={profile.avatar_url} alt={displayName} />
        )}
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      {editable && !userId && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            onClick={() => inputRef.current?.click()}
            disabled={updateAvatar.isPending}
          >
            {updateAvatar.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </Button>
        </>
      )}
    </div>
  );
}
