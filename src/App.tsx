
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PinAuth from "./components/PinAuth";
import { AmountVisibilityProvider } from "./contexts/AmountVisibilityContext";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AmountVisibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isAuthenticated ? (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          ) : (
            <PinAuth onSuccess={() => setIsAuthenticated(true)} />
          )}
        </TooltipProvider>
      </AmountVisibilityProvider>
    </QueryClientProvider>
  );
};

export default App;
