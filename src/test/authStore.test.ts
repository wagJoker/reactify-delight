/**
 * @module test/authStore.test
 * @description Unit tests for authStore with Supabase auth.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/store/authStore";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("initial state is not authenticated", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("has signIn method", () => {
    const state = useAuthStore.getState();
    expect(typeof state.signIn).toBe("function");
  });

  it("has signOut method", () => {
    const state = useAuthStore.getState();
    expect(typeof state.signOut).toBe("function");
  });

  it("has initialize method", () => {
    const state = useAuthStore.getState();
    expect(typeof state.initialize).toBe("function");
  });
});
