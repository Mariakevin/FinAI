
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Wallet, CheckCircle2, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface UpiIntegrationProps {
  onUpiConnect: (upiId: string) => void;
  isConnected: boolean;
  connectedUpiId: string | null;
  isReadOnly?: boolean;
}

const UpiIntegration = ({ 
  onUpiConnect, 
  isConnected, 
  connectedUpiId,
  isReadOnly = false
}: UpiIntegrationProps) => {
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) {
      toast.error('Please sign in to connect UPI ID');
      navigate('/login');
      return;
    }
    
    if (!upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (example: name@upi)');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpiConnect(upiId);
    toast.success(`Successfully connected to UPI ID: ${upiId}`);
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    if (isReadOnly) {
      toast.error('Please sign in to disconnect UPI ID');
      navigate('/login');
      return;
    }
    
    onUpiConnect('');
    toast.success('UPI ID disconnected');
  };

  return (
    <Card className="border border-gray-200/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
          <Wallet className="h-5 w-5 mr-2 text-indigo-600" />
          UPI Integration
        </CardTitle>
        <CardDescription>Connect your UPI ID for automatic transaction tracking</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        {isConnected && connectedUpiId ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Connected UPI ID:</p>
                <p className="text-md font-semibold">{connectedUpiId}</p>
              </div>
            </div>
            
            {isReadOnly ? (
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full mt-2"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in to manage UPI
              </Button>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  onClick={handleDisconnect}
                  className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Disconnect UPI ID
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <Label htmlFor="upi-id" className="text-gray-700">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect UPI'}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpiIntegration;
