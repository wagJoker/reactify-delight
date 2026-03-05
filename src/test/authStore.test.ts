/**
 * @module test/authStore.test
 * @description Unit-тесты для authStore
 */
import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it("начальное состояние — не авторизован", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("login устанавливает пользователя и токен", () => {
    useAuthStore.getState().login(
      { id: "1", email: "test@test.com", name: "Test" },
      "token-123"
    );
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe("test@test.com");
    expect(state.token).toBe("token-123");
  });

  it("logout сбрасывает состояние", () => {
    useAuthStore.getState().login(
      { id: "1", email: "test@test.com", name: "Test" },
      "token-123"
    );
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
