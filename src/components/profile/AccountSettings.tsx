
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Globe, Trash, Bell, Info, FileText, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { downloadTextFile } from '@/lib/download-utils';
import projectDocumentation from '@/assets/project_documentation.txt';

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

  // State to track which tab is visible
  const [activeTab, setActiveTab] = useState<'preferences' | 'data' | 'documentation'>('preferences');

  const handleDownloadDocumentation = () => {
    fetch(projectDocumentation)
      .then(response => response.text())
      .then(text => {
        downloadTextFile(text, 'FinWise_Project_Documentation.txt');
        toast.success('Documentation downloaded successfully');
      })
      .catch(error => {
        console.error('Error downloading documentation:', error);
        toast.error('Failed to download documentation');
      });
  };

  return (
    <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'preferences' | 'data' | 'documentation')} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              <span>Data Management</span>
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="space-y-1">
                  <Label className="text-base flex items-center gap-2 text-gray-800">
                    <Globe className="h-4 w-4 text-teal-500" />
                    Currency
                  </Label>
                  <p className="text-sm text-gray-500">
                    Set your preferred currency for transactions
                  </p>
                </div>
                <Select onValueChange={handleCurrencyChange} defaultValue="INR">
                  <SelectTrigger className="w-[120px] border-teal-200 bg-white">
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
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="space-y-1">
                  <Label className="text-base flex items-center gap-2 text-gray-800">
                    <Bell className="h-4 w-4 text-teal-500" />
                    Notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive AI-powered alerts about account activity
                  </p>
                </div>
                <Switch 
                  defaultChecked 
                  onCheckedChange={handleNotificationToggle}
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>
            </div>
            
            <div className="p-5 bg-teal-50 rounded-lg border border-teal-100">
              <h4 className="font-medium text-teal-800 mb-2 flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-teal-700" />
                About FinWise
              </h4>
              <p className="text-teal-700 text-sm">
                FinWise - AI-Powered Personal Finance Tracker<br />
                Version 1.0.0
              </p>
              <p className="text-xs text-teal-600 mt-2">
                © 2023 FinWise. All rights reserved.
              </p>
            </div>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="p-5 bg-red-50 rounded-lg border border-red-100">
              <h4 className="font-medium text-red-800 mb-2 text-base">
                Delete Transaction Data
              </h4>
              <p className="text-red-600 text-sm mb-4">
                This action permanently deletes all your transaction data and cannot be undone.
                Your account information will remain intact.
              </p>
              <Button 
                variant="outline" 
                onClick={handleClearData} 
                className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear All Transaction Data
              </Button>
            </div>
          </TabsContent>
          
          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <div className="p-5 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2 text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-700" />
                Project Documentation
              </h4>
              <p className="text-blue-700 text-sm mb-4">
                This document contains detailed information about the FinWise project including its abstract, 
                architecture, functionality, and technical specifications.
              </p>
              <Button 
                variant="outline" 
                onClick={handleDownloadDocumentation} 
                className="border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Documentation
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 max-h-80 overflow-y-auto">
              <h5 className="font-medium text-gray-800 mb-3">Documentation Preview</h5>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                # FinWise - AI-Powered Personal Finance Management System

                ## ABSTRACT
                FinWise is an intelligent personal finance management application designed to help users track, analyze, and optimize their financial activities. Leveraging artificial intelligence and advanced data analytics, FinWise provides personalized insights and recommendations to improve users' financial health.

                ## PROJECT DESCRIPTION
                FinWise addresses the growing need for sophisticated yet user-friendly personal finance management tools in an increasingly complex financial landscape. The application combines transaction tracking, budgeting, financial analytics, and AI-powered insights in a cohesive platform accessible through web browsers.

                [... Download the full documentation for more details ...]
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
