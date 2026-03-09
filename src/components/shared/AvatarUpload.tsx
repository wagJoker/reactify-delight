/**
 * @module components/shared/AvatarUpload
 * @description Simple avatar display (letter-based) since we now use Supabase auth.
 */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

export function AvatarUpload() {
  const { user } = useAuthStore();
  const displayName = user?.user_metadata?.display_name || user?.email || "?";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Avatar className="h-20 w-20 ring-2 ring-primary/30">
      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
