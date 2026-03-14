const translations = {
  hi: {
    Home: 'मुख्य पृष्ठ',
    Learn: 'सीखें',
    Type: 'टाइप',
    Pronounce: 'उच्चारण',
    Quiz: 'प्रश्नोत्तरी',
    Help: 'मदद',
    'My Profile': 'प्रोफ़ाइल',
    'AI English Tutor': 'एआई इंग्लिश ट्यूटर',
    'Read AI-generated stories and learn new words.':
      'एआई-जनरेटेड कहानियाँ पढ़ें और नए शब्द सीखें।',
    'Practice your typing speed with stories.': 'कहानियों के साथ अपनी टाइपिंग स्पीड बढ़ाएं।',
    'Practice reading stories aloud and get AI feedback.':
      'ज़ोर से पढ़ने का अभ्यास करें और एआई से फ़ीडबैक पाएं।',
    'Test your grammar and vocabulary in a daily battle.':
      'रोज़ाना अपनी ग्रामर और वोकैबुलरी का टेस्ट लें।',
    'Learn how to use all the features of this app.': 'इस ऐप के उपयोग करने का तरीका सीखें।',
  },
  te: {
    Home: 'హోమ్',
    Learn: 'నేర్చుకో',
    Type: 'టైప్',
    Pronounce: 'ఉచ్ఛరించు',
    Quiz: 'క్విజ్',
    Help: 'సహాయం',
    'My Profile': 'నా ప్రొఫైల్',
    'AI English Tutor': 'ఏఐ ఇంగ్లీష్ ట్యూటర్',
    'Read AI-generated stories and learn new words.':
      'ఏఐ సృష్టించిన కథలు చదవండి మరియు కొత్త పదాలు నేర్చుకోండి.',
    'Practice your typing speed with stories.': 'కథలతో టైపింగ్ స్పీడ్ ప్రాక్టీస్ చేయండి.',
    'Practice reading stories aloud and get AI feedback.':
      'గట్టిగా చదవడం ప్రాక్టీస్ చేయండి మరియు ప్రతిస్పందన పొందండి.',
    'Test your grammar and vocabulary in a daily battle.':
      'తాజా క్విజ్‌లో గ్రామర్ మరియు పదజాలం పరీక్షించండి.',
    'Learn how to use all the features of this app.': 'ఈ యాప్ వాడటం ఎలాగో తెలుసుకోండి.',
  },
};

/**
 * Super lightweight i18n utility.
 * Since 'lang' is mostly stored in localstorage but managed via React state in App.jsx,
 * we just pass the language key down to translate strings.
 */
export function useTranslation(lang) {
  return function t(key) {
    if (lang === 'en') return key; // Default English
    return translations[lang]?.[key] || key;
  };
}
