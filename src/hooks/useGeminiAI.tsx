
import React, { createContext, useContext, useState, useEffect } from 'react';
import { geminiAI } from '@/services/gemini-ai';

interface GeminiAIContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
}

const GeminiAIContext = createContext<GeminiAIContextType>({
  apiKey: '',
  setApiKey: () => {},
  isConfigured: false,
});

export const GeminiAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const isConfigured = Boolean(apiKey);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      // Update the API key in the service
      Object.defineProperty(geminiAI, 'apiKey', {
        value: apiKey,
        writable: true
      });
    }
  }, [apiKey]);

  return (
    <GeminiAIContext.Provider value={{ apiKey, setApiKey, isConfigured }}>
      {children}
    </GeminiAIContext.Provider>
  );
};

export const useGeminiAI = () => useContext(GeminiAIContext);
