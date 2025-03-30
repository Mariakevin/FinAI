
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRightCircle, LogIn, ClipboardCheck, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpiIntegrationProps {
  onUpiConnect: (upiId: string, transactionDetails?: boolean) => void;
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
  const [includeTransactionId, setIncludeTransactionId] = useState(true);
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
    
    onUpiConnect(upiId, includeTransactionId);
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

  const handleRefresh = async () => {
    if (isReadOnly) {
      toast.error('Please sign in to refresh UPI data');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    // Re-connect the same UPI ID to refresh data
    await new Promise(resolve => setTimeout(resolve, 1000));
    onUpiConnect(connectedUpiId || '', includeTransactionId);
    toast.success('UPI transactions refreshed');
    setIsLoading(false);
  };

  return (
    <Card className="border border-gray-200/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">UPI Integration</CardTitle>
        {!isConnected && (
          <CardDescription className="text-sm text-gray-500">
            Connect your UPI ID to track all your UPI transactions in one place
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isConnected && connectedUpiId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowRightCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Connected UPI ID:</p>
                <p className="text-md font-semibold">{connectedUpiId}</p>
              </div>
            </div>
            
            {!isReadOnly && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleDisconnect}
                  className="w-full"
                  size="sm"
                >
                  Disconnect UPI
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="w-full"
                  size="sm"
                  disabled={isLoading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {isLoading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              </div>
            )}
            
            {isReadOnly && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in to manage UPI
              </Button>
            )}
          </div>
        ) : (
          isReadOnly ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Connect your UPI ID to track all your UPI transactions in one place.
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in to connect UPI
              </Button>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi-id">Enter your UPI ID</Label>
                <Input
                  id="upi-id"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  required
                />
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="include-transaction-id"
                    checked={includeTransactionId}
                    onChange={(e) => setIncludeTransactionId(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <Label 
                    htmlFor="include-transaction-id" 
                    className="text-xs text-gray-600 cursor-pointer"
                  >
                    Include transaction ID details
                  </Label>
                </div>
                <p className="text-xs text-gray-500 flex items-center">
                  <ClipboardCheck className="h-3 w-3 mr-1 text-green-600" />
                  We'll fetch your recent UPI transactions for better insights
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect UPI ID'}
              </Button>
            </form>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default UpiIntegration;
