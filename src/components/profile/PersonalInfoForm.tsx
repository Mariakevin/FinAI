import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, MapPin, Phone, Save, Pencil, X, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalInfoFormProps {
  profileData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  user: any;
  isEditing: {
    name: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
  };
  toggleEdit: (field: string) => void;
}

const PersonalInfoForm = ({ 
  profileData, 
  handleChange, 
  handleSave, 
  user,
  isEditing,
  toggleEdit
}: PersonalInfoFormProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
    setShowPasswordForm(false);
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="py-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <User className="h-5 w-5 text-blue-500" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Full Name
            </Label>
            {!isEditing.name ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('name')}
                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('name')}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            )}
          </div>
          {isEditing.name ? (
            <Input 
              id="name" 
              name="name" 
              value={profileData.name} 
              onChange={handleChange} 
              placeholder="Enter your full name"
              className="border-blue-200 focus:border-blue-400"
            />
          ) : (
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
              {profileData.name || 'Not specified'}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Email Address
            </Label>
            {!isEditing.email ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('email')}
                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('email')}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            )}
          </div>
          {isEditing.email ? (
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={profileData.email} 
              onChange={handleChange}
              placeholder="Enter your email address"
              className="border-blue-200 focus:border-blue-400"
            />
          ) : (
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
              {profileData.email || 'Not specified'}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              Phone Number
            </Label>
            {!isEditing.phone ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('phone')}
                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('phone')}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            )}
          </div>
          {isEditing.phone ? (
            <Input 
              id="phone" 
              name="phone" 
              value={profileData.phone} 
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="border-blue-200 focus:border-blue-400"
            />
          ) : (
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
              {profileData.phone || 'Not specified'}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Address
            </Label>
            {!isEditing.address ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('address')}
                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleEdit('address')}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            )}
          </div>
          {isEditing.address ? (
            <Input 
              id="address" 
              name="address" 
              value={profileData.address} 
              onChange={handleChange}
              placeholder="Enter your address"
              className="border-blue-200 focus:border-blue-400"
            />
          ) : (
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
              {profileData.address || 'Not specified'}
            </div>
          )}
        </div>
        
        {(isEditing.name || isEditing.email || isEditing.phone || isEditing.address) && (
          <Button onClick={handleSave} className="w-full sm:w-auto mt-4">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}

        <div className="pt-4 border-t border-gray-200 mt-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-500" />
              Password
            </Label>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          
          {!showPasswordForm ? (
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 mt-2">
              ••••••••
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 mt-3">
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
