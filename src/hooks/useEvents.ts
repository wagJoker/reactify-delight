/**
 * @module hooks/useEvents
 * @description React Query hooks for events CRUD and registration via Lovable Cloud.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { EventCategory } from "@/types/event";

export type DbEvent = Tables<"events"> & {
  registrations: { user_id: string }[];
  organizer?: { display_name: string | null } | null;
};

/** Fetch all events with registration counts */
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, registrations:event_registrations(user_id), organizer:profiles!events_organizer_profiles_fkey(display_name)")
        .order("date", { ascending: true });

      if (error) throw error;
      return (data as unknown) as DbEvent[];
    },
  });
}

/** Fetch single event */
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["events", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, registrations:event_registrations(user_id), organizer:profiles!events_organizer_id_fkey(display_name)")
        .eq("id", id!)
        .single();

      if (error) throw error;
      return (data as unknown) as DbEvent;
    },
  });
}

/** Create event */
export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: {
      title: string;
      description: string;
      date: string;
      time: string;
      location: string;
      category: EventCategory;
      max_participants: number;
      organizer_id: string;
      visibility?: string;
    }) => {
      const { data, error } = await supabase.from("events").insert(event).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

/** Update event */
export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase.from("events").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

/** Delete event */
export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

/** Register for event */
export function useJoinEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: eventId, user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

/** Unregister from event */
export function useLeaveEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}
