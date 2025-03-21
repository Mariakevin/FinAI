
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, MapPin, Phone, Upload } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
}

interface ProfileSidebarProps {
  profileData: ProfileData;
  triggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileSidebar = ({ 
  profileData, 
  triggerFileInput, 
  fileInputRef, 
  handleImageUpload 
}: ProfileSidebarProps) => {
  return (
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
  );
};

export default ProfileSidebar;
