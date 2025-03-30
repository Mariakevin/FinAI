import React, { useState, useEffect, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('finwise_user');
    const rememberMe = localStorage.getItem('finwise_remember_me') === 'true';
    
    if (storedUser && rememberMe) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('finwise_user');
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    
    // Store remember me preference
    localStorage.setItem('finwise_remember_me', rememberMe ? 'true' : 'false');
    
    try {
      const users = JSON.parse(localStorage.getItem('finwise_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        
        // Only store user in localStorage if rememberMe is true
        if (rememberMe) {
          localStorage.setItem('finwise_user', JSON.stringify(userWithoutPassword));
        }
        
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Something went wrong. Please try again.' 
      };
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('finwise_users') || '[]');
      
      // Check if user already exists
      const userExists = users.some((u: any) => u.email === email);
      
      if (userExists) {
        setIsLoading(false);
        return { 
          success: false, 
          error: 'User with this email already exists' 
        };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem('finwise_users', JSON.stringify(users));
      
      // Login the user (without password in the state)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('finwise_user', JSON.stringify(userWithoutPassword));
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Something went wrong. Please try again.' 
      };
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('finwise_user');
    // Don't remove remember_me preference to maintain the setting
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
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
