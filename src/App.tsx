/**
 * @module App
 * @description Корневой компонент приложения.
 * Использует React.lazy и Suspense для code splitting.
 * Следует принципу OCP — новые маршруты добавляются без модификации существующих.
 */
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Lazy-loaded pages (code splitting)
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const EventsListPage = lazy(() => import("@/pages/EventsListPage"));
const EventDetailsPage = lazy(() => import("@/pages/EventDetailsPage"));
const CreateEventPage = lazy(() => import("@/pages/CreateEventPage"));
const MyEventsPage = lazy(() => import("@/pages/MyEventsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/events" replace />} />
              <Route path="/events" element={<EventsListPage />} />
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/events/:id/edit" element={<CreateEventPage />} />
              <Route path="/my-events" element={<MyEventsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
