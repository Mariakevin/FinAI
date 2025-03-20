
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { HelmetProvider } from 'react-helmet-async';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Budget from '@/pages/Budget';
import AiInsights from '@/pages/AiInsights';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

import './App.css';

const queryClient = new QueryClient();

// AuthWrapper component that provides authentication state without blocking access
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Clone the children with isAuthenticated prop
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
      <Route path="/transactions" element={<AuthWrapper><Transactions /></AuthWrapper>} />
      <Route path="/budget" element={<AuthWrapper><Budget /></AuthWrapper>} />
      <Route path="/ai-insights" element={<AuthWrapper><AiInsights /></AuthWrapper>} />
      <Route path="/profile" element={<AuthWrapper><Profile /></AuthWrapper>} />
      <Route path="/settings" element={<AuthWrapper><Settings /></AuthWrapper>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <HelmetProvider>
            <Router>
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </Router>
          </HelmetProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
