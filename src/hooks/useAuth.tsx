import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  canEdit: (resourceOwnerId?: string) => boolean;
  getUserDisplayName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up authentication state listener
  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Validate inputs
      if (!email || !password) {
        toast.error('Please enter email and password');
        return false;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Invalid email or password');
        return false;
      }
      
      if (data.user) {
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Login failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Validate inputs
      if (!email || !password) {
        toast.error('Please fill all fields');
        return false;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      
      // Password strength check
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return false;
      }
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0], // Use name if provided, or generate from email
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Registration failed');
        return false;
      }
      
      if (data.user) {
        toast.success('Registration successful!');
        return true;
      } else {
        toast.error('Registration failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed. Please try again.');
      } else {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  }, []);

  // Helper function to get user's display name from metadata
  const getUserDisplayName = useCallback((): string => {
    if (!user) return '';
    
    // Check for name in user_metadata
    if (user.user_metadata && user.user_metadata.name) {
      return user.user_metadata.name;
    }
    
    // Fallback to email if no name is set
    return user.email?.split('@')[0] || '';
  }, [user]);

  // Memoize this function to prevent unnecessary re-renders
  const canEdit = useCallback((resourceOwnerId?: string): boolean => {
    if (!user) return false;
    if (!resourceOwnerId) return true;
    return user.id === resourceOwnerId;
  }, [user]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user, 
    isLoading, 
    login, 
    register,
    logout,
    isAuthenticated: !!user,
    canEdit,
    getUserDisplayName
  }), [user, isLoading, login, register, logout, canEdit, getUserDisplayName]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
