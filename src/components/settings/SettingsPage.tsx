
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';

const SettingsPage = () => {
  const { clearAllTransactions } = useTransactions();
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your transaction data? This action cannot be undone.')) {
      clearAllTransactions();
      toast.success('All transaction data has been deleted');
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>
      
      <GlassCard>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Data Management</h3>
        
        <div className="space-y-6">
          <div className="pb-6 border-b border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2">Clear Transaction Data</h4>
            <p className="text-gray-500 text-sm mb-4">
              This will permanently delete all your transaction data. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleClearData}>
              Clear All Data
            </Button>
          </div>
          
          <div className="pb-6 border-b border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2">Currency</h4>
            <p className="text-gray-500 text-sm mb-2">
              Your current currency is set to Indian Rupees (₹).
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">About</h4>
            <p className="text-gray-500 text-sm">
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
