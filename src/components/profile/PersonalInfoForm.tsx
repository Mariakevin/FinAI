
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, MapPin, Phone, Save, Pencil } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
}

interface PersonalInfoFormProps {
  profileData: ProfileData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  user: any;
}

const PersonalInfoForm = ({ 
  profileData, 
  handleChange, 
  handleSave,
  user 
}: PersonalInfoFormProps) => {
  const [editMode, setEditMode] = useState({
    phone: false,
    address: false
  });

  const toggleEdit = (field: 'phone' | 'address') => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="pl-10 transition-all focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="Your Name"
                readOnly={!!user?.name}
              />
            </div>
            {user?.name && (
              <p className="text-xs text-gray-500">Your name is managed by your account settings</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                id="email" 
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="pl-10 transition-all focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="email@example.com"
                readOnly={!!user?.email}
              />
            </div>
            {user?.email && (
              <p className="text-xs text-gray-500">Your email is managed by your account settings</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleEdit('phone')}
                className="h-7 px-2 text-xs flex gap-1 items-center text-blue-600"
              >
                <Pencil className="h-3 w-3" />
                {editMode.phone ? 'Done' : 'Edit'}
              </Button>
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                id="phone" 
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className={`pl-10 transition-all focus:ring-2 focus:ring-blue-500 border-gray-200 ${
                  editMode.phone ? 'bg-white' : 'bg-gray-50'
                }`}
                placeholder="Your Phone"
                readOnly={!editMode.phone}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleEdit('address')}
                className="h-7 px-2 text-xs flex gap-1 items-center text-blue-600"
              >
                <Pencil className="h-3 w-3" />
                {editMode.address ? 'Done' : 'Edit'}
              </Button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                id="address" 
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className={`pl-10 transition-all focus:ring-2 focus:ring-blue-500 border-gray-200 ${
                  editMode.address ? 'bg-white' : 'bg-gray-50'
                }`}
                placeholder="Your Address"
                readOnly={!editMode.address}
              />
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSave}
          className="mt-2 btn-hover-effect w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
