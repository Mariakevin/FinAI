
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';
import { Shield, HelpCircle } from 'lucide-react';

const SettingsPage = () => {
  const { clearAllTransactions } = useTransactions();
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your transaction data? This action cannot be undone.')) {
      clearAllTransactions();
      toast.success('All transaction data has been deleted');
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>
      
      <GlassCard className="transition-all duration-300 hover:shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Data Management
        </h3>
        
        <div className="space-y-8">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100 transition-all hover:bg-red-100/70">
            <h4 className="font-medium text-red-800 mb-2">Clear Transaction Data</h4>
            <p className="text-gray-600 text-sm mb-4">
              This will permanently delete all your transaction data. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleClearData}
              className="btn-hover-effect"
            >
              Clear All Data
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:bg-gray-100/70">
            <h4 className="font-medium text-gray-800 mb-2">Currency</h4>
            <p className="text-gray-600 text-sm">
              Your current currency is set to <span className="font-medium">Indian Rupees (₹)</span>.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 transition-all hover:bg-blue-100/70">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              About
            </h4>
            <p className="text-gray-600 text-sm">
              FinWise - Personal Finance Tracker<br />
              Version 1.0.0
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default SettingsPage;
