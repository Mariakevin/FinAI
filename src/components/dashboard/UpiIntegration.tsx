
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRightCircle, LogIn, Wallet, Info, CheckCircle2, ShieldCheck, Clock, Calendar } from 'lucide-react';
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
        <CardDescription>Connect your UPI ID for automated transaction tracking</CardDescription>
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
            
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-blue-50 rounded-md flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-800">Secure Connection</p>
                  <p className="text-xs text-blue-600">End-to-end encrypted</p>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-md flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-800">Real-time Sync</p>
                  <p className="text-xs text-purple-600">Automatic updates</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-md border border-blue-100">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-700">All your UPI transactions</p>
                  <p className="text-xs text-blue-600 mt-1">View and analyze your UPI payments in one place. Regular transactions are categorized automatically.</p>
                </div>
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
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Last synced today</span>
              </div>
              <Button variant="link" size="sm" className="text-xs p-0 h-auto text-blue-600">View History</Button>
            </div>
          </motion.div>
        ) : (
          isReadOnly ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ArrowRightCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Connect your UPI ID</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Track all your UPI transactions in one place and get AI-powered insights.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-800">Secure</p>
                    <p className="text-xs text-gray-600">Bank-level security</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-800">Automated</p>
                    <p className="text-xs text-gray-600">No manual entry</p>
                  </div>
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in to connect UPI
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleConnect} className="space-y-4">
                <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100/50 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Connect any UPI ID
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Track transactions from PhonePe, Google Pay, Paytm, or any other UPI app automatically.
                      </p>
                      <p className="text-xs text-blue-800 mt-3 font-medium">
                        Try these example IDs for testing:
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100">yourname@hdfc</span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-blue-100">business@paytm</span>
                      </div>
                    </div>
                  </div>
                </div>
              
                <div>
                  <Label htmlFor="upi-id" className="text-gray-700">UPI ID</Label>
                  <Input
                    id="upi-id"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Enter your UPI ID in format: username@bankname
                  </p>
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
                
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  {['PhonePe', 'GooglePay', 'Paytm'].map((app) => (
                    <div key={app} className="text-xs text-gray-500">
                      <div className="h-8 w-8 mx-auto rounded-full bg-gray-100 mb-1"></div>
                      {app}
                    </div>
                  ))}
                </div>
              </form>
            </motion.div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default UpiIntegration;
