
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface ProfileHeaderProps {
  handleLogout: () => void;
}

const ProfileHeader = ({ handleLogout }: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-500 mt-1">Manage your personal information and settings</p>
      </div>
      <Button 
        variant="outline"
        onClick={handleLogout}
        className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default ProfileHeader;
