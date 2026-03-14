import { GoogleGenAI, Type } from '@google/genai';

// ─── API Key ───────────────────────────────────────────────────────────────────
// In Vite, only import.meta.env.VITE_* vars are available in the browser.
// process.env is NOT available at runtime (only replaced at build time if defined).
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    '[geminiService] No API key found. ' +
      'Create a .env file and set VITE_GEMINI_API_KEY=your_key_here',
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY ?? 'MISSING_KEY' });

// ─── Schemas ───────────────────────────────────────────────────────────────────
const storySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    text: { type: Type.STRING },
  },
  required: ['title', 'text'],
};

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      answer: { type: Type.STRING },
      explanation: { type: Type.STRING },
    },
    required: ['question', 'options', 'answer', 'explanation'],
  },
};

const textTranslationSchema = {
  type: Type.OBJECT,
  properties: {
    hi: { type: Type.STRING },
    te: { type: Type.STRING },
  },
  required: ['hi', 'te'],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const MODEL = 'gemini-2.5-flash';

// ─── Exports ───────────────────────────────────────────────────────────────────

/**
 * Generates a new AI story.
 * @param {string} englishLevel
 * @param {string} topic optional topic or genre
 */
export async function generateNewStory(
  englishLevel,
  topic = 'Indian epics, the Ramayana or Mahabharata',
) {
  const prompt = `Generate a short moral story of about 6 to 8 sentences about ${topic} for an adult learning English at a ${englishLevel} level. The story should be easy to understand and contain a clear lesson.`;
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: storySchema },
  });
  return JSON.parse(response.text);
}

/**
 * Generates a 5-question grammar/vocabulary quiz based on the user's level and recent topics.
 */
export async function generateGrammarQuiz(englishLevel) {
  const prompt = `Create a 5-question multiple-choice quiz covering grammar and vocabulary for a ${englishLevel} level ESL learner. Make the questions relevant to daily conversations, storytelling, and common mistakes. Provide 4 options, the exact correct answer text, and a short explanation for each question.`;
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: quizSchema },
  });
  return JSON.parse(response.text);
}

/**
 * Translates a list of English words into Hindi and Telugu.
 * @param {string[]} words
 * @returns {Promise<Partial<import('../types').Dictionary>>}
 */
export async function translateWords(words) {
  if (words.length === 0) return {};
  const prompt = `Translate the following English words into Hindi and Telugu. Provide the output in a single JSON object with 'hi' and 'te' keys. For each language, provide a key-value pair for each word, where the English word is the key (lowercase) and the translation is the value. Words: ${words.join(', ')}`;
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
  const cleanedText = response.text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanedText);
}

/**
 * Translates a passage into Hindi and Telugu.
 * @param {string} text
 * @returns {Promise<{ hi: string; te: string }>}
 */
export async function translateText(text) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      'Translate the following English text into both Hindi and Telugu.',
      `Text: '${text}'`,
    ],
    config: { responseMimeType: 'application/json', responseSchema: textTranslationSchema },
  });
  return JSON.parse(response.text);
}

/**
 * Gets a chatbot response from LiftBot.
 * @param {import('../types').ChatMessage[]} history
 * @param {string} newMessage
 * @returns {Promise<string>}
 */
export async function getChatbotResponse(history, newMessage) {
  const systemInstruction = `You are an AI assistant named 'LiftBot' for the 'AI English Tutor' app. Your primary role is to help users learn English and navigate the app. Answer questions about English grammar, vocabulary, sentence structure, or how to use the app's features (Learn, Type, Pronounce). Keep your answers simple, clear, and encouraging. If the user asks something unrelated to learning English or using the app, politely state that you can only help with English-related topics and guide them back.`;

  const contents = history.map((msg) => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }],
  }));
  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: { systemInstruction },
  });

  return response.text;
}

/**
 * Generates a personalised exercise for words the user got wrong.
 * @param {'typing' | 'pronunciation'} context
 * @param {string[]} incorrectWords
 * @returns {Promise<string>}
 */
export async function generatePersonalizedExercise(context, incorrectWords) {
  if (incorrectWords.length === 0) return '';
  const unique = [...new Set(incorrectWords)];
  const prompt = `A user is learning English. They made mistakes with the following words while practicing their ${context}: ${unique.join(', ')}. Create a short, encouraging practice paragraph (2–3 sentences) for them. This paragraph should creatively include some of these words or address the underlying phonetic or spelling challenges. Do not add any preamble like "Here is a paragraph:". Just return the paragraph text directly.`;

  const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
  return response.text;
}
