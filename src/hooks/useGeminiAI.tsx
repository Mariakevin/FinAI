
import React, { createContext, useContext, useState, useEffect } from 'react';
import { geminiAI } from '@/services/gemini-ai';

interface GeminiAIContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
}

const GeminiAIContext = createContext<GeminiAIContextType>({
  apiKey: 'AIzaSyBNeYX79TrMw8Qca_dz46Ds9mF_wlrIeHQ',
  setApiKey: () => {},
  isConfigured: true,
});

export const GeminiAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>('AIzaSyBNeYX79TrMw8Qca_dz46Ds9mF_wlrIeHQ');

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
