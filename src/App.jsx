import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Learn from "./pages/Learn";
import Play from "./pages/Play";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * @param {{ children: import("react").ReactNode }} props
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

/* ✅ Router config with v7 future flags */
const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/auth", element: <Auth /> },
    {
      path: "/learn",
      element: (
        <ProtectedRoute>
          <Learn />
        </ProtectedRoute>
      ),
    },
    {
      path: "/play",
      element: (
        <ProtectedRoute>
          <Play />
        </ProtectedRoute>
      ),
    },
    {
      path: "/progress",
      element: (
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      ),
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider 
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
