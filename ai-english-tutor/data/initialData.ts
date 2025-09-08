
import { Story, Dictionary } from '../types';

export const initialStory: Story = {
    id: 'initial_story',
    title: "The Wise Carpenter",
    text: 'A wise carpenter taught his apprentice a lesson. He said, "Measure twice, cut once." The apprentice learned the value of careful planning and preparation before starting any task.',
    translations: {
        hi: 'एक बुद्धिमान बढ़ई ने अपने शिष्य को एक सबक सिखाया। उसने कहा, "दो बार मापो, एक बार काटो।" शिष्य ने किसी भी कार्य को शुरू करने से पहले सावधानीपूर्वक योजना और तैयारी का मूल्य सीखा।',
        te: 'ఒక తెలివైన వడ్రంగి తన శిష్యుడికి ఒక పాఠం నేర్పించాడు. అతను, "రెండుసార్లు కొలవండి, ఒకసారి కత్తిరించండి" అన్నాడు. శిష్యుడు ఏదైనా పని ప్రారంభించే ముందు జాగ్రత్తగా ప్రణాళిక మరియు తయారీ యొక్క విలువను నేర్చుకున్నాడు.'
    }
};

export const initialDictionary: Dictionary = {
  hi: {
    wise: 'बुद्धिमान', carpenter: 'बढ़ई', taught: 'सिखाया', apprentice: 'शिष्य', lesson: 'सबक', said: 'कहा',
    measure: 'मापो', twice: 'दो बार', cut: 'काटो', once: 'एक बार', learned: 'सीखा', value: 'महत्व',
    careful: 'सावधान', planning: 'योजना', preparation: 'तैयारी', before: 'पहले', starting: 'शुरू करने', any: 'कोई', task: 'कार्य',
  },
  te: {
    wise: 'జ్ఞాని', carpenter: 'వడ్రంగి', taught: 'బోధించాడు', apprentice: 'శిష్యుడు', lesson: 'పాఠం', said: 'అన్నాడు',
    measure: 'కొలవండి', twice: 'రెండుసార్లు', cut: 'కోయండి', once: 'ఒకసారి', learned: 'నేర్చుకున్నాడు', value: 'విలువ',
    careful: 'జాగ్రత్తగా', planning: 'ప్రణాళిక', preparation: 'తయారీ', before: 'ముందు', starting: 'ప్రారంభించే', any: 'ఏదైనా', task: 'పని',
  }
};
