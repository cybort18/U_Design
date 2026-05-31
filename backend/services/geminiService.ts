import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export interface FingerprintData {
  artStyle: string;
  dominantColors: string[];
  mainObjects: string[];
  copyrightDescription: string;
}

export async function analyzeWithGemini(filePath: string, mimeType: string): Promise<FingerprintData> {
  const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    console.warn("Gemini key missing. Faking AI response.");
    await new Promise(r => setTimeout(r, 1500));
    return {
      artStyle: "Cyberpunk Digital Art",
      dominantColors: ["#000000", "#00FFA3"],
      mainObjects: ["Abstract shape", "Neon lights"],
      copyrightDescription: "A dark cyberpunk abstract composition featuring neon green glowing geometries."
    };
  }

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  
  // Read file from disk and convert to base64
  const fileBuffer = fs.readFileSync(filePath);
  const b64Data = fileBuffer.toString('base64');

  const prompt = `Analyze this image. Detect the Art Style, Dominant Colors (use Hex Codes), Main Objects, and provide a short (1-2 sentence) copyright description. 
  Return the result strictly in JSON format with keys: artStyle, dominantColors (array of strings), mainObjects (array of strings), copyrightDescription. Do not use markdown blocks around the response.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
        {
            role: 'user',
            parts: [
                { inlineData: { data: b64Data, mimeType: mimeType } },
                { text: prompt }
            ]
        }
    ]
  });

  let text = response.text || '';
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  try {
    return JSON.parse(text) as FingerprintData;
  } catch (e) {
    console.error("Failed to parse Gemini output:", text);
    throw new Error("AI Analysis returned malformed data.");
  }
}
