
import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  provider?: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  canEdit: (resourceOwnerId?: string) => boolean;
}

const STORAGE_KEY = 'finwise_user';
const USERS_STORAGE_KEY = 'finwise_users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on initial mount only
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Memoize this function to prevent unnecessary re-renders
  const checkEmailExists = useCallback((email: string): boolean => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      if (!Array.isArray(users)) return false;
      
      return users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    } catch (e) {
      console.error('Error checking email:', e);
      return false;
    }
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
      
      // Simulating a login delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user exists (in local storage)
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const foundUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (foundUser && foundUser.password === password) {
        // Create user session without password
        const userSession: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          provider: 'email' as const
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
        setUser(userSession);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid email or password');
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
      
      // Simulating a register delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get existing users
      let users = [];
      try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        users = storedUsers ? JSON.parse(storedUsers) : [];
        if (!Array.isArray(users)) users = [];
      } catch (e) {
        console.error('Error parsing stored users, resetting:', e);
        users = [];
      }
      
      // Check if email already exists (case insensitive)
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error('Email already registered');
        return false;
      }
      
      // Use provided name or generate from email
      const userName = name ? name.trim() : email.split('@')[0];
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name: userName,
        email,
        password,
        provider: 'email' as const,
        createdAt: new Date().toISOString()
      };
      
      // Save to "database"
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Create user session without password
      const userSession: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        provider: 'email' as const
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
      setUser(userSession);
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

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
    canEdit
  }), [user, isLoading, login, register, logout, canEdit]);

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
