
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
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'finwise_user';

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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API
      // Simulating a login delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation for demo
      if (email && password) {
        // Check if user exists (in local storage)
        const users = JSON.parse(localStorage.getItem('finwise_users') || '[]');
        const foundUser = users.find((u: any) => u.email === email);
        
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
          console.log('Invalid credentials. Users in storage:', users);
          toast.error('Invalid email or password');
          return false;
        }
      } else {
        toast.error('Please enter email and password');
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

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth flow with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock Google user with properly typed provider
      const googleUser: User = {
        id: `google_${Math.random().toString(36).substring(2, 9)}`,
        name: 'Google User',
        email: `user${Math.floor(Math.random() * 10000)}@gmail.com`,
        photoUrl: 'https://placehold.co/200x200',
        provider: 'google' // Explicitly typed as 'google' literal
      };
      
      // Get existing users
      let users = [];
      try {
        const storedUsers = localStorage.getItem('finwise_users');
        users = storedUsers ? JSON.parse(storedUsers) : [];
        if (!Array.isArray(users)) users = [];
      } catch (e) {
        console.error('Error parsing stored users, resetting:', e);
        users = [];
      }
      
      // Check if Google user exists, if not create one
      const existingUser = users.find((u: any) => u.email === googleUser.email);
      
      if (!existingUser) {
        // Create new user without password (OAuth)
        users.push({
          ...googleUser,
          password: null // No password for OAuth users
        });
        
        localStorage.setItem('finwise_users', JSON.stringify(users));
        console.log('Google user registered and saved to storage:', googleUser);
      }
      
      // Create user session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
      setUser(googleUser);
      
      toast.success('Google login successful!');
      return true;
      
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulating a register delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (name && email && password) {
        // Get existing users
        let users = [];
        try {
          const storedUsers = localStorage.getItem('finwise_users');
          users = storedUsers ? JSON.parse(storedUsers) : [];
          if (!Array.isArray(users)) users = [];
        } catch (e) {
          console.error('Error parsing stored users, resetting:', e);
          users = [];
        }
        
        // Check if email already exists
        if (users.some((u: any) => u.email === email)) {
          console.log('Email already registered');
          toast.error('Email already registered');
          return false;
        }
        
        // Create new user
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          password,
          provider: 'email' as const
        };
        
        // Save to "database"
        users.push(newUser);
        localStorage.setItem('finwise_users', JSON.stringify(users));
        console.log('User registered and saved to storage:', newUser);
        console.log('All users:', users);
        
        // Create user session without password
        const userSession = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          provider: 'email' as const
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
        setUser(userSession);
        
        toast.success('Registration successful!');
        return true;
      } else {
        toast.error('Please fill all fields');
        return false;
      }
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user 
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
