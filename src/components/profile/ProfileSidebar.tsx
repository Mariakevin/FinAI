
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Briefcase, Phone, Upload } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  occupation: string;
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
    <GlassCard className="p-0 overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-teal-500 to-blue-500">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative group cursor-pointer" onClick={triggerFileInput}>
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage src={profileData.profileImage || ''} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-3xl text-white">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-20 px-6 pb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileData.name || 'Your Name'}</h2>
        <p className="text-teal-600 flex items-center justify-center gap-2 mb-6 text-sm">
          <Mail className="h-4 w-4" />
          {profileData.email || 'email@example.com'}
        </p>
        
        <div className="space-y-3 mt-4 bg-teal-50/50 p-4 rounded-xl">
          <h3 className="font-medium text-teal-800 mb-2 text-sm">Contact Information</h3>
          
          {profileData.phone ? (
            <div className="flex items-center text-gray-700 text-sm bg-white p-3 rounded-lg shadow-sm">
              <Phone className="h-4 w-4 mr-3 text-teal-500" />
              {profileData.phone}
            </div>
          ) : (
            <div className="flex items-center text-gray-400 text-sm bg-white/80 p-3 rounded-lg">
              <Phone className="h-4 w-4 mr-3 text-gray-300" />
              No phone number
            </div>
          )}
          
          {profileData.occupation ? (
            <div className="flex items-center text-gray-700 text-sm bg-white p-3 rounded-lg shadow-sm">
              <Briefcase className="h-4 w-4 mr-3 text-teal-500" />
              {profileData.occupation}
            </div>
          ) : (
            <div className="flex items-center text-gray-400 text-sm bg-white/80 p-3 rounded-lg">
              <Briefcase className="h-4 w-4 mr-3 text-gray-300" />
              No occupation specified
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-400 mt-4 italic">
          Click on the avatar to upload a new profile picture
        </p>
      </div>
    </GlassCard>
  );
};

export default ProfileSidebar;
