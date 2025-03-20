
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  showStrength?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  value,
  onChange,
  label = "Password",
  placeholder = "••••••••",
  showStrength = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const calculateStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety check
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password)) strength += 25; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special chars
    
    return strength;
  };
  
  const getStrengthColor = (strength: number): string => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthLabel = (strength: number): string => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };
  
  const passwordStrength = calculateStrength(value);
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {showStrength && value && (
        <div className="mt-2 space-y-1">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`} 
              style={{ width: `${passwordStrength}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 flex justify-between">
            <span>Password strength:</span> 
            <span className={`font-medium ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
              {getStrengthLabel(passwordStrength)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
