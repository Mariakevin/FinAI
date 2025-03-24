
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4 text-teal-500" />
                Full Name
              </Label>
              {!isEditing.name ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleEdit('name')}
                  className="h-8 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
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
                className="border-teal-200 focus-visible:ring-teal-500 bg-white"
              />
            ) : (
              <div className="px-4 py-3 rounded-md bg-gray-50 text-gray-700 border border-gray-100">
                {profileData.name || 'Not specified'}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4 text-teal-500" />
                Email Address
              </Label>
              {!isEditing.email ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleEdit('email')}
                  className="h-8 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
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
                className="border-teal-200 focus-visible:ring-teal-500 bg-white"
              />
            ) : (
              <div className="px-4 py-3 rounded-md bg-gray-50 text-gray-700 border border-gray-100">
                {profileData.email || 'Not specified'}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 text-teal-500" />
                Phone Number
              </Label>
              {!isEditing.phone ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleEdit('phone')}
                  className="h-8 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
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
                className="border-teal-200 focus-visible:ring-teal-500 bg-white"
              />
            ) : (
              <div className="px-4 py-3 rounded-md bg-gray-50 text-gray-700 border border-gray-100">
                {profileData.phone || 'Not specified'}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 text-teal-500" />
                Address
              </Label>
              {!isEditing.address ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleEdit('address')}
                  className="h-8 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
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
                className="border-teal-200 focus-visible:ring-teal-500 bg-white"
              />
            ) : (
              <div className="px-4 py-3 rounded-md bg-gray-50 text-gray-700 border border-gray-100">
                {profileData.address || 'Not specified'}
              </div>
            )}
          </div>
        </div>
        
        {(isEditing.name || isEditing.email || isEditing.phone || isEditing.address) && (
          <Button onClick={handleSave} className="w-full sm:w-auto mt-4 bg-teal-600 hover:bg-teal-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}

        <div className="pt-6 border-t border-gray-200 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-teal-500" />
              <span className="font-medium text-gray-700">Password</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="h-8 px-3 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          
          {!showPasswordForm ? (
            <div className="px-4 py-3 rounded-md bg-gray-50 text-gray-700 border border-gray-100 mt-2">
              ••••••••
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm text-gray-700">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="border-gray-200 bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm text-gray-700">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="border-gray-200 bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm text-gray-700">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="border-gray-200 bg-white"
                />
              </div>
              
              <Button type="submit" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700">
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
