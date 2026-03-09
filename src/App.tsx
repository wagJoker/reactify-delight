/**
 * @module App
 * @description Root component with Supabase auth initialization.
 */
import { lazy, Suspense, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const EventsListPage = lazy(() => import("@/pages/EventsListPage"));
const EventDetailsPage = lazy(() => import("@/pages/EventDetailsPage"));
const CreateEventPage = lazy(() => import("@/pages/CreateEventPage"));
const MyEventsPage = lazy(() => import("@/pages/MyEventsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, isLoading } = useAuthStore();
  useEffect(() => { initialize(); }, [initialize]);
  if (isLoading) return <LoadingSpinner />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthInitializer>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<EventsListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route element={<AppLayout />}>
                <Route path="/events" element={<EventsListPage />} />
                <Route path="/events/create" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/events/:id/edit" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
                <Route path="/my-events" element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
