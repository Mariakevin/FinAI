
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = "AIzaSyBNeYX79TrMw8Qca_dz46Ds9mF_wlrIeHQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactions, type } = await req.json();
    
    let prompt = "";
    if (type === "insights") {
      prompt = `Analyze these financial transactions and provide 5-7 key insights about spending patterns, habits, and areas of improvement. Format each insight as a bullet point starting with "•". Be specific and actionable: ${JSON.stringify(transactions)}`;
    } else if (type === "predictions") {
      prompt = `Based on these financial transactions, predict 5-7 future financial trends or outcomes that might occur. Format each prediction as a bullet point starting with "•". Be specific with percentages and timeframes where possible: ${JSON.stringify(transactions)}`;
    } else if (type === "tips") {
      prompt = `Based on these financial transactions, provide 5-7 specific actionable tips to improve financial health. Format each tip as a bullet point starting with "•". Be very specific and actionable: ${JSON.stringify(transactions)}`;
    }
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    
    let result = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      result = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response from Gemini API");
    }

    return new Response(
      JSON.stringify({ content: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
