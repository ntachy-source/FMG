import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { initNativeAndroid } from "@/lib/nativeBridge";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Licenses from "./pages/Licenses";
import Settings from "./pages/Settings";
import Invoices from "./pages/Invoices";
import Quotations from "./pages/Quotations";
import SalesHistory from "./pages/SalesHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NativeAndroidHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    initNativeAndroid((dest) => {
      if (typeof dest === "number") navigate(dest);
      else navigate(dest);
    });
  }, [navigate]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NativeAndroidHandler />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute requireRole="admin"><Inventory /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute requireRole="admin"><Reports /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="/quotations" element={<ProtectedRoute><Quotations /></ProtectedRoute>} />
            <Route path="/sales-history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
            <Route path="/licenses" element={<ProtectedRoute requireRole="admin"><Licenses /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
