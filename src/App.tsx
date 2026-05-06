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
import BonusCetiDescargas from "./pages/BonusCetiDescargas.tsx";
import BonusCetiDescargasPreview from "./pages/BonusCetiDescargasPreview.tsx";
import BonusCetiAdmin from "./pages/BonusCetiAdmin.tsx";
import Benefits from "./pages/Benefits.tsx";
import BenefitsPreview from "./pages/BenefitsPreview.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import { VideoProvider } from "@/components/VideoContext";
import { LEGACY_REDIRECTS, Redirect301 } from "@/components/LegacyRedirects";

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
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/benefits/preview" element={<BenefitsPreview />} />
            <Route path="/benefits/:id/preview" element={<BenefitsPreview />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/bonus-ceti" element={<BonusCeti />} />
            <Route path="/bonus-ceti-descargas" element={<BonusCetiDescargas />} />
            <Route path="/bonus-ceti-descargas/preview" element={<BonusCetiDescargasPreview />} />
            <Route path="/bonus-ceti-admin" element={<BonusCetiAdmin />} />
            {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
              <Route key={from} path={from} element={<Redirect301 to={to} />} />
            ))}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VideoProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
