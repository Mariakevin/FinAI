
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRightCircle, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface UpiIntegrationProps {
  onUpiConnect: (upiId: string) => void;
  isConnected: boolean;
  connectedUpiId: string | null;
  isReadOnly?: boolean;
}

// UPI providers data
const UPI_PROVIDERS = [
  { id: 'gpay', name: 'Google Pay', pattern: '@okgpay' },
  { id: 'paytm', name: 'Paytm', pattern: '@paytm' },
  { id: 'phonepe', name: 'PhonePe', pattern: '@ybl' },
  { id: 'bhim', name: 'BHIM', pattern: '@upi' },
  { id: 'amazonpay', name: 'Amazon Pay', pattern: '@apl' },
  { id: 'banking', name: 'Banking UPI', pattern: '@bank' },
  { id: 'other', name: 'Other', pattern: '' }
];

const UpiIntegration = ({ 
  onUpiConnect, 
  isConnected, 
  connectedUpiId,
  isReadOnly = false
}: UpiIntegrationProps) => {
  const [upiId, setUpiId] = useState('');
  const [provider, setProvider] = useState('other');
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
    
    const fullUpiId = provider === 'other' ? upiId : 
      upiId.includes('@') ? upiId : 
      `${upiId}${UPI_PROVIDERS.find(p => p.id === provider)?.pattern || '@upi'}`;
    
    onUpiConnect(fullUpiId);
    toast.success(`Successfully connected to UPI ID: ${fullUpiId}`);
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

  // Extract provider from UPI ID
  const getProviderFromUpiId = (upiId: string) => {
    const providerMatch = UPI_PROVIDERS.find(p => 
      p.pattern && upiId.includes(p.pattern)
    );
    return providerMatch?.name || 'UPI';
  };

  return (
    <Card className="border border-gray-200/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">UPI Integration</CardTitle>
        <CardDescription className="text-gray-500">
          Connect your UPI account to track all transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected && connectedUpiId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-md">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Connected UPI ID:</p>
                <p className="text-md font-semibold">{connectedUpiId}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Provider: {getProviderFromUpiId(connectedUpiId)}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">Status: Active</p>
              </div>
              <p className="text-xs text-gray-600">
                Your UPI transactions will now appear in your transaction history.
              </p>
            </div>
            
            {isReadOnly ? (
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in to manage UPI
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Disconnect UPI ID
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
                <Label htmlFor="upi-provider">UPI Provider</Label>
                <Select
                  value={provider}
                  onValueChange={setProvider}
                >
                  <SelectTrigger id="upi-provider" className="w-full">
                    <SelectValue placeholder="Select a UPI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {UPI_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="upi-id">Enter your UPI ID</Label>
                <Input
                  id="upi-id"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder={provider !== 'other' ? 
                    `username${UPI_PROVIDERS.find(p => p.id === provider)?.pattern || ''}` : 
                    "example@upi"}
                  required
                />
                <p className="text-xs text-gray-500">
                  Connect your UPI ID to track all your UPI transactions automatically
                </p>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-gray-700">Benefits:</p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
                  <li>Automatic transaction tracking</li>
                  <li>Real-time payment notifications</li>
                  <li>Category-based expense analysis</li>
                  <li>Spending pattern insights</li>
                </ul>
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
