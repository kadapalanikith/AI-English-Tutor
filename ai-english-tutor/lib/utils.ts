
export function tokenizeWithSpaces(text: string): string[] {
  const tokens: string[] = [];
  let currentToken = '';
  let currentIsSpace: boolean | null = null;
  
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

export function normalizeKey(word: string): string {
    if (!word) return '';
    return word.toLowerCase().replace(/[^a-z]/g, '');
}

export function similarityPct(a: string, b: string): number {
    if (!a && !b) return 100;

    const levenshtein = (s1: string, s2: string) => {
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        let longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / longerLength;
    };

    const editDistance = (s1: string, s2: string) => {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[s2.length] = lastValue;
            }
        }
        return costs[s2.length];
    };
    
    const max = Math.max((a || '').length, (b || '').length) || 1;
    const distance = editDistance(a,b)
    return Math.round((1 - distance / max) * 100);
}
