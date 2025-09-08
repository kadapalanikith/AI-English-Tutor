
import { GoogleGenAI, Type } from "@google/genai";
import { Story, Dictionary, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be caught by the app's error boundary in a real scenario.
  // For this environment, we'll log a more descriptive error.
  console.error("FATAL: API_KEY environment variable not set. Please ensure it is configured in your environment.");
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const storySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    text: { type: Type.STRING },
  },
};

const textTranslationSchema = {
    type: Type.OBJECT,
    properties: {
        hi: { type: Type.STRING },
        te: { type: Type.STRING }
    }
}

export async function generateNewStory(englishLevel: string): Promise<Partial<Story>> {
  const prompt = `Generate a short moral story of about 6 to 8 sentences from the Indian epics, the Ramayana or Mahabharata, for an adult learning English at a ${englishLevel} level. The story should be easy to understand and contain a clear lesson.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: storySchema,
    }
  });
  return JSON.parse(response.text);
}

export async function translateWords(words: string[]): Promise<Partial<Dictionary>> {
  if (words.length === 0) return {};
  const prompt = `Translate the following English words into Hindi and Telugu. Provide the output in a single JSON object with 'hi' and 'te' keys. For each language, provide a key-value pair for each word, where the English word is the key (lowercase) and the translation is the value. Words: ${words.join(', ')}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: 'application/json',
    }
  });

  // The model's response might include markdown backticks for the JSON block.
  // We need to clean that up before parsing.
  const cleanedText = response.text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanedText);
}


export async function translateText(text: string): Promise<{ hi: string; te: string; }> {
    const prompt = `Translate the following English text into both Hindi and Telugu.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            prompt,
            `Text: '${text}'`
        ],
        config: {
            responseMimeType: 'application/json',
            responseSchema: textTranslationSchema,
        }
    });
    return JSON.parse(response.text);
}


export async function getChatbotResponse(history: ChatMessage[], newMessage: string): Promise<string> {
    const systemInstruction = `You are an AI assistant named 'LiftBot' for the 'AI English Tutor' app. Your primary role is to help users learn English and navigate the app. Answer questions about English grammar, vocabulary, sentence structure, or how to use the app's features (Learn, Type, Pronounce). Keep your answers simple, clear, and encouraging. If the user asks something unrelated to learning English or using the app, politely state that you can only help with English-related topics and guide them back.`;

    const contents = history.map(msg => ({
        role: msg.role === 'bot' ? 'model' as const : 'user' as const,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: newMessage }] });
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response.text;
}

export async function generatePersonalizedExercise(context: 'typing' | 'pronunciation', incorrectWords: string[]): Promise<string> {
  if (incorrectWords.length === 0) return "";
  const prompt = `A user is learning English. They made mistakes with the following words while practicing their ${context}: ${[...new Set(incorrectWords)].join(', ')}. 
  Create a short, encouraging practice paragraph (2-3 sentences) for them. This paragraph should creatively include some of these words or address the underlying phonetic or spelling challenges. Do not add any preamble like "Here is a paragraph:". Just return the paragraph text directly.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
}
