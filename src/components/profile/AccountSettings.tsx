
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Globe, Trash, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AccountSettingsProps {
  handleClearData: () => void;
}

const AccountSettings = ({ 
  handleClearData 
}: AccountSettingsProps) => {
  const handleCurrencyChange = (value: string) => {
    toast.success(`Currency changed to ${value}`);
  };

  const handleNotificationToggle = (enabled: boolean) => {
    toast.success(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="py-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Shield className="h-5 w-5 text-blue-500" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Manage your account preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                Currency
              </Label>
              <p className="text-sm text-gray-500">
                Set your preferred currency for transactions
              </p>
            </div>
            <Select onValueChange={handleCurrencyChange} defaultValue="INR">
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Receive alerts about account activity
              </p>
            </div>
            <Switch 
              defaultChecked 
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
            <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Trash className="h-4 w-4" />
              Data Management
            </h4>
            <p className="text-red-600 text-xs sm:text-sm mb-3">
              This action permanently deletes your data and cannot be undone.
            </p>
            <Button 
              variant="outline" 
              onClick={handleClearData} 
              className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 text-xs sm:text-sm"
            >
              Clear All Transaction Data
            </Button>
          </div>
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
