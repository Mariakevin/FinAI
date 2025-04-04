
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import PersonalInfoForm from './PersonalInfoForm';
import AccountSettings from './AccountSettings';

const ProfilePage = () => {
  const { user, logout, isAuthenticated, getUserDisplayName } = useAuth();
  const { clearAllTransactions } = useTransactions();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: user?.email || '',
    phone: localStorage.getItem('profile_phone') || '',
    occupation: localStorage.getItem('profile_occupation') || '',
    profileImage: localStorage.getItem('profile_image') || '',
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    occupation: false
  });
  
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: getUserDisplayName(),
        email: user.email || prev.email
      }));
    }
  }, [user, getUserDisplayName]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEdit = (field: string) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    localStorage.setItem('profile_phone', profileData.phone);
    localStorage.setItem('profile_occupation', profileData.occupation);
    localStorage.setItem('profile_image', profileData.profileImage);
    
    const users = JSON.parse(localStorage.getItem('finwise_users') || '[]');
    if (user && users.length) {
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            name: profileData.name,
            email: profileData.email
          };
        }
        return u;
      });
      
      localStorage.setItem('finwise_users', JSON.stringify(updatedUsers));
      
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email
      };
      
      localStorage.setItem('finwise_user', JSON.stringify(updatedUser));
    }
    
    setIsEditing({
      name: false,
      email: false,
      phone: false,
      occupation: false
    });
    
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
    <div className="w-full max-w-7xl mx-auto py-6 px-4 animate-fade-in">
      <ProfileHeader 
        handleLogout={handleLogout} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-1">
          <ProfileSidebar 
            profileData={profileData}
            triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
          />
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="animate-scale-in">
            <TabsList className="w-full mb-6 grid grid-cols-2 bg-muted/20 p-1 rounded-xl">
              <TabsTrigger value="personal" className="flex items-center gap-2 py-3 rounded-lg">
                <User className="h-4 w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 py-3 rounded-lg">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="animate-slide-up">
              <PersonalInfoForm 
                profileData={profileData}
                handleChange={handleChange}
                handleSave={handleSave}
                user={user}
                isEditing={isEditing}
                toggleEdit={toggleEdit}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="animate-slide-up">
              <AccountSettings 
                handleClearData={handleClearData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
