import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Speaking from "./pages/Speaking.tsx";
import AuditOS from "./pages/AuditOS.tsx";
import Investors from "./pages/Investors.tsx";
import Booking from "./pages/Booking.tsx";
import BonusCeti from "./pages/BonusCeti.tsx";
import { VideoProvider } from "@/components/VideoContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VideoProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/audit-os" element={<AuditOS />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/bonus-ceti" element={<BonusCeti />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VideoProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
