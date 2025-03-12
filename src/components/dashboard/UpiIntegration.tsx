
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRightCircle } from 'lucide-react';

interface UpiIntegrationProps {
  onUpiConnect: (upiId: string) => void;
  isConnected: boolean;
  connectedUpiId: string | null;
}

const UpiIntegration = ({ onUpiConnect, isConnected, connectedUpiId }: UpiIntegrationProps) => {
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    onUpiConnect('');
    toast.success('UPI ID disconnected');
  };

  return (
    <Card className="border border-gray-200/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">UPI Integration</CardTitle>
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
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="w-full"
            >
              Disconnect UPI ID
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
              <p className="text-xs text-gray-500">
                Connect your UPI ID to track all your UPI transactions in one place
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
        )}
      </CardContent>
    </Card>
  );
};

export default UpiIntegration;
