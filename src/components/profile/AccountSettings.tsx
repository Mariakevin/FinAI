
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Globe, Trash, Bell, Info, BarChart, Code } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  // State to track which diagram is visible
  const [activeTab, setActiveTab] = useState<'preferences' | 'diagrams' | 'data'>('preferences');

  return (
    <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'preferences' | 'diagrams' | 'data')} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="diagrams" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Diagrams</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              <span>Data Management</span>
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
                    Receive alerts about account activity
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
                FinWise - Personal Finance Tracker<br />
                Version 1.0.0
              </p>
              <p className="text-xs text-teal-600 mt-2">
                © 2023 FinWise. All rights reserved.
              </p>
            </div>
          </TabsContent>

          {/* Diagrams Tab */}
          <TabsContent value="diagrams" className="space-y-6">
            <div className="space-y-6">
              {/* App Architecture Diagram */}
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5 text-teal-500" />
                  App Architecture
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg overflow-x-auto">
                  {/* SVG Architecture Diagram */}
                  <svg width="100%" height="300" viewBox="0 0 800 300" className="mx-auto">
                    {/* App Layers */}
                    <rect x="50" y="50" width="700" height="50" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                    <text x="400" y="80" textAnchor="middle" fill="#0284c7" fontSize="16" fontWeight="bold">UI Components</text>
                    
                    <rect x="50" y="120" width="700" height="50" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                    <text x="400" y="150" textAnchor="middle" fill="#2563eb" fontSize="16" fontWeight="bold">Hooks & Context</text>
                    
                    <rect x="50" y="190" width="700" height="50" rx="5" fill="#ccfbf1" stroke="#0d9488" strokeWidth="2" />
                    <text x="400" y="220" textAnchor="middle" fill="#0d9488" fontSize="16" fontWeight="bold">Local Storage & API</text>
                    
                    {/* Connection Lines */}
                    <line x1="400" y1="100" x2="400" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="400" y1="170" x2="400" y2="190" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                    
                    {/* Component Boxes */}
                    <rect x="100" y="20" width="120" height="30" rx="15" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" />
                    <text x="160" y="40" textAnchor="middle" fill="#0f766e" fontSize="12">Dashboard</text>
                    
                    <rect x="250" y="20" width="120" height="30" rx="15" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" />
                    <text x="310" y="40" textAnchor="middle" fill="#0f766e" fontSize="12">Transactions</text>
                    
                    <rect x="400" y="20" width="120" height="30" rx="15" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" />
                    <text x="460" y="40" textAnchor="middle" fill="#0f766e" fontSize="12">Budget</text>
                    
                    <rect x="550" y="20" width="120" height="30" rx="15" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" />
                    <text x="610" y="40" textAnchor="middle" fill="#0f766e" fontSize="12">Profile</text>
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  The architecture diagram shows the main layers of the FinWise application.
                </p>
              </div>
              
              {/* UML Class Diagram */}
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-teal-500" />
                  UML Class Diagram
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg overflow-x-auto">
                  {/* SVG UML Diagram */}
                  <svg width="100%" height="350" viewBox="0 0 800 350" className="mx-auto">
                    {/* User Class */}
                    <rect x="100" y="50" width="180" height="120" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                    <rect x="100" y="50" width="180" height="30" rx="5" fill="#e0f2fe" stroke="#64748b" strokeWidth="2" />
                    <text x="190" y="70" textAnchor="middle" fill="#0369a1" fontSize="14" fontWeight="bold">User</text>
                    <line x1="100" y1="80" x2="280" y2="80" stroke="#64748b" strokeWidth="2" />
                    <text x="110" y="100" fill="#334155" fontSize="12">- id: string</text>
                    <text x="110" y="120" fill="#334155" fontSize="12">- name: string</text>
                    <text x="110" y="140" fill="#334155" fontSize="12">- email: string</text>
                    <line x1="100" y1="150" x2="280" y2="150" stroke="#64748b" strokeWidth="2" />
                    <text x="110" y="170" fill="#334155" fontSize="12">+ login(): void</text>
                    
                    {/* Transaction Class */}
                    <rect x="500" y="50" width="180" height="150" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                    <rect x="500" y="50" width="180" height="30" rx="5" fill="#e0f2fe" stroke="#64748b" strokeWidth="2" />
                    <text x="590" y="70" textAnchor="middle" fill="#0369a1" fontSize="14" fontWeight="bold">Transaction</text>
                    <line x1="500" y1="80" x2="680" y2="80" stroke="#64748b" strokeWidth="2" />
                    <text x="510" y="100" fill="#334155" fontSize="12">- id: string</text>
                    <text x="510" y="120" fill="#334155" fontSize="12">- amount: number</text>
                    <text x="510" y="140" fill="#334155" fontSize="12">- category: string</text>
                    <text x="510" y="160" fill="#334155" fontSize="12">- date: Date</text>
                    <text x="510" y="180" fill="#334155" fontSize="12">- userId: string</text>
                    <line x1="500" y1="190" x2="680" y2="190" stroke="#64748b" strokeWidth="2" />
                    
                    {/* Budget Class */}
                    <rect x="100" y="230" width="180" height="120" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                    <rect x="100" y="230" width="180" height="30" rx="5" fill="#e0f2fe" stroke="#64748b" strokeWidth="2" />
                    <text x="190" y="250" textAnchor="middle" fill="#0369a1" fontSize="14" fontWeight="bold">Budget</text>
                    <line x1="100" y1="260" x2="280" y2="260" stroke="#64748b" strokeWidth="2" />
                    <text x="110" y="280" fill="#334155" fontSize="12">- category: string</text>
                    <text x="110" y="300" fill="#334155" fontSize="12">- limit: number</text>
                    <text x="110" y="320" fill="#334155" fontSize="12">- userId: string</text>
                    <line x1="100" y1="330" x2="280" y2="330" stroke="#64748b" strokeWidth="2" />
                    
                    {/* Profile Class */}
                    <rect x="500" y="230" width="180" height="120" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                    <rect x="500" y="230" width="180" height="30" rx="5" fill="#e0f2fe" stroke="#64748b" strokeWidth="2" />
                    <text x="590" y="250" textAnchor="middle" fill="#0369a1" fontSize="14" fontWeight="bold">Profile</text>
                    <line x1="500" y1="260" x2="680" y2="260" stroke="#64748b" strokeWidth="2" />
                    <text x="510" y="280" fill="#334155" fontSize="12">- phone: string</text>
                    <text x="510" y="300" fill="#334155" fontSize="12">- address: string</text>
                    <text x="510" y="320" fill="#334155" fontSize="12">- imageUrl: string</text>
                    <line x1="500" y1="330" x2="680" y2="330" stroke="#64748b" strokeWidth="2" />
                    
                    {/* Relationship Lines */}
                    <line x1="280" y1="110" x2="500" y2="110" stroke="#64748b" strokeWidth="2" />
                    <text x="390" y="100" textAnchor="middle" fill="#64748b" fontSize="12">1</text>
                    <text x="480" y="100" textAnchor="middle" fill="#64748b" fontSize="12">*</text>
                    <polygon points="490,110 500,110 495,105 495,115" fill="#64748b" />
                    
                    <line x1="190" y1="170" x2="190" y2="230" stroke="#64748b" strokeWidth="2" />
                    <text x="180" y="200" textAnchor="middle" fill="#64748b" fontSize="12">1</text>
                    <text x="200" y="220" textAnchor="middle" fill="#64748b" fontSize="12">*</text>
                    <polygon points="190,220 190,230 185,225 195,225" fill="#64748b" />
                    
                    <line x1="280" y1="280" x2="500" y2="280" stroke="#64748b" strokeWidth="2" />
                    <text x="290" y="270" textAnchor="middle" fill="#64748b" fontSize="12">1</text>
                    <text x="490" y="270" textAnchor="middle" fill="#64748b" fontSize="12">1</text>
                    <polygon points="490,280 500,280 495,275 495,285" fill="#64748b" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  The UML class diagram shows the relationships between the main entities in the FinWise application.
                </p>
              </div>
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
