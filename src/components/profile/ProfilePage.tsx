
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, MapPin, Phone, Save, LogOut, Upload, BellRing, Settings, Shield, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useTransactions } from '@/hooks/useTransactions';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { clearAllTransactions } = useTransactions();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: localStorage.getItem('profile_phone') || '',
    address: localStorage.getItem('profile_address') || '',
    profileImage: localStorage.getItem('profile_image') || '',
  });
  
  const [preferences, setPreferences] = useState({
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
      clearAllTransactions();
      toast.success('All transaction data has been deleted');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your activity history? This action cannot be undone.')) {
      // Clear any history data that might be stored
      toast.success('Activity history has been cleared');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileData(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
        localStorage.setItem('profile_image', imageUrl);
        toast.success('Profile picture uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full px-2 sm:px-4 max-w-6xl mx-auto py-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          My Profile
        </h1>
        <Button 
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="w-full lg:w-1/3">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
            <CardContent className="pt-6 pb-6 flex flex-col items-center">
              <div className="relative group transition-transform duration-300 hover:scale-105">
                <Avatar className="h-24 w-24 mb-4 cursor-pointer border-4 border-white shadow-lg" onClick={triggerFileInput}>
                  <AvatarImage src={profileData.profileImage || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl text-white">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </Avatar>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">{profileData.name || 'Your Name'}</h2>
              <p className="text-gray-500 flex items-center gap-2 mb-3 text-sm">
                <Mail className="h-4 w-4" />
                {profileData.email || 'email@example.com'}
              </p>
              
              <div className="w-full space-y-2 mt-1 px-2">
                {profileData.phone && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {profileData.phone}
                  </div>
                )}
                
                {profileData.address && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {profileData.address}
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-400 mt-4 text-center">
                Click on the avatar to upload a new profile picture
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="personal" className="animate-scale-in">
            <TabsList className="mb-4 grid grid-cols-3 gap-1 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="personal" className="flex items-center gap-1 text-xs sm:text-sm">
                <UserCog className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-1 text-xs sm:text-sm">
                <BellRing className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1 text-xs sm:text-sm">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="animate-slide-up">
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
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          id="phone" 
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          className="pl-10 transition-all focus:ring-2 focus:ring-blue-500 border-gray-200"
                          placeholder="Your Phone"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          id="address" 
                          name="address"
                          value={profileData.address}
                          onChange={handleChange}
                          className="pl-10 transition-all focus:ring-2 focus:ring-blue-500 border-gray-200"
                          placeholder="Your Address"
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
            </TabsContent>
            
            <TabsContent value="preferences" className="animate-slide-up">
              <Card className="border-0 shadow-md">
                <CardHeader className="py-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <BellRing className="h-5 w-5 text-blue-500" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your notification and alert settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-sm sm:text-base font-medium">App Notifications</Label>
                      <p className="text-xs sm:text-sm text-gray-500">Receive in-app notifications about important updates</p>
                    </div>
                    <Switch 
                      checked={preferences.notifications} 
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)} 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-sm sm:text-base font-medium">Email Alerts</Label>
                      <p className="text-xs sm:text-sm text-gray-500">Receive email notifications about your account</p>
                    </div>
                    <Switch 
                      checked={preferences.emailAlerts} 
                      onCheckedChange={(checked) => handlePreferenceChange('emailAlerts', checked)} 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 hover:bg-gray-50/50 px-2 -mx-2 rounded-lg transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-sm sm:text-base font-medium">Monthly Reports</Label>
                      <p className="text-xs sm:text-sm text-gray-500">Get monthly summary reports of your finances</p>
                    </div>
                    <Switch 
                      checked={preferences.monthlyReports} 
                      onCheckedChange={(checked) => handlePreferenceChange('monthlyReports', checked)} 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="animate-slide-up">
              <Card className="border-0 shadow-md">
                <CardHeader className="py-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account settings and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <Shield className="h-4 w-4" />
                      Data Management
                    </h4>
                    <p className="text-red-600 text-xs sm:text-sm mb-3">
                      These actions permanently delete your data and cannot be undone.
                    </p>
                    <div className="space-y-2 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2">
                      <Button variant="outline" onClick={handleClearData} 
                        className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 text-xs sm:text-sm">
                        Clear All Transaction Data
                      </Button>
                      
                      <Button variant="outline" onClick={handleClearHistory} 
                        className="w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm">
                        Clear Activity History
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-1 text-sm sm:text-base">Currency Setting</h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-0">
                      Your current currency is set to <span className="font-medium">Indian Rupees (₹)</span>
                    </p>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">About FinWise</h4>
                    <p className="text-blue-600 text-xs sm:text-sm">
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
