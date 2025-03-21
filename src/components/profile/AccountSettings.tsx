
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface AccountSettingsProps {
  handleClearData: () => void;
  handleClearHistory: () => void;
}

const AccountSettings = ({ 
  handleClearData, 
  handleClearHistory 
}: AccountSettingsProps) => {
  return (
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
  );
};

export default AccountSettings;
