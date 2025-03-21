
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Fingerprint, KeyRound, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // Simple password validation
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // In a real app, this would send the password change to an API
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Lock className="h-5 w-5 text-blue-500" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            
            <Button type="submit" className="w-full sm:w-auto">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Fingerprint className="h-5 w-5 text-blue-500" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-medium text-gray-800">
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </h4>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled 
                  ? 'Your account is protected with two-factor authentication' 
                  : 'Enable two-factor authentication for additional security'}
              </p>
            </div>
            <Button 
              onClick={toggleTwoFactor}
              variant={twoFactorEnabled ? "outline" : "default"}
              className={twoFactorEnabled 
                ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" 
                : "bg-green-600 hover:bg-green-700"}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <KeyRound className="h-5 w-5 text-blue-500" />
            Security Log
          </CardTitle>
          <CardDescription>
            Review recent account activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Login successful', date: 'Today, 10:45 AM', device: 'Chrome on Windows' },
              { action: 'Password changed', date: '3 days ago', device: 'Mobile App' },
              { action: 'Login successful', date: '1 week ago', device: 'Safari on Mac' }
            ].map((item, index) => (
              <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="space-y-1">
                  <div className="font-medium text-gray-800 text-sm">{item.action}</div>
                  <div className="text-xs text-gray-500">{item.date} • {item.device}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-amber-50">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-amber-800">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Use a strong, unique password for your financial accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Enable two-factor authentication for all sensitive accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Regularly check your account for suspicious activities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Never share your login credentials with anyone</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
