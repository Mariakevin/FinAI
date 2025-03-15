
import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';
import { 
  Shield, 
  HelpCircle, 
  Globe, 
  PenTool, 
  Moon, 
  Sun, 
  Info, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

const SettingsPage = () => {
  const { clearAllTransactions } = useTransactions();
  const [themeMode, setThemeMode] = useState<'light' | 'system'>('light');
  const [currency, setCurrency] = useState('INR');
  
  const handleClearData = () => {
    clearAllTransactions();
    toast.success('All transaction data has been deleted');
  };

  const handleThemeChange = (mode: 'light' | 'system') => {
    setThemeMode(mode);
    toast.success(`Theme set to ${mode} mode`);
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Customize your experience and manage account preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="transition-all duration-300 hover:shadow-md overflow-visible">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:bg-gray-100/70">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                      <PenTool className="h-4 w-4 text-gray-600" />
                      Currency
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Choose your preferred currency for the application
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Indian Rupees (₹)</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:bg-gray-100/70">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                      {themeMode === 'light' ? (
                        <Sun className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Moon className="h-4 w-4 text-blue-500" />
                      )}
                      Theme
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Choose between light and system theme
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleThemeChange('light')}
                      className={`${themeMode === 'light' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
                    >
                      <Sun className="h-4 w-4 mr-1" /> Light
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleThemeChange('system')}
                      className={`${themeMode === 'system' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
                    >
                      <Moon className="h-4 w-4 mr-1" /> System
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="transition-all duration-300 hover:shadow-md overflow-visible">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Data Management
            </h3>
            
            <div className="space-y-6">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100 transition-all hover:bg-red-100/70 cursor-pointer">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Clear Transaction Data
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      This will permanently delete all your transaction data. This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      className="btn-hover-effect"
                    >
                      Clear All Data
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Confirm Data Deletion
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete all your transaction data? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-2 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      variant="destructive" 
                      onClick={handleClearData}
                    >
                      Yes, Delete All Data
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </GlassCard>
        </div>
        
        <div>
          <GlassCard className="transition-all duration-300 hover:shadow-md overflow-visible">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              Help & Support
            </h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-100">
                <AccordionTrigger className="py-3 text-gray-800 hover:text-blue-600 hover:no-underline">
                  How do I add a transaction?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm pb-4">
                  Go to the Transactions page by clicking on "Transactions" in the navigation menu. 
                  Click on the "Add Transaction" button, fill in the transaction details, and click "Save".
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-100">
                <AccordionTrigger className="py-3 text-gray-800 hover:text-blue-600 hover:no-underline">
                  How do I create a budget?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm pb-4">
                  Navigate to the Budget page from the navigation menu. Click on "Create Budget", 
                  select a category, set a budget amount, and save your budget.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-100">
                <AccordionTrigger className="py-3 text-gray-800 hover:text-blue-600 hover:no-underline">
                  What is UPI integration?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm pb-4">
                  UPI integration allows you to link your UPI ID to automatically track transactions
                  made through your UPI account. Connect your UPI ID in the Dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">About</h4>
              </div>
              <p className="text-gray-600 text-sm">
                FinWise - Personal Finance Tracker<br />
                Version 1.0.1
              </p>
              <p className="text-xs text-gray-500 mt-2">
                © {new Date().getFullYear()} FinWise. All rights reserved.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
