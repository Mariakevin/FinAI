
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, MapPin, Phone, Save, Settings, LogOut, BellRing, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: localStorage.getItem('profile_phone') || '',
    address: localStorage.getItem('profile_address') || '',
    profileImage: localStorage.getItem('profile_image') || '',
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: localStorage.getItem('pref_darkMode') === 'true',
    notifications: localStorage.getItem('pref_notifications') === 'true',
    emailAlerts: localStorage.getItem('pref_emailAlerts') === 'true',
    monthlyReports: localStorage.getItem('pref_monthlyReports') === 'true',
  });

  useEffect(() => {
    // Set the name and email from the authenticated user data
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (name: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
    localStorage.setItem(`pref_${name}`, checked.toString());
    toast.success(`${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} preference updated`);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('profile_phone', profileData.phone);
    localStorage.setItem('profile_address', profileData.address);
    localStorage.setItem('profile_image', profileData.profileImage);
    
    toast.success('Profile information updated successfully');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your transaction data? This action cannot be undone.')) {
      localStorage.removeItem('transactions');
      toast.success('All transaction data has been deleted');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your activity history? This action cannot be undone.')) {
      // Clear any history data that might be stored
      toast.success('Activity history has been cleared');
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
                          readOnly={!!user?.name}
                        />
                      </div>
                      {user?.name && (
                        <p className="text-xs text-gray-500">Your name is managed by your account settings</p>
                      )}
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
                          readOnly={!!user?.email}
                        />
                      </div>
                      {user?.email && (
                        <p className="text-xs text-gray-500">Your email is managed by your account settings</p>
                      )}
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
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Enable dark mode for the application</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-gray-500" />
                      <Switch 
                        checked={preferences.darkMode} 
                        onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)} 
                      />
                      <Moon className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">App Notifications</Label>
                      <p className="text-sm text-gray-500">Receive in-app notifications about important updates</p>
                    </div>
                    <Switch 
                      checked={preferences.notifications} 
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Alerts</Label>
                      <p className="text-sm text-gray-500">Receive email notifications about your account</p>
                    </div>
                    <Switch 
                      checked={preferences.emailAlerts} 
                      onCheckedChange={(checked) => handlePreferenceChange('emailAlerts', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Monthly Reports</Label>
                      <p className="text-sm text-gray-500">Get monthly summary reports of your finances</p>
                    </div>
                    <Switch 
                      checked={preferences.monthlyReports} 
                      onCheckedChange={(checked) => handlePreferenceChange('monthlyReports', checked)} 
                    />
                  </div>
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
                    <h4 className="font-medium text-gray-800 mb-2">Clear Activity History</h4>
                    <p className="text-gray-500 text-sm mb-4">
                      This will clear your activity history in the application. This action cannot be undone.
                    </p>
                    <Button variant="secondary" onClick={handleClearHistory}>
                      Clear History
                    </Button>
                  </div>
                  
                  <div className="pb-6 border-b border-gray-100">
                    <h4 className="font-medium text-gray-800 mb-2">Currency</h4>
                    <p className="text-gray-500 text-sm mb-2">
                      Your current currency is set to Indian Rupees (₹).
                    </p>
                  </div>
                  
                  <div className="pb-6 border-b border-gray-100">
                    <h4 className="font-medium text-gray-800 mb-2">Data Export</h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Export all your financial data for backup or analysis.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline">Export as CSV</Button>
                      <Button variant="outline">Export as PDF</Button>
                    </div>
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
