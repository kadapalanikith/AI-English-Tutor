/**
 * Tokenizes text preserving spaces as separate tokens.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenizeWithSpaces(text) {
  const tokens = [];
  let currentToken = '';
  let currentIsSpace = null;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isSpace = /\s/.test(char);

    if (currentToken === '') {
      currentToken = char;
      currentIsSpace = isSpace;
    } else if (isSpace === currentIsSpace) {
      currentToken += char;
    } else {
      tokens.push(currentToken);
      currentToken = char;
      currentIsSpace = isSpace;
    }
  }

  if (currentToken !== '') {
    tokens.push(currentToken);
  }

  return tokens;
}

/**
 * Normalises a word to a lowercase alphabetic lookup key.
 * @param {string} word
 * @returns {string}
 */
export function normalizeKey(word) {
  if (!word) return '';
  return word.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Returns the Levenshtein-based similarity percentage between two strings.
 * @param {string} a
 * @param {string} b
 * @returns {number} 0-100
 */
export function similarityPct(a, b) {
  if (!a && !b) return 100;

  const editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  const max = Math.max((a || '').length, (b || '').length) || 1;
  return Math.round((1 - editDistance(a, b) / max) * 100);
}

/**
 * Clamps a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats milliseconds to a mm:ss string.
 * @param {number} ms
 * @returns {string}
 */
export function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}
