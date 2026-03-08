/**
 * @module lib/api
 * @description HTTP-клієнт з JWT-авторизацією.
 * Автоматично додає Bearer token до кожного запиту.
 */
import { useAuthStore } from "@/store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

class ApiClient {
  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Token expired or invalid — force logout
    if (response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      throw new Error("Сесія закінчилася. Увійдіть знову.");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Помилка сервера" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // 204 No Content
    if (response.status === 204) return {} as T;

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
