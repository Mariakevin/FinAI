
import { useState, useEffect, createContext, useContext } from 'react';
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
  register: (email: string, password: string) => Promise<boolean>;
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

  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('User loaded from storage:', parsedUser);
        } else {
          console.log('No user found in storage');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear potentially corrupt data
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const checkEmailExists = (email: string): boolean => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      if (!Array.isArray(users)) return false;
      
      return users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    } catch (e) {
      console.error('Error checking email:', e);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
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
        console.log('Login successful:', userSession);
        toast.success('Login successful!');
        return true;
      } else {
        console.log('Invalid credentials');
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
  };

  const register = async (email: string, password: string): Promise<boolean> => {
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
        console.log('Email already registered');
        toast.error('Email already registered');
        return false;
      }
      
      // Generate a username from email
      const name = email.split('@')[0];
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        password,
        provider: 'email' as const,
        createdAt: new Date().toISOString()
      };
      
      // Save to "database"
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      console.log('User registered and saved to storage:', newUser);
      
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
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    console.log('User logged out');
    toast.success('Logged out successfully');
  };

  // Function to determine if user can edit a resource
  const canEdit = (resourceOwnerId?: string): boolean => {
    // If not authenticated, can't edit anything
    if (!user) return false;
    
    // If no resource owner specified, just check if authenticated
    if (!resourceOwnerId) return true;
    
    // Check if current user is the owner of the resource
    return user.id === resourceOwnerId;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register,
      logout,
      isAuthenticated: !!user,
      canEdit
    }}>
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
