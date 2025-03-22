import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import PersonalInfoForm from './PersonalInfoForm';
import AccountSettings from './AccountSettings';
import SecuritySettings from './SecuritySettings';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { clearAllTransactions } = useTransactions();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: localStorage.getItem('profile_phone') || '',
    address: localStorage.getItem('profile_address') || '',
    profileImage: localStorage.getItem('profile_image') || '',
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    address: false
  });
  
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

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
    localStorage.setItem('profile_address', profileData.address);
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
      address: false
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
    <div className="w-full max-w-6xl mx-auto py-4 animate-fade-in">
      <ProfileHeader 
        handleLogout={handleLogout} 
      />
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <ProfileSidebar 
          profileData={profileData}
          triggerFileInput={triggerFileInput}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
        />
        
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="personal" className="animate-scale-in">
            <TabsList className="mb-4 grid grid-cols-2 gap-1 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="personal" className="flex items-center gap-1 text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="animate-slide-up">
              <div className="space-y-6">
                <PersonalInfoForm 
                  profileData={profileData}
                  handleChange={handleChange}
                  handleSave={handleSave}
                  user={user}
                  isEditing={isEditing}
                  toggleEdit={toggleEdit}
                />
                
                <AccountSettings 
                  handleClearData={handleClearData}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="animate-slide-up">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
