// ─── Domain Types ──────────────────────────────────────────────────────────────

export const LANGUAGES = /** @type {const} */ (['hi', 'te']);

/**
 * @typedef {'hi' | 'te'} Language
 */

/**
 * @typedef {'home' | 'learn' | 'type' | 'pronounce' | 'help'} Section
 */

/**
 * @typedef {{ id: string; title: string; text: string; translations: Record<string, string>; }} Story
 */

/**
 * @typedef {{ [lang: string]: { [word: string]: string } }} Dictionary
 */

/**
 * @typedef {{ id: string; label: string; target: number; progress: number; done: boolean; }} Goal
 */

/**
 * @typedef {{ type: 'typing'; wpm: number; accuracy: number; ts: number; typedChars: number; }} TypingRecord
 */

/**
 * @typedef {{ type: 'pronounce'; score: number; ts: number; wordScores: { word: string; score: number }[]; }} PronounceRecord
 */

/**
 * @typedef {TypingRecord | PronounceRecord} PracticeRecord
 */

/**
 * @typedef {{ count: number; last: number; }} Streak
 */

/**
 * @typedef {{ role: 'user' | 'bot'; text: string; }} ChatMessage
 */
