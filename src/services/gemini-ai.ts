
import { toast } from 'sonner';

// Define interfaces for the Gemini AI API
interface GeminiAIRequest {
  contents: {
    parts: {
      text: string;
    }[];
    role: string;
  }[];
  generationConfig: {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
  };
}

interface GeminiAIResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export class GeminiAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async generateFinancialInsights(financialData: any): Promise<string> {
    try {
      const prompt = this.formatFinancialPrompt(financialData);
      
      const requestBody: GeminiAIRequest = {
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user',
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate insights');
      }

      const data: GeminiAIResponse = await response.json();
      return data.candidates[0]?.content.parts[0].text || 'No insights generated';
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate AI insights');
      return 'Unable to generate insights at this time. Please try again later.';
    }
  }

  private formatFinancialPrompt(financialData: any): string {
    const { transactions, totalIncome, totalExpenses, balance, topCategories } = financialData;
    
    return `
    As a financial AI advisor, analyze the following financial data and provide insights:
    
    Transaction summary:
    - Total income: $${totalIncome}
    - Total expenses: $${totalExpenses}
    - Current balance: $${balance}
    - Number of transactions: ${transactions.length}
    
    Top expense categories:
    ${topCategories.map((c: any) => `- ${c.category}: $${c.amount}`).join('\n')}
    
    Please provide:
    1. An analysis of current spending patterns
    2. Financial health assessment
    3. Three specific recommendations to improve financial situation
    4. Future financial projections (60-90 days)
    
    Format the response in bullet points starting with • for each insight.
    `;
  }
}

// Create and export singleton instance with a placeholder API key
// The actual API key will be set from the UI
export const geminiAI = new GeminiAIService('YOUR_API_KEY_PLACEHOLDER');
