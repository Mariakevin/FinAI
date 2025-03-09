
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, MapPin, Phone, Save, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('profile_name') || '',
    email: localStorage.getItem('profile_email') || '',
    phone: localStorage.getItem('profile_phone') || '',
    address: localStorage.getItem('profile_address') || '',
    profileImage: localStorage.getItem('profile_image') || '',
  });
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('profile_name', profileData.name);
    localStorage.setItem('profile_email', profileData.email);
    localStorage.setItem('profile_phone', profileData.phone);
    localStorage.setItem('profile_address', profileData.address);
    localStorage.setItem('profile_image', profileData.profileImage);
    
    toast.success('Profile information updated successfully');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your transaction data? This action cannot be undone.')) {
      // Reuse the same logic from SettingsPage
      localStorage.removeItem('transactions');
      toast.success('All transaction data has been deleted');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button 
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profileData.profileImage || ''} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold">{profileData.name || 'Your Name'}</h2>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <Mail className="h-4 w-4" />
                {profileData.email || 'email@example.com'}
              </p>
              
              <div className="mt-6 w-full">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Input 
                  id="profileImage"
                  name="profileImage"
                  value={profileData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="personal">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          id="email" 
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          id="phone" 
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Your Phone"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          id="address" 
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Your Address"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSave}
                    className="w-full md:w-auto mt-4"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your application settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Preferences settings will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account and application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="pb-6 border-b border-gray-100">
                    <h4 className="font-medium text-gray-800 mb-2">Clear Transaction Data</h4>
                    <p className="text-gray-500 text-sm mb-4">
                      This will permanently delete all your transaction data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleClearData}>
                      Clear All Data
                    </Button>
                  </div>
                  
                  <div className="pb-6 border-b border-gray-100">
                    <h4 className="font-medium text-gray-800 mb-2">Currency</h4>
                    <p className="text-gray-500 text-sm mb-2">
                      Your current currency is set to Indian Rupees (₹).
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">About</h4>
                    <p className="text-gray-500 text-sm">
                      FinWise - Personal Finance Tracker<br />
                      Version 1.0.0
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
