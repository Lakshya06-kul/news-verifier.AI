
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageData, GroundingSource, AnalysisResult, Verdict } from '../types';

const SYSTEM_INSTRUCTION = `You are an expert fact-checker AI specializing in identifying fake news and misinformation. Your primary goal is to analyze the provided news article text or image content and determine its authenticity. 
Focus on Indian news sources but also be proficient with global news. Use Google Search to find credible, authoritative sources to verify the claims.

Respond in the following strict format:
**Verdict:** [Genuine/Fake/Potentially Misleading/Inconclusive]
**Explanation:** [Your concise, neutral, and evidence-based analysis here. Explain your reasoning for the verdict based on the sources you found.]`;

const parseAnalysisResponse = (responseText: string, sources: GroundingSource[]): AnalysisResult => {
  const verdictMatch = responseText.match(/\*\*Verdict:\*\*\s*(.*)/);
  const explanationMatch = responseText.match(/\*\*Explanation:\*\*\s*([\s\S]*)/);

  let verdict: Verdict = Verdict.Inconclusive;
  const verdictText = verdictMatch ? verdictMatch[1].trim() : '';
  if (verdictText.toLowerCase().includes('genuine')) {
    verdict = Verdict.Genuine;
  } else if (verdictText.toLowerCase().includes('fake')) {
    verdict = Verdict.Fake;
  } else if (verdictText.toLowerCase().includes('misleading')) {
    verdict = Verdict.PotentiallyMisleading;
  } else if (verdictText.toLowerCase().includes('inconclusive')) {
    verdict = Verdict.Inconclusive;
  }

  const explanation = explanationMatch ? explanationMatch[1].trim() : 'Could not extract a detailed explanation.';

  return {
    verdict,
    explanation,
    sources,
  };
};

export const analyzeNews = async (
  text: string,
  image?: ImageData
): Promise<AnalysisResult> => {
    
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-2.5-flash';
  
  let contents;
  if (image) {
    const imagePart = {
      inlineData: {
        mimeType: image.mimeType,
        data: image.base64,
      },
    };
    const textPart = { text };
    contents = { parts: [imagePart, textPart] };
  } else {
    contents = text;
  }
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const analysisText = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return parseAnalysisResponse(analysisText, sources);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get analysis from AI. Please check the console for details.");
  }
};
