
import React, { useState } from 'react';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ApiKeySetup = () => {
  const { apiKey, setApiKey, isConfigured } = useGeminiAI();
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);

  const handleSaveApiKey = () => {
    if (!newApiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    setIsValidating(true);

    // Simple validation to check if the key format looks right
    if (newApiKey.length < 20) {
      toast.error('API key seems too short. Please check and try again.');
      setIsValidating(false);
      return;
    }

    // Save the API key
    setApiKey(newApiKey.trim());
    toast.success('API key saved successfully');
    setIsValidating(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <CardTitle>Google Gemini AI Setup</CardTitle>
        </div>
        <CardDescription>
          Configure your Gemini AI API key to enable AI-powered financial insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isConfigured && (
            <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">API key configured</span>
            </div>
          )}
          
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Gemini AI API Key
            </label>
            <div className="relative">
              <Input
                id="apiKey"
                type="password"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                className="pr-10"
                placeholder="Enter your Gemini API key"
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Important</p>
                <p className="mt-1">Your API key is configured automatically. You can update it here if needed.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSaveApiKey}
          disabled={isValidating || !newApiKey.trim() || newApiKey === apiKey}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isValidating ? 'Validating...' : 'Save API Key'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeySetup;
