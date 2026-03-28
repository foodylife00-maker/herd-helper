import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const HerdProjection = lazy(() => import("./pages/HerdProjection"));
const EventLogging = lazy(() => import("./pages/EventLogging"));
const ComparisonReport = lazy(() => import("./pages/ComparisonReport"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DemoProjection = lazy(() => import("./pages/DemoProjection"));
const DemoEvents = lazy(() => import("./pages/DemoEvents"));
const DemoComparison = lazy(() => import("./pages/DemoComparison"));

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading…</div>}>
              <Routes>
                <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
                <Route path="/" element={<Home />} />
                <Route path="/herd-projection" element={<ProtectedRoute><HerdProjection /></ProtectedRoute>} />
                <Route path="/event-logging" element={<ProtectedRoute><EventLogging /></ProtectedRoute>} />
                <Route path="/comparison-report" element={<ProtectedRoute><ComparisonReport /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
