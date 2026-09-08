import { CitizenFormData, VoiceRecognitionResult } from '../types';
import { UTTARAKHAND_DISTRICTS } from '../data/uttarakhandData';
import {
  parseUttarakhandName,
  parseBilingualAddress,
  devanagariToEnglish,
  latinToDevanagari,
  levenshtein,
  UK_FIRST_NAMES_DICTIONARY,
  UK_SURNAME_DICTIONARY
} from './uttarakhandPhonetics';
import { lookupPincodeSync } from './pincodeLookup';

export type VoiceLanguageMode = 'hindi' | 'english' | 'hinglish';

// Polyfill types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface FieldVoiceConfig {
  key: keyof CitizenFormData;
  labelHi: string;
  labelEn: string;
  promptHi: string;
  promptEn: string;
  audioExplanationHi: string;
  audioExplanationEn: string;
  iconName?: string;
}

export const FIELD_VOICE_CONFIGS: Record<string, FieldVoiceConfig> = {
  fullName: {
    key: 'fullName',
    labelHi: 'आवेदक का पूरा नाम (अंग्रेजी)',
    labelEn: 'Full Name (English)',
    promptHi: 'कृपया अपना पूरा नाम बोलें, जैसे रमेश सिंह नेगी या रवि शंकर सिंह',
    promptEn: 'Speak your full name, for example Ramesh Singh Negi',
    audioExplanationHi: 'यह आपका नाम है जो प्रमाण पत्र पर दर्ज होगा।',
    audioExplanationEn: 'This is your full name as it appears on official records.'
  },
  fullNameHi: {
    key: 'fullNameHi',
    labelHi: 'आवेदक का पूरा नाम (हिंदी)',
    labelEn: 'Full Name in Hindi',
    promptHi: 'हिंदी में अपना नाम बोलें',
    promptEn: 'Speak your name in Hindi',
    audioExplanationHi: 'देवनागरी हिंदी में आपका नाम।',
    audioExplanationEn: 'Your name written in Devanagari Hindi.'
  },
  fatherHusbandName: {
    key: 'fatherHusbandName',
    labelHi: 'पिता अथवा पति का नाम (अंग्रेजी)',
    labelEn: "Father's or Husband's Name (English)",
    promptHi: 'पिता अथवा पति का नाम अंग्रेजी में बोलें, जैसे Birendra Singh Negi',
    promptEn: "Speak father's or husband's name in English",
    audioExplanationHi: 'आपके पिताजी अथवा पति का अंग्रेजी में नाम।',
    audioExplanationEn: 'The full name of your father or husband in English.'
  },
  fatherHusbandNameHi: {
    key: 'fatherHusbandNameHi',
    labelHi: 'पिता अथवा पति का नाम (हिंदी)',
    labelEn: "Father's or Husband's Name (Hindi)",
    promptHi: 'पिता अथवा पति का नाम हिंदी में बोलें, जैसे बीरेंद्र सिंह नेगी',
    promptEn: "Speak father's or husband's name in Hindi",
    audioExplanationHi: 'आपके पिताजी अथवा पति का देवनागरी हिंदी में नाम।',
    audioExplanationEn: 'The full name of your father or husband in Devanagari Hindi.'
  },
  motherName: {
    key: 'motherName',
    labelHi: 'माता का नाम (अंग्रेजी)',
    labelEn: "Mother's Name (English)",
    promptHi: 'अपनी माताजी का नाम बोलें, जैसे Sunita Devi',
    promptEn: "Speak your mother's name in English",
    audioExplanationHi: 'आपकी माताजी का पूरा नाम।',
    audioExplanationEn: 'The full name of your mother in English.'
  },
  motherNameHi: {
    key: 'motherNameHi',
    labelHi: 'माता का नाम (हिंदी)',
    labelEn: "Mother's Name (Hindi)",
    promptHi: 'माता का नाम हिंदी में बोलें, जैसे सुनीता देवी',
    promptEn: "Speak mother's name in Hindi",
    audioExplanationHi: 'देवनागरी में माता का नाम।',
    audioExplanationEn: "Mother's name in Devanagari Hindi."
  },
  relationType: {
    key: 'relationType',
    labelHi: 'संबंध प्रकार',
    labelEn: 'Relation Type',
    promptHi: 'संबंध बोलें: पिता, पति अथवा संरक्षक',
    promptEn: 'Speak relation type: Father, Husband or Guardian',
    audioExplanationHi: 'अभिभावक के साथ आपका संबंध।',
    audioExplanationEn: 'Type of relation with the guardian.'
  },
  dob: {
    key: 'dob',
    labelHi: 'जन्म तिथि',
    labelEn: 'Date of Birth',
    promptHi: 'अपनी जन्म तिथि बोलें, जैसे 14 मई 1996 अथवा 14/05/1996',
    promptEn: 'Speak your date of birth, like 14th May 1996',
    audioExplanationHi: 'आपकी जन्म की तारीख, माह एवं वर्ष।',
    audioExplanationEn: 'Your date of birth in DD/MM/YYYY format.'
  },
  gender: {
    key: 'gender',
    labelHi: 'लिंग',
    labelEn: 'Gender',
    promptHi: 'लिंग बोलें: पुरुष, महिला अथवा अन्य',
    promptEn: 'Speak gender: Male, Female or Transgender',
    audioExplanationHi: 'आपका लिंग (पुरुष / महिला / तृतीय लिंग)।',
    audioExplanationEn: 'Your legal gender.'
  },
  maritalStatus: {
    key: 'maritalStatus',
    labelHi: 'वैवाहिक स्थिति',
    labelEn: 'Marital Status',
    promptHi: 'वैवाहिक स्थिति बोलें: अविवाहित, विवाहित, विधवा अथवा तलाकशुदा',
    promptEn: 'Speak marital status: Unmarried, Married, Widowed or Divorced',
    audioExplanationHi: 'आप विवाहित हैं अथवा अविवाहित।',
    audioExplanationEn: 'Your marital status.'
  },
  religion: {
    key: 'religion',
    labelHi: 'धर्म',
    labelEn: 'Religion',
    promptHi: 'धर्म बोलें: हिन्दू, मुस्लिम, सिख, ईसाई अथवा अन्य',
    promptEn: 'Speak religion: Hindu, Muslim, Sikh, Christian or Other',
    audioExplanationHi: 'आपका धर्म।',
    audioExplanationEn: 'Your religious community.'
  },
  casteCategory: {
    key: 'casteCategory',
    labelHi: 'सामाजिक वर्ग / श्रेणी',
    labelEn: 'Caste Category',
    promptHi: 'वर्ग बोलें: सामान्य, ओबीसी, अनुसूचित जाति अथवा अनुसूचित जनजाति',
    promptEn: 'Speak category: General, OBC, SC, ST or EWS',
    audioExplanationHi: 'आपका सामाजिक आरक्षण वर्ग।',
    audioExplanationEn: 'Your reservation social category.'
  },
  mobileNumber: {
    key: 'mobileNumber',
    labelHi: 'मोबाइल नंबर',
    labelEn: 'Mobile Number',
    promptHi: 'अपना 10 अंकों का मोबाइल नंबर बोलें',
    promptEn: 'Speak your 10-digit mobile number',
    audioExplanationHi: 'एसएमएस अलर्ट व ओटीपी प्राप्त करने हेतु मोबाइल नंबर।',
    audioExplanationEn: '10-digit mobile phone number for SMS alerts.'
  },
  email: {
    key: 'email',
    labelHi: 'ईमेल आईडी',
    labelEn: 'Email ID',
    promptHi: 'अपना ईमेल पता बोलें, जैसे ramesh dot negi at gmail dot com',
    promptEn: 'Speak your email address, like ramesh dot negi at gmail dot com',
    audioExplanationHi: 'डिजिटल प्रमाणपत्र व रसीद प्राप्त करने हेतु ईमेल पता।',
    audioExplanationEn: 'Email address for digital certificate and receipts.'
  },
  aadhaarNumber: {
    key: 'aadhaarNumber',
    labelHi: 'आधार कार्ड संख्या',
    labelEn: 'Aadhaar Number',
    promptHi: 'अपनी 12 अंकों की आधार संख्या बोलें',
    promptEn: 'Speak your 12-digit Aadhaar number',
    audioExplanationHi: 'यूआईडीएआई द्वारा जारी 12 अंकों का आधार नंबर।',
    audioExplanationEn: '12-digit Aadhaar identity number issued by UIDAI.'
  },
  panNumber: {
    key: 'panNumber',
    labelHi: 'पैन कार्ड संख्या',
    labelEn: 'PAN Number',
    promptHi: 'अपनी 10 अंकों की पैन संख्या बोलें',
    promptEn: 'Speak your 10-character PAN number',
    audioExplanationHi: 'आयकर विभाग द्वारा जारी पैन कार्ड नंबर।',
    audioExplanationEn: '10-character alphanumeric PAN issued by IT Dept.'
  },
  voterId: {
    key: 'voterId',
    labelHi: 'वोटर कार्ड / एपिक नंबर',
    labelEn: 'Voter ID',
    promptHi: 'अपना मतदाता पहचान पत्र नंबर बोलें',
    promptEn: 'Speak your voter ID / EPIC number',
    audioExplanationHi: 'निर्वाचन आयोग द्वारा जारी वोटर कार्ड नंबर।',
    audioExplanationEn: 'Election Commission voter identity number.'
  },
  state: {
    key: 'state',
    labelHi: 'राज्य (अंग्रेजी)',
    labelEn: 'State (English)',
    promptHi: 'राज्य का नाम बोलें, जैसे Uttarakhand',
    promptEn: 'Speak your state name in English',
    audioExplanationHi: 'आपका राज्य।',
    audioExplanationEn: 'Your state of residence.'
  },
  stateHi: {
    key: 'stateHi',
    labelHi: 'राज्य (हिंदी)',
    labelEn: 'State (Hindi)',
    promptHi: 'राज्य का नाम हिंदी में बोलें, जैसे उत्तराखंड',
    promptEn: 'Speak your state name in Hindi',
    audioExplanationHi: 'देवनागरी में राज्य का नाम।',
    audioExplanationEn: 'State in Devanagari Hindi.'
  },
  district: {
    key: 'district',
    labelHi: 'उत्तराखंड का गृह जिला',
    labelEn: 'Uttarakhand District',
    promptHi: 'अपने जिले का नाम बोलें, जैसे देहरादून, अल्मोड़ा, नैनीताल, हरिद्वार, पौड़ी',
    promptEn: 'Speak your Uttarakhand district name, like Dehradun, Almora, Nainital',
    audioExplanationHi: 'उत्तराखंड के 13 जिलों में से आपका गृह जनपद।',
    audioExplanationEn: 'Your home district among the 13 districts of Uttarakhand.'
  },
  tehsil: {
    key: 'tehsil',
    labelHi: 'तहसील',
    labelEn: 'Tehsil',
    promptHi: 'अपनी तहसील का नाम बोलें, जैसे विकासनगर, ऋषिकेश, रानीखेत, हल्द्वानी, रुड़की',
    promptEn: 'Speak your tehsil name',
    audioExplanationHi: 'आपके जनपद की संबंधित तहसील।',
    audioExplanationEn: 'The administrative sub-district or tehsil.'
  },
  pinCode: {
    key: 'pinCode',
    labelHi: 'पिन कोड',
    labelEn: 'PIN Code',
    promptHi: 'अपना 6 अंकों का डाक पिन कोड बोलें, जैसे 248001 (राज्य, जिला, तहसील, डाकघर व थाना स्वतः भर जाएंगे)',
    promptEn: 'Speak your 6-digit postal PIN code, for example 248001 (Auto-fills district, tehsil, post office & police station)',
    audioExplanationHi: 'डाकघर का 6 अंकों वाला पिन कोड। इसे बोलते ही जिला, तहसील, डाकघर व थाना स्वतः भर जाएंगे।',
    audioExplanationEn: '6-digit PIN code. Automatically resolves state, district, tehsil, post office, and police station.'
  },
  villageWard: {
    key: 'villageWard',
    labelHi: 'गाँव अथवा वार्ड (अंग्रेजी)',
    labelEn: 'Village / Ward (English)',
    promptHi: 'गाँव अथवा वार्ड का नाम बोलें, जैसे Rajpur Road Ward 12',
    promptEn: 'Speak the name of your village or municipal ward in English',
    audioExplanationHi: 'वह ग्राम या वार्ड जहाँ आपका निवास है।',
    audioExplanationEn: 'The village or ward where you reside.'
  },
  villageWardHi: {
    key: 'villageWardHi',
    labelHi: 'गाँव अथवा वार्ड (हिंदी)',
    labelEn: 'Village / Ward (Hindi)',
    promptHi: 'गाँव अथवा वार्ड का नाम हिंदी में बोलें, जैसे राजपुर रोड वार्ड १२',
    promptEn: 'Speak village or ward in Hindi',
    audioExplanationHi: 'देवनागरी हिंदी में ग्राम अथवा वार्ड का नाम।',
    audioExplanationEn: 'Village or municipal ward in Devanagari Hindi.'
  },
  postOffice: {
    key: 'postOffice',
    labelHi: 'डाकघर (अंग्रेजी)',
    labelEn: 'Post Office (English)',
    promptHi: 'अपने नजदीकी डाकघर का नाम बोलें, जैसे Rajpur P.O.',
    promptEn: 'Speak your nearest Post Office name in English',
    audioExplanationHi: 'आपका स्थानीय डाकघर।',
    audioExplanationEn: 'Your local post office.'
  },
  postOfficeHi: {
    key: 'postOfficeHi',
    labelHi: 'डाकघर (हिंदी)',
    labelEn: 'Post Office (Hindi)',
    promptHi: 'अपने डाकघर का नाम हिंदी में बोलें, जैसे राजपुर डाकघर',
    promptEn: 'Speak your post office name in Hindi',
    audioExplanationHi: 'देवनागरी हिंदी में डाकघर का नाम।',
    audioExplanationEn: 'Post office in Devanagari Hindi.'
  },
  policeStation: {
    key: 'policeStation',
    labelHi: 'थाना / पुलिस स्टेशन (अंग्रेजी)',
    labelEn: 'Police Station (English)',
    promptHi: 'अपने संबंधित थाने का नाम बोलें, जैसे Kotwali Dehradun',
    promptEn: 'Speak your jurisdiction Police Station in English',
    audioExplanationHi: 'आपका स्थानीय अधिकार क्षेत्र वाला पुलिस थाना।',
    audioExplanationEn: 'Local jurisdiction Police Station / Thana.'
  },
  policeStationHi: {
    key: 'policeStationHi',
    labelHi: 'थाना / पुलिस स्टेशन (हिंदी)',
    labelEn: 'Police Station (Hindi)',
    promptHi: 'अपने संबंधित थाने का नाम हिंदी में बोलें, जैसे कोतवाली देहरादून नगर',
    promptEn: 'Speak police station in Hindi',
    audioExplanationHi: 'देवनागरी में आपका पुलिस थाना।',
    audioExplanationEn: 'Police station in Devanagari Hindi.'
  },
  addressLine: {
    key: 'addressLine',
    labelHi: 'पूर्ण स्थाई पता (अंग्रेजी)',
    labelEn: 'Full Street Address (English)',
    promptHi: 'मकान संख्या व मार्ग सहित पूरा पता बोलें, जैसे House 42 Rajpur Road',
    promptEn: 'Speak your full address including house number and street in English',
    audioExplanationHi: 'आपका विस्तृत स्थाई निवास पता।',
    audioExplanationEn: 'Detailed residential address in English.'
  },
  addressLineHi: {
    key: 'addressLineHi',
    labelHi: 'पूर्ण स्थाई पता (हिंदी)',
    labelEn: 'Full Street Address (Hindi)',
    promptHi: 'मकान संख्या व मार्ग सहित पूरा पता हिंदी में बोलें',
    promptEn: 'Speak your full address in Hindi',
    audioExplanationHi: 'देवनागरी हिंदी में विस्तृत स्थाई निवास पता।',
    audioExplanationEn: 'Detailed residential address in Devanagari Hindi.'
  },
  annualIncome: {
    key: 'annualIncome',
    labelHi: 'वार्षिक पारिवारिक आय (रुपये में)',
    labelEn: 'Annual Income',
    promptHi: 'अपनी कुल वार्षिक पारिवारिक आय बोलें, जैसे साठ हजार, अस्सी हजार, अथवा एक लाख',
    promptEn: 'Speak your annual family income, for example 60000 or 1 lakh',
    audioExplanationHi: 'समस्त परिवार की एक वर्ष की कुल आय।',
    audioExplanationEn: 'Total yearly earnings of your entire family.'
  },
  occupation: {
    key: 'occupation',
    labelHi: 'व्यवसाय (कार्य)',
    labelEn: 'Occupation',
    promptHi: 'बोलें: कृषि, निजी सेवा, शासकीय सेवा, स्वरोजगार, अथवा छात्र',
    promptEn: 'Speak: Agriculture, Private Service, Business, or Student',
    audioExplanationHi: 'आपका मुख्य आजीविका कार्य अथवा व्यवसाय।',
    audioExplanationEn: 'Your main profession or occupation.'
  },
  livingSinceYears: {
    key: 'livingSinceYears',
    labelHi: 'उत्तराखंड में निवास अवधि (वर्ष)',
    labelEn: 'Years living in Uttarakhand',
    promptHi: 'उत्तराखंड में निवास के कुल वर्ष बोलें, जैसे बीस वर्ष अथवा पच्चीस वर्ष',
    promptEn: 'Speak your total years of living in Uttarakhand, for example 20 or 25',
    audioExplanationHi: 'उत्तराखंड में आपके रहने की कुल अवधि।',
    audioExplanationEn: 'Number of years you have been living in Uttarakhand.'
  }
};

export const HINDI_ENGLISH_NUMBERS_MAP: Record<string, string> = {
  // Single digits 0-9
  'zero': '0', 'oh': '0', 'zeroes': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
  'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
  'जीरो': '0', 'शून्य': '0', 'सिफर': '0',
  'एक': '1', 'वन': '1',
  'दो': '2', 'टू': '2',
  'तीन': '3', 'थ्री': '3',
  'चार': '4', 'फोर': '4',
  'पांच': '5', 'पाँच': '5', 'फाइव': '5',
  'छह': '6', 'छः': '6', 'छे': '6', 'सिक्स': '6',
  'सात': '7', 'सेवन': '7',
  'आठ': '8', 'एट': '8',
  'नौ': '9', 'नाइन': '9', 'नो': '9',

  // 10-19
  'ten': '10', 'टेन': '10', 'दस': '10',
  'eleven': '11', 'इलेवन': '11', 'ग्यारह': '11',
  'twelve': '12', 'ट्वेल्व': '12', 'बारह': '12',
  'thirteen': '13', 'तेरह': '13',
  'fourteen': '14', 'चौदह': '14',
  'fifteen': '15', 'पंद्रह': '15', 'पन्द्रह': '15',
  'sixteen': '16', 'सोलह': '16',
  'seventeen': '17', 'सत्रह': '17',
  'eighteen': '18', 'अठारह': '18',
  'nineteen': '19', 'उन्नीस': '19',

  // 20-29
  'twenty': '20', 'ट्वेंटी': '20', 'बीस': '20',
  'इक्कीस': '21', 'बाईस': '22', 'तेईस': '23', 'चौबीस': '24', 'पच्चीस': '25',
  'छब्बीस': '26', 'सत्ताईस': '27', 'अट्ठाईस': '28', 'उनतीस': '29',

  // 30-39
  'thirty': '30', 'थर्टी': '30', 'तीस': '30',
  'इकतीस': '31', 'बत्तीस': '32', 'तैंतीस': '33', 'चौंतीस': '34', 'पैंतीस': '35',
  'छत्तीस': '36', 'सैंतीस': '37', 'अड़तीस': '38', 'उनतालीस': '39',

  // 40-49
  'forty': '40', 'फॉर्टी': '40', 'चालीस': '40',
  'इकतालीस': '41', 'बयालीस': '42', 'तैंतालीस': '43', 'चवालीस': '44', 'पैंतालीस': '45',
  'छियालीस': '46', 'सैंतालीस': '47', 'अड़तालीस': '48', 'उनचास': '49',

  // 50-59
  'fifty': '50', 'फिफ्टी': '50', 'पचास': '50',
  'इक्यावन': '51', 'बावन': '52', 'तिरेपन': '53', 'चौवन': '54', 'पचपन': '55',
  'छप्पन': '56', 'सत्तावन': '57', 'अट्ठावन': '58', 'उनसठ': '59',

  // 60-69
  'sixty': '60', 'सिक्सटी': '60', 'साठ': '60',
  'इकसठ': '61', 'बासठ': '62', 'तिरसठ': '63', 'चौंसठ': '64', 'पैंसठ': '65',
  'छियासठ': '66', 'सरसठ': '67', 'अड़सठ': '68', 'उनहत्तर': '69',

  // 70-79
  'seventy': '70', 'सेवेन्टी': '70', 'सत्तर': '70',
  'इकहत्तर': '71', 'बहत्तर': '72', 'तिहत्तर': '73', 'चौहत्तर': '74', 'पचहत्तर': '75',
  'छिहत्तर': '76', 'सतहत्तर': '77', 'अठहत्तर': '78', 'उनासी': '79', 'उन्नासी': '79',

  // 80-89
  'eighty': '80', 'एटी': '80', 'अस्सी': '80',
  'इक्यासी': '81', 'बयासी': '82', 'तिरासी': '83', 'चौरासी': '84', 'पचासी': '85',
  'छियासी': '86', 'सतासी': '87', 'अट्ठासी': '88', 'नवासी': '89',

  // 90-99
  'ninety': '90', 'नाइन्टी': '90', 'नब्बे': '90',
  'इक्यानवे': '91', 'बानवे': '92', 'तिरानवे': '93', 'चौरानवे': '94', 'पचानवे': '95', 'पंचानवे': '95', 'पिचानवे': '95',
  'छियानवे': '96', 'सत्तानवे': '97', 'अट्ठानवे': '98', 'निन्यानवे': '99', 'निन्यानबे': '99',
  'hundred': '100', 'हंड्रेड': '100', 'सौ': '100'
};

const DIGIT_WORDS_MAP = HINDI_ENGLISH_NUMBERS_MAP;

export class VoiceAssistant {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening: boolean = false;
  private currentMode: VoiceLanguageMode = 'hindi';
  private singleFieldRecognition: SpeechRecognitionInstance | null = null;

  constructor() {
    this.initGlobalRecognition();
  }

  private initGlobalRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        if (this.recognition) {
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 5;
          this.recognition.lang = this.getBCP47Lang(this.currentMode);
        }
      } catch (e) {
        console.warn('Could not initialize SpeechRecognition:', e);
      }
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public getBCP47Lang(mode: VoiceLanguageMode): string {
    switch (mode) {
      case 'hindi': return 'hi-IN';    // Pure Devanagari Hindi Recognition
      case 'english': return 'en-US';  // Standard English Recognition
      case 'hinglish': return 'en-IN'; // Indian English / Bilingual
      default: return 'hi-IN';
    }
  }

  public setVoiceMode(mode: VoiceLanguageMode) {
    this.currentMode = mode;
    if (this.recognition) {
      try {
        this.recognition.lang = this.getBCP47Lang(mode);
      } catch (e) {
        // ignore
      }
    }
  }

  public setLanguage(lang: 'hi' | 'en') {
    this.setVoiceMode(lang === 'hi' ? 'hindi' : 'english');
  }

  public getLanguage(): 'hi' | 'en' {
    return this.currentMode === 'hindi' ? 'hi' : 'en';
  }

  public getVoiceMode(): VoiceLanguageMode {
    return this.currentMode;
  }

  public cancelSpeech() {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
    if (this.singleFieldRecognition) {
      try {
        this.singleFieldRecognition.stop();
      } catch (e) {
        // ignore
      }
      this.singleFieldRecognition = null;
    }
  }

  public speak(text: string, lang: 'hi' | 'en' = 'hi', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      let hasEnded = false;
      const handleFinished = () => {
        if (!hasEnded) {
          hasEnded = true;
          onEnd?.();
        }
      };

      utterance.onend = handleFinished;
      utterance.onerror = handleFinished;

      // Fallback timer in case browser doesn't trigger onend
      setTimeout(() => {
        if (!hasEnded) {
          handleFinished();
        }
      }, Math.max(1500, text.length * 85));

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      onEnd?.();
    }
  }

  public readFieldAloud(fieldKey: string, currentValue?: string, lang: 'hi' | 'en' = 'hi') {
    const config = FIELD_VOICE_CONFIGS[fieldKey];
    if (!config) return;

    const isHi = lang === 'hi';
    const fieldName = isHi ? config.labelHi : config.labelEn;
    const explanation = isHi ? config.audioExplanationHi : config.audioExplanationEn;
    const prompt = isHi ? config.promptHi : config.promptEn;

    let textToSpeak = `${fieldName}। ${explanation} ${prompt}।`;
    if (currentValue && currentValue.trim().length > 0) {
      textToSpeak += isHi
        ? ` वर्तमान में इसमें दर्ज है: ${currentValue}`
        : ` Currently filled value is: ${currentValue}`;
    }

    this.speak(textToSpeak, lang);
  }

  /**
   * High-Accuracy Field-by-Field Speech Dictation with Multi-Alternative Ranking & Auto-Filling
   */
  public listenForField(
    fieldKey: keyof CitizenFormData,
    options: {
      speakPromptFirst?: boolean;
      voiceMode?: VoiceLanguageMode;
      lang?: 'hi' | 'en';
      onListeningState?: (isListening: boolean) => void;
      onInterim?: (text: string) => void;
      onSuccess: (
        bestValue: string,
        displayLabel: string,
        rawTranscript: string,
        extraData?: { hindiValue?: string; alternativeChoices?: string[] }
      ) => void;
      onError?: (err: string) => void;
    }
  ) {
    const mode = options.voiceMode || this.currentMode;
    const bcp47 = this.getBCP47Lang(mode);
    const isHi = options.lang === 'hi' || mode === 'hindi';
    const config = FIELD_VOICE_CONFIGS[fieldKey as string];
    const promptText = config ? (isHi ? config.promptHi : config.promptEn) : (isHi ? 'कृपया अब बोलें' : 'Please speak now');

    const startRecording = () => {
      this.cancelSpeech();

      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) {
        options.onError?.('आपके ब्राउज़र में आवाज़ पहचान (Speech Recognition) उपलब्ध नहीं है। कृपया गूगल क्रोम या माइक्रोसॉफ्ट एज का उपयोग करें।');
        return;
      }

      this.stopListening();

      let hasProcessed = false;
      let accumulatedAlternatives: string[] = [];
      let latestInterim = '';
      let silenceTimer: any = null;

      const isDigitField = fieldKey === 'mobileNumber' || fieldKey === 'aadhaarNumber' || fieldKey === 'pinCode';
      const expectedDigitCount =
        fieldKey === 'mobileNumber' ? 10 :
        fieldKey === 'aadhaarNumber' ? 12 :
        fieldKey === 'pinCode' ? 6 :
        null;

      const recognizer = new SpeechRecognitionClass();
      this.singleFieldRecognition = recognizer;
      recognizer.continuous = isDigitField ? true : false;
      recognizer.interimResults = true;
      recognizer.maxAlternatives = 5;
      recognizer.lang = fieldKey === 'email' ? 'en-IN' : bcp47;

      const processAndSubmit = (candidates: string[]) => {
        if (hasProcessed) return;
        hasProcessed = true;
        if (silenceTimer) clearTimeout(silenceTimer);

        const validCandidates = candidates.filter((c) => c && c.trim().length > 0);
        if (validCandidates.length === 0) {
          options.onListeningState?.(false);
          return;
        }

        const ranked = this.rankFieldAlternatives(fieldKey, validCandidates);
        const bestCandidate = ranked[0] || validCandidates[0] || '';
        const cleanValue = this.extractCleanFieldValue(fieldKey, bestCandidate);
        const displayLabel = config ? (isHi ? config.labelHi : config.labelEn) : String(fieldKey);

        let extraHindiValue: string | undefined = undefined;
        if (fieldKey === 'fullName' || fieldKey === 'fullNameHi') {
          const names = parseUttarakhandName(bestCandidate);
          extraHindiValue = names.hindiName;
        }

        const alternativeChoices = Array.from(
          new Set(ranked.map((c) => this.extractCleanFieldValue(fieldKey, c)).filter(Boolean))
        ).slice(0, 4);

        options.onSuccess(cleanValue, displayLabel, bestCandidate, {
          hindiValue: extraHindiValue,
          alternativeChoices
        });

        // Spoken confirmation
        this.speak(
          isHi ? `${displayLabel} ${cleanValue} दर्ज कर लिया गया` : `${displayLabel} set to ${cleanValue}`,
          isHi ? 'hi' : 'en'
        );

        options.onListeningState?.(false);
      };

      const resetSilenceTimer = (durationMs = 4500) => {
        if (silenceTimer) clearTimeout(silenceTimer);
        if (isDigitField) {
          silenceTimer = setTimeout(() => {
            if (!hasProcessed && (accumulatedAlternatives.length > 0 || latestInterim)) {
              try {
                recognizer.stop();
              } catch (e) {}
              processAndSubmit(accumulatedAlternatives.length > 0 ? accumulatedAlternatives : [latestInterim]);
            }
          }, durationMs);
        }
      };

      recognizer.onstart = () => {
        options.onListeningState?.(true);
        if (isDigitField) {
          resetSilenceTimer(6000);
        }
      };

      recognizer.onresult = (e: SpeechRecognitionEvent) => {
        const alts: string[] = [];
        let finalPhrase = '';
        let interimPhrase = '';

        for (let i = 0; i < e.results.length; i++) {
          const result = e.results[i];
          if (result.isFinal) {
            finalPhrase += (finalPhrase ? ' ' : '') + result[0].transcript.trim();
          } else {
            interimPhrase += (interimPhrase ? ' ' : '') + result[0].transcript.trim();
          }

          for (let j = 0; j < result.length; j++) {
            const transcript = result[j].transcript.trim();
            if (transcript && !alts.includes(transcript)) {
              alts.push(transcript);
            }
          }
        }

        accumulatedAlternatives = alts;
        latestInterim = interimPhrase || finalPhrase;

        // Special continuous accumulation for mobile number & numeric fields
        if (expectedDigitCount) {
          const allSpokenText = (finalPhrase + ' ' + interimPhrase).trim();
          const cleanDigits = this.parseSpokenNumbers(allSpokenText);

          if (cleanDigits.length > 0) {
            const remaining = expectedDigitCount - cleanDigits.length;
            const progressText = isHi
              ? `📱 ${cleanDigits} (${cleanDigits.length}/${expectedDigitCount} अंक - ${remaining > 0 ? remaining + ' अंक और बोलें...' : 'पूर्ण!'})`
              : `📱 ${cleanDigits} (${cleanDigits.length}/${expectedDigitCount} digits - ${remaining > 0 ? remaining + ' remaining...' : 'Complete!'})`;
            options.onInterim?.(progressText);
          } else {
            options.onInterim?.(latestInterim);
          }

          // When target digits are reached (e.g. exactly 10 digits for mobile):
          if (cleanDigits.length >= expectedDigitCount) {
            const finalDigits = cleanDigits.slice(-expectedDigitCount);
            if (silenceTimer) clearTimeout(silenceTimer);
            hasProcessed = true;
            try {
              recognizer.stop();
            } catch (err) {}
            processAndSubmit([finalDigits]);
            return;
          }

          // Keep waiting for remaining digits
          resetSilenceTimer(4500);
          return;
        }

        options.onInterim?.(latestInterim);

        const lastResult = e.results[e.results.length - 1];
        if (lastResult.isFinal) {
          processAndSubmit(accumulatedAlternatives.length > 0 ? accumulatedAlternatives : [finalPhrase]);
        }
      };

      recognizer.onerror = (e: any) => {
        if (silenceTimer) clearTimeout(silenceTimer);
        if (e.error === 'not-allowed' || e.error === 'permission-denied') {
          options.onError?.('माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।');
        } else if (e.error !== 'no-speech') {
          options.onError?.(e.error);
        }
        options.onListeningState?.(false);
      };

      recognizer.onend = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        if (!hasProcessed && (accumulatedAlternatives.length > 0 || latestInterim)) {
          processAndSubmit(accumulatedAlternatives.length > 0 ? accumulatedAlternatives : [latestInterim]);
        } else {
          options.onListeningState?.(false);
        }
      };

      try {
        recognizer.start();
      } catch (err: any) {
        options.onError?.(err.message || 'ध्वनि पहचान प्रारंभ नहीं हो सकी');
        options.onListeningState?.(false);
      }
    };

    if (options.speakPromptFirst) {
      this.speak(promptText, isHi ? 'hi' : 'en', () => {
        setTimeout(startRecording, 300);
      });
    } else {
      this.cancelSpeech();
      setTimeout(startRecording, 50);
    }
  }

  /**
   * Domain-Specific Candidate Ranker
   */
  private rankFieldAlternatives(fieldKey: keyof CitizenFormData, alternatives: string[]): string[] {
    if (alternatives.length <= 1) return alternatives;

    switch (fieldKey) {
      case 'fullName':
      case 'fullNameHi':
      case 'fatherHusbandName':
      case 'motherName': {
        for (const alt of alternatives) {
          const clean = alt.toLowerCase().trim().replace(/^(मेरा नाम है|मेरा नाम|my name is|i am)\s+/i, '');
          const words = clean.split(/\s+/);
          const hasExactMatch = words.some(
            (w) => UK_FIRST_NAMES_DICTIONARY[w] || UK_SURNAME_DICTIONARY[w]
          );
          if (hasExactMatch) {
            return [alt, ...alternatives.filter((a) => a !== alt)];
          }
        }
        return alternatives;
      }

      case 'district': {
        for (const alt of alternatives) {
          for (const dist of UTTARAKHAND_DISTRICTS) {
            if (
              new RegExp(`\\b${dist.nameEn}\\b|${dist.nameHi}`, 'i').test(alt) ||
              levenshtein(alt.toLowerCase(), dist.nameEn.toLowerCase()) <= 2
            ) {
              return [alt, ...alternatives.filter((a) => a !== alt)];
            }
          }
        }
        return alternatives;
      }

      case 'mobileNumber': {
        for (const alt of alternatives) {
          const digits = this.parseSpokenNumbers(alt);
          if (digits.length === 10) {
            return [alt, ...alternatives.filter((a) => a !== alt)];
          }
        }
        return alternatives;
      }

      case 'aadhaarNumber': {
        for (const alt of alternatives) {
          const digits = this.parseSpokenNumbers(alt);
          if (digits.length === 12) {
            return [alt, ...alternatives.filter((a) => a !== alt)];
          }
        }
        return alternatives;
      }

      case 'pinCode': {
        for (const alt of alternatives) {
          const digits = this.parseSpokenNumbers(alt);
          if (digits.length === 6) {
            return [alt, ...alternatives.filter((a) => a !== alt)];
          }
        }
        return alternatives;
      }

      case 'email': {
        for (const alt of alternatives) {
          if (/@|gmail|yahoo|hotmail|outlook|rediffmail|\.com|\.in/i.test(alt)) {
            return [alt, ...alternatives.filter((a) => a !== alt)];
          }
        }
        return alternatives;
      }

      default:
        return alternatives;
    }
  }

  public parseSpokenEmail(rawTranscript: string): string {
    if (!rawTranscript) return '';
    let text = rawTranscript.trim();

    // 1. Convert Devanagari digits to 0-9
    for (const [hiWord, digit] of Object.entries(DIGIT_WORDS_MAP)) {
      const reg = new RegExp(`\\b${hiWord}\\b`, 'gi');
      text = text.replace(reg, digit);
    }

    // 2. Hindi phrase normalization for email keywords
    text = text
      .replace(/(एट\s*द\s*रेट|ऐट\s*द\s*रेट|एट\s*रेट|ऐट\s*रेट|एट|ऐट)/gi, ' @ ')
      .replace(/(डॉट|डोट|बिन्दु|बिंदु)/gi, ' . ')
      .replace(/(जीमेल|जी\s*मेल)/gi, 'gmail')
      .replace(/(याहू|याहू\s*मेल)/gi, 'yahoo')
      .replace(/(हॉटमेल|हॉट\s*मेल)/gi, 'hotmail')
      .replace(/(आउटलुक|आउट\s*लुक)/gi, 'outlook')
      .replace(/(रेडिफमेल|रेडिफ)/gi, 'rediffmail')
      .replace(/(कॉम|कम)/gi, 'com')
      .replace(/(अंडरस्कोर|अंडर\s*स्कोर)/gi, ' _ ')
      .replace(/(डैश|हाइफ़न)/gi, ' - ');

    // 3. If there are still Devanagari words, convert them using devanagariToEnglish
    const words = text.split(/\s+/);
    const latinWords = words.map((w) => {
      if (/[\u0900-\u097F]/.test(w)) {
        return devanagariToEnglish(w).toLowerCase();
      }
      return w;
    });
    text = latinWords.join(' ');

    // 4. English speech-to-text phrase normalization
    text = text
      .toLowerCase()
      .replace(/\bat the rate of\b/g, ' @ ')
      .replace(/\bat the rate\b/g, ' @ ')
      .replace(/\bat rate\b/g, ' @ ')
      .replace(/\b(dot|period|point)\b/g, '.')
      .replace(/\b(underscore|under score)\b/g, '_')
      .replace(/\b(dash|hyphen|minus)\b/g, '-')
      .replace(/\bg\s*mail\b/g, 'gmail')
      .replace(/\by\s*mail\b/g, 'yahoo')
      .replace(/\bhot\s*mail\b/g, 'hotmail')
      .replace(/\bout\s*look\b/g, 'outlook')
      .replace(/\bsee\s*oh\s*em\b|\bc\s*o\s*m\b/g, 'com')
      .replace(/\bi\s*n\b/g, 'in');

    // 5. Replace spoken single digit words (zero, one, two, ...)
    const enDigits: Record<string, string> = {
      zero: '0', one: '1', two: '2', three: '3', four: '4',
      five: '5', six: '6', seven: '7', eight: '8', nine: '9'
    };
    for (const [w, d] of Object.entries(enDigits)) {
      text = text.replace(new RegExp(`\\b${w}\\b`, 'g'), d);
    }

    // 6. Handle 'at' as '@' if preceding common domain or followed by email providers
    text = text.replace(/\s+at\s+(gmail|yahoo|hotmail|outlook|rediffmail|gov|nic|icloud|protonmail)/gi, ' @ $1');
    text = text.replace(/\s+at\s+/g, '@');

    // 7. If no '@' is present but a domain like 'gmail.com' exists, insert '@'
    if (!text.includes('@')) {
      text = text.replace(/\s*(gmail|yahoo|hotmail|outlook|rediffmail|gov|nic|icloud|protonmail)[\s.]*(com|in|co\.in|org|net|edu)/gi, '@$1.$2');
    }

    // 8. Normalize domain endings like 'gmail com' -> 'gmail.com', 'yahoo in' -> 'yahoo.in'
    text = text.replace(/(gmail|yahoo|hotmail|outlook|rediffmail|gov|nic|icloud|protonmail)\s+(com|in|org|net|edu|gov\.in|nic\.in|co\.in)/gi, '$1.$2');

    // 9. Remove all spaces around symbols and remove all remaining spaces
    text = text
      .replace(/\s*@\s*/g, '@')
      .replace(/\s*\.\s*/g, '.')
      .replace(/\s*_\s*/g, '_')
      .replace(/\s*-\s*/g, '-')
      .replace(/\s+/g, ''); // remove internal spaces in username

    // 10. Fix multiple dots or symbols
    text = text
      .replace(/\.+/g, '.')
      .replace(/@+/g, '@')
      .replace(/^\.+|\.+$/g, '');

    // 11. If user spoke something like "ravisingh@gmail" without ".com", append ".com"
    if (/@(gmail|yahoo|hotmail|outlook|rediffmail|icloud|protonmail)$/i.test(text)) {
      text = `${text}.com`;
    }

    // Keep only valid email characters (letters, numbers, ., _, -, @)
    text = text.replace(/[^a-z0-9._\-@]/gi, '').toLowerCase();

    return text;
  }

  public parseSpokenNumbers(text: string): string {
    if (!text) return '';
    let normalized = text.toLowerCase();

    // 1. Convert Devanagari digits ०-९ to ASCII 0-9
    normalized = normalized.replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966));

    // 2. Handle multipliers like double/triple/दो बार/तीन बार
    normalized = normalized.replace(/(?:double|डबल|दो बार)\s*([0-9a-zA-Z\u0900-\u097F]+)/gi, (_m, word) => {
      const d = HINDI_ENGLISH_NUMBERS_MAP[word.toLowerCase()] || word;
      return `${d} ${d}`;
    });
    normalized = normalized.replace(/(?:triple|ट्रिपल|तीन बार)\s*([0-9a-zA-Z\u0900-\u097F]+)/gi, (_m, word) => {
      const d = HINDI_ENGLISH_NUMBERS_MAP[word.toLowerCase()] || word;
      return `${d} ${d} ${d}`;
    });

    // 3. Handle English compound tens + units: "twenty five" -> "25", "ninety eight" -> "98"
    const compoundTens: Record<string, number> = {
      'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
    };
    const compoundUnits: Record<string, number> = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9
    };
    for (const [tenWord, tenVal] of Object.entries(compoundTens)) {
      for (const [unitWord, unitVal] of Object.entries(compoundUnits)) {
        const pattern = new RegExp(`\\b${tenWord}\\s+${unitWord}\\b`, 'gi');
        normalized = normalized.replace(pattern, String(tenVal + unitVal));
      }
    }

    // 4. Tokenize & convert using HINDI_ENGLISH_NUMBERS_MAP
    const words = normalized.split(/\s+/);
    const convertedWords = words.map((w) => {
      const cleanW = w.replace(/[.,:;\-]/g, '');
      return HINDI_ENGLISH_NUMBERS_MAP[cleanW] !== undefined ? HINDI_ENGLISH_NUMBERS_MAP[cleanW] : cleanW;
    });

    const joined = convertedWords.join(' ');
    const digitsOnly = joined.replace(/\D/g, '');
    return digitsOnly;
  }

  public extractCleanFieldValue(fieldKey: keyof CitizenFormData, rawTranscript: string): string {
    const raw = rawTranscript.trim();
    if (!raw) return '';

    switch (fieldKey) {
      case 'fullName': {
        const names = parseUttarakhandName(raw);
        return names.englishName || devanagariToEnglish(raw);
      }

      case 'fullNameHi': {
        const names = parseUttarakhandName(raw);
        return names.hindiName || latinToDevanagari(raw);
      }

      case 'fatherHusbandName': {
        const names = parseUttarakhandName(raw);
        return names.englishName || devanagariToEnglish(raw);
      }

      case 'fatherHusbandNameHi': {
        const names = parseUttarakhandName(raw);
        return names.hindiName || latinToDevanagari(raw);
      }

      case 'motherName': {
        const names = parseUttarakhandName(raw);
        return names.englishName || devanagariToEnglish(raw);
      }

      case 'motherNameHi': {
        const names = parseUttarakhandName(raw);
        return names.hindiName || latinToDevanagari(raw);
      }

      case 'villageWard': {
        const addr = parseBilingualAddress(raw);
        return addr.english || raw;
      }

      case 'villageWardHi': {
        const addr = parseBilingualAddress(raw);
        return addr.hindi || latinToDevanagari(raw);
      }

      case 'postOffice': {
        const addr = parseBilingualAddress(raw);
        return addr.english || raw;
      }

      case 'postOfficeHi': {
        const addr = parseBilingualAddress(raw);
        return addr.hindi || latinToDevanagari(raw);
      }

      case 'policeStation': {
        const addr = parseBilingualAddress(raw);
        return addr.english || raw;
      }

      case 'policeStationHi': {
        const addr = parseBilingualAddress(raw);
        return addr.hindi || latinToDevanagari(raw);
      }

      case 'state': {
        return raw.trim();
      }

      case 'stateHi': {
        return latinToDevanagari(raw.trim());
      }

      case 'addressLine': {
        const addr = parseBilingualAddress(raw);
        return addr.english || raw;
      }

      case 'addressLineHi': {
        const addr = parseBilingualAddress(raw);
        return addr.hindi || latinToDevanagari(raw);
      }

      case 'email': {
        const parsed = this.parseSpokenEmail(raw);
        return parsed || raw.toLowerCase().trim();
      }

      case 'mobileNumber': {
        const parsed = this.parseSpokenNumbers(raw);
        if (parsed.length >= 10) {
          return parsed.slice(-10);
        }
        return parsed || raw.replace(/\D/g, '').slice(-10);
      }

      case 'aadhaarNumber': {
        const parsed = this.parseSpokenNumbers(raw);
        if (parsed.length === 12) {
          return `${parsed.slice(0, 4)} ${parsed.slice(4, 8)} ${parsed.slice(8, 12)}`;
        }
        if (parsed.length > 0) {
          return parsed.slice(0, 12);
        }
        return raw;
      }

      case 'pinCode': {
        const parsed = this.parseSpokenNumbers(raw);
        if (parsed.length >= 6) {
          return parsed.slice(0, 6);
        }
        return parsed || raw.replace(/\D/g, '').slice(0, 6);
      }

      case 'annualIncome': {
        const lower = raw.toLowerCase();
        if (/एक लाख|1\s*lakh|one\s*lakh/i.test(lower)) return '100000';
        if (/दो लाख|2\s*lakh|two\s*lakh/i.test(lower)) return '200000';
        if (/डेढ़ लाख|1\.5\s*lakh/i.test(lower)) return '150000';
        if (/पचास हजार|50\s*thousand|fifty\s*thousand/i.test(lower)) return '50000';
        if (/साठ हजार|60\s*thousand|sixty\s*thousand/i.test(lower)) return '60000';
        if (/सत्तर हजार|70\s*thousand|seventy\s*thousand/i.test(lower)) return '70000';
        if (/अस्सी हजार|80\s*thousand|eighty\s*thousand/i.test(lower)) return '80000';
        if (/नब्बे हजार|90\s*thousand|ninety\s*thousand/i.test(lower)) return '90000';
        
        const parsedDigits = this.parseSpokenNumbers(raw);
        if (parsedDigits) return parsedDigits;
        const num = raw.replace(/\D/g, '');
        return num || raw;
      }

      case 'district': {
        const cleanLower = raw.toLowerCase();
        for (const dist of UTTARAKHAND_DISTRICTS) {
          const enMatch = new RegExp(`\\b${dist.nameEn}\\b|${dist.nameEn}`, 'i').test(cleanLower);
          const hiMatch = new RegExp(`${dist.nameHi}`, 'i').test(raw);
          const distScore = levenshtein(cleanLower, dist.nameEn.toLowerCase());
          if (enMatch || hiMatch || distScore <= 2) {
            return dist.nameEn;
          }
        }
        if (/dehradun|dehradoon|देहरादून|दून/i.test(cleanLower)) return 'Dehradun';
        if (/haridwar|hardwar|हरिद्वार/i.test(cleanLower)) return 'Haridwar';
        if (/nainital|नैनीताल/i.test(cleanLower)) return 'Nainital';
        if (/almora|अल्मोड़ा/i.test(cleanLower)) return 'Almora';
        if (/pauri|पौड़ी/i.test(cleanLower)) return 'Pauri Garhwal';
        if (/tehri|टिहरी/i.test(cleanLower)) return 'Tehri Garhwal';
        if (/chamoli|चमोली/i.test(cleanLower)) return 'Chamoli';
        if (/pithoragarh|पिथौरागढ़/i.test(cleanLower)) return 'Pithoragarh';
        if (/rudraprayag|रुद्रप्रयाग/i.test(cleanLower)) return 'Rudraprayag';
        if (/uttarkashi|उत्तरकाशी/i.test(cleanLower)) return 'Uttarkashi';
        if (/bageshwar|बागेश्वर/i.test(cleanLower)) return 'Bageshwar';
        if (/champawat|चंपावत/i.test(cleanLower)) return 'Champawat';
        if (/udham|rudrapur|ऊधम/i.test(cleanLower)) return 'Udham Singh Nagar';
        return raw;
      }

      case 'tehsil': {
        const cleanLower = raw.toLowerCase();
        for (const dist of UTTARAKHAND_DISTRICTS) {
          for (const teh of dist.tehsils) {
            if (
              new RegExp(`\\b${teh.nameEn}\\b|${teh.nameHi}`, 'i').test(cleanLower) ||
              levenshtein(cleanLower, teh.nameEn.toLowerCase()) <= 2
            ) {
              return teh.nameEn;
            }
          }
        }
        return raw.replace(/^(मेरी तहसील|तहसील है|तहसील|tehsil is|tehsil)\s+/i, '').trim();
      }

      case 'gender': {
        const cleanLower = raw.toLowerCase();
        if (/महिला|स्त्री|female|woman|girl|aurat/i.test(cleanLower)) return 'Female';
        if (/पुरुष|male|man|boy|purush/i.test(cleanLower)) return 'Male';
        if (/तृतीय|trans|अन्य/i.test(cleanLower)) return 'Transgender';
        return 'Male';
      }

      case 'casteCategory': {
        const cleanLower = raw.toLowerCase();
        if (/ओबीसी|obc|पिछड़ा|अन्य पिछड़ा/i.test(cleanLower)) return 'OBC';
        if (/अनुसूचित जाति|sc|अनुसूचित/i.test(cleanLower)) return 'SC';
        if (/जनजाति|st|tribal/i.test(cleanLower)) return 'ST';
        if (/ईडब्ल्यूएस|ews|आर्थिक/i.test(cleanLower)) return 'EWS';
        if (/सामान्य|general|gen/i.test(cleanLower)) return 'General';
        return 'General';
      }

      case 'dob': {
        const dateMatch = raw.match(/([0-3]?[0-9])[\/\-\.\s]+([0-1]?[0-9]|[A-Za-z\u0900-\u097F]+)[\/\-\.\s]+([1-2][0-9]{3})/);
        if (dateMatch) {
          const day = dateMatch[1].padStart(2, '0');
          let month = dateMatch[2];
          const year = dateMatch[3];

          if (/जनवरी|jan/i.test(month)) month = '01';
          else if (/फरवरी|feb/i.test(month)) month = '02';
          else if (/मार्च|mar/i.test(month)) month = '03';
          else if (/अप्रैल|apr/i.test(month)) month = '04';
          else if (/मई|may/i.test(month)) month = '05';
          else if (/जून|jun/i.test(month)) month = '06';
          else if (/जुलाई|jul/i.test(month)) month = '07';
          else if (/अगस्त|aug/i.test(month)) month = '08';
          else if (/सितंबर|sep/i.test(month)) month = '09';
          else if (/अक्टूबर|oct/i.test(month)) month = '10';
          else if (/नवंबर|nov/i.test(month)) month = '11';
          else if (/दिसंबर|dec/i.test(month)) month = '12';
          else month = month.padStart(2, '0');

          return `${year}-${month}-${day}`;
        }
        return raw;
      }

      case 'maritalStatus': {
        const cleanLower = raw.toLowerCase();
        if (/अविवाहित|unmarried|single|कुंवारा|कुंवारी/i.test(cleanLower)) return 'Unmarried';
        if (/विवाहित|married|शादीशुदा/i.test(cleanLower)) return 'Married';
        if (/विधवा|विधुर|widowed|widow/i.test(cleanLower)) return 'Widowed';
        if (/तलाकशुदा|divorced|तलाक/i.test(cleanLower)) return 'Divorced';
        return 'Unmarried';
      }

      case 'relationType': {
        const cleanLower = raw.toLowerCase();
        if (/पति|husband/i.test(cleanLower)) return 'Husband';
        if (/संरक्षक|अभिभावक|guardian/i.test(cleanLower)) return 'Guardian';
        if (/पिता|father/i.test(cleanLower)) return 'Father';
        return 'Father';
      }

      case 'livingSinceYears': {
        const parsed = this.parseSpokenNumbers(raw);
        if (parsed) return parsed;
        const num = raw.replace(/\D/g, '');
        return num || raw;
      }

      default: {
        let clean = raw
          .replace(/^(मेरा नाम है|मेरा नाम|नाम है|आवेदक का नाम|पिता का नाम|माता का नाम|पता है|लिखिए|कृपया लिखिए|my name is|name is|it is)\s+/i, '')
          .replace(/\s+(है|rakhiye|kijiye|rakho|likho|likhiye)$/i, '')
          .trim();

        if (/^[a-zA-Z\s]+$/.test(clean)) {
          clean = clean
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }
        return clean || raw;
      }
    }
  }

  public startListening(
    onInterim: (text: string) => void,
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (err: string) => void,
    onStateChange: (listening: boolean) => void
  ) {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      onError('आपके ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया गूगल क्रोम का उपयोग करें।');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.cancelSpeech();

    try {
      this.recognition = new SpeechRecognitionClass();
      if (!this.recognition) return;

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 5;
      this.recognition.lang = this.getBCP47Lang(this.currentMode);

      this.recognition.onstart = () => {
        this.isListening = true;
        onStateChange(true);
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          onInterim(interimTranscript);
        }

        const textToParse = finalTranscript.trim() || interimTranscript.trim();
        if (textToParse) {
          const parsed = this.parseVoiceIntent(textToParse);
          if (parsed.fieldMatches.length > 0) {
            onResult(parsed);
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          onError('माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।');
        } else if (event.error !== 'no-speech') {
          onError(`ध्वनि इनपुट त्रुटि: ${event.error}`);
        }
        this.isListening = false;
        onStateChange(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onStateChange(false);
      };

      this.recognition.start();
    } catch (e: any) {
      onError(e.message || 'ध्वनि पहचान प्रारंभ करने में विफल');
      this.isListening = false;
      onStateChange(false);
    }
  }

  public parseVoiceIntent(transcript: string): VoiceRecognitionResult {
    const fieldMatches: Array<{
      fieldKey: keyof CitizenFormData;
      value: string;
      displayLabel: string;
    }> = [];

    // 1. Name Match
    const nameMatch = transcript.match(
      /(?:मेरा नाम है|मेरा नाम|नाम है|आवेदक का नाम|my name is|name is|name)\s+([A-Za-z\u0900-\u097F\s]{2,30})(?:\s+है|\s+rakhiye|\s+kijiye|$)/i
    );
    if (nameMatch) {
      const parsedNames = parseUttarakhandName(nameMatch[1].trim());
      fieldMatches.push({
        fieldKey: 'fullName',
        value: parsedNames.englishName,
        displayLabel: 'आवेदक का नाम (अंग्रेजी)'
      });

      if (parsedNames.hindiName) {
        fieldMatches.push({
          fieldKey: 'fullNameHi',
          value: parsedNames.hindiName,
          displayLabel: 'पूरा नाम (हिंदी में)'
        });
      }
    }

    // 2. Father Match
    const fatherMatch = transcript.match(
      /(?:पिता का नाम|पिताजी का नाम|पति का नाम|father name is|father is|father name)\s+([A-Za-z\u0900-\u097F\s]{2,30})(?:\s+है|$)/i
    );
    if (fatherMatch) {
      const parsedFather = parseUttarakhandName(fatherMatch[1].trim());
      fieldMatches.push({
        fieldKey: 'fatherHusbandName',
        value: parsedFather.englishName,
        displayLabel: "पिता/पति का नाम"
      });
    }

    // 3. Mother Match
    const motherMatch = transcript.match(
      /(?:माता का नाम|माताजी का नाम|mother name is|mother is|mother name)\s+([A-Za-z\u0900-\u097F\s]{2,30})(?:\s+है|$)/i
    );
    if (motherMatch) {
      const parsedMother = parseUttarakhandName(motherMatch[1].trim());
      fieldMatches.push({
        fieldKey: 'motherName',
        value: parsedMother.englishName,
        displayLabel: "माता का नाम"
      });
    }

    // 4. District & Tehsil Match
    for (const dist of UTTARAKHAND_DISTRICTS) {
      const enRegex = new RegExp(`(?:district|dist|जिला|जनपद)\\s+${dist.nameEn}|\\b${dist.nameEn}\\b`, 'i');
      const hiRegex = new RegExp(`(?:जिला|जनपद)\\s*${dist.nameHi}|${dist.nameHi}`, 'i');

      if (enRegex.test(transcript) || hiRegex.test(transcript)) {
        fieldMatches.push({
          fieldKey: 'district',
          value: dist.nameEn,
          displayLabel: `जिला: ${dist.nameHi} (${dist.nameEn})`
        });

        for (const teh of dist.tehsils) {
          if (new RegExp(`\\b${teh.nameEn}\\b|${teh.nameHi}`, 'i').test(transcript)) {
            fieldMatches.push({
              fieldKey: 'tehsil',
              value: teh.nameEn,
              displayLabel: `तहसील: ${teh.nameHi} (${teh.nameEn})`
            });
            break;
          }
        }
        break;
      }
    }

    // Direct Tehsil Match
    if (!fieldMatches.some((f) => f.fieldKey === 'tehsil')) {
      for (const dist of UTTARAKHAND_DISTRICTS) {
        for (const teh of dist.tehsils) {
          if (new RegExp(`(?:तहसील|tehsil)\\s+${teh.nameEn}|\\b${teh.nameEn}\\b|${teh.nameHi}`, 'i').test(transcript)) {
            fieldMatches.push({
              fieldKey: 'district',
              value: dist.nameEn,
              displayLabel: `जिला: ${dist.nameHi}`
            });
            fieldMatches.push({
              fieldKey: 'tehsil',
              value: teh.nameEn,
              displayLabel: `तहसील: ${teh.nameHi}`
            });
            break;
          }
        }
      }
    }

    // 5. Mobile Number Match
    const mobileMatch = transcript.match(
      /(?:मोबाइल नंबर|मोबाइल|फोन नंबर|फोन|दूरभाष|mobile number|phone number|mobile|phone)[\s:]*([A-Za-z\u0900-\u097F0-9\s]{4,40})/i
    );
    let capturedMobile = '';
    if (mobileMatch) {
      const clean = this.parseSpokenNumbers(mobileMatch[1]);
      if (clean.length >= 10) {
        capturedMobile = clean.slice(-10);
      }
    }
    if (!capturedMobile) {
      const allSpokenDigits = this.parseSpokenNumbers(transcript);
      if (allSpokenDigits.length === 10 || (allSpokenDigits.length === 12 && allSpokenDigits.startsWith('91'))) {
        capturedMobile = allSpokenDigits.slice(-10);
      }
    }
    if (capturedMobile) {
      fieldMatches.push({
        fieldKey: 'mobileNumber',
        value: capturedMobile,
        displayLabel: 'मोबाइल नंबर'
      });
    }

    // 6. Aadhaar Match
    const aadhaarMatch = transcript.match(
      /(?:आधार नंबर|आधार कार्ड|आधार|aadhaar number|aadhaar)[\s:]*([A-Za-z\u0900-\u097F0-9\s]{10,30})/i
    );
    if (aadhaarMatch) {
      const cleanDigits = this.parseSpokenNumbers(aadhaarMatch[1]);
      if (cleanDigits.length === 12) {
        fieldMatches.push({
          fieldKey: 'aadhaarNumber',
          value: `${cleanDigits.slice(0, 4)} ${cleanDigits.slice(4, 8)} ${cleanDigits.slice(8, 12)}`,
          displayLabel: 'आधार कार्ड संख्या'
        });
      }
    } else {
      const standaloneDigits = this.parseSpokenNumbers(transcript);
      if (standaloneDigits.length === 12) {
        fieldMatches.push({
          fieldKey: 'aadhaarNumber',
          value: `${standaloneDigits.slice(0, 4)} ${standaloneDigits.slice(4, 8)} ${standaloneDigits.slice(8, 12)}`,
          displayLabel: 'आधार कार्ड संख्या'
        });
      }
    }

    // 7. Income Match
    const incomeMatch = transcript.match(
      /(?:वार्षिक आय|आय|annual income|income)[\s:]*([0-9]+|एक लाख|दो लाख|पचास हजार|साठ हजार|सत्तर हजार|अस्सी हजार|नब्बे हजार|[A-Za-z\u0900-\u097F0-9\s]+)/i
    );
    if (incomeMatch) {
      const cleanIncome = this.extractCleanFieldValue('annualIncome', incomeMatch[1]);
      if (cleanIncome) {
        fieldMatches.push({
          fieldKey: 'annualIncome',
          value: cleanIncome,
          displayLabel: 'वार्षिक आय'
        });
      }
    }

    // 8. PIN Code Match
    const pinMatch = transcript.match(/(?:पिन कोड|पिनकोड|pin code|pincode)[\s:]*([A-Za-z\u0900-\u097F0-9\s]{4,15})/i);
    if (pinMatch) {
      const cleanPin = this.parseSpokenNumbers(pinMatch[1]);
      if (cleanPin.length >= 6) {
        const pin6 = cleanPin.slice(0, 6);
        fieldMatches.push({
          fieldKey: 'pinCode',
          value: pin6,
          displayLabel: 'पिन कोड'
        });

        // Auto resolve address hierarchy from PIN code
        const pinData = lookupPincodeSync(pin6);
        if (pinData) {
          fieldMatches.push({
            fieldKey: 'district',
            value: pinData.district,
            displayLabel: `जिला: ${pinData.district} (${pinData.districtHi})`
          });
          fieldMatches.push({
            fieldKey: 'districtHi',
            value: pinData.districtHi,
            displayLabel: `जिला (हिंदी): ${pinData.districtHi}`
          });
          fieldMatches.push({
            fieldKey: 'tehsil',
            value: pinData.tehsil,
            displayLabel: `तहसील: ${pinData.tehsil} (${pinData.tehsilHi})`
          });
          fieldMatches.push({
            fieldKey: 'tehsilHi',
            value: pinData.tehsilHi,
            displayLabel: `तहसील (हिंदी): ${pinData.tehsilHi}`
          });
          fieldMatches.push({
            fieldKey: 'postOffice',
            value: pinData.postOffice,
            displayLabel: `डाकघर: ${pinData.postOffice}`
          });
          fieldMatches.push({
            fieldKey: 'postOfficeHi',
            value: pinData.postOfficeHi,
            displayLabel: `डाकघर (हिंदी): ${pinData.postOfficeHi}`
          });
          fieldMatches.push({
            fieldKey: 'policeStation',
            value: pinData.policeStation,
            displayLabel: `थाना: ${pinData.policeStation}`
          });
          fieldMatches.push({
            fieldKey: 'policeStationHi',
            value: pinData.policeStationHi,
            displayLabel: `थाना (हिंदी): ${pinData.policeStationHi}`
          });
        }
      }
    }

    // 9. Gender Match
    if (/(?:लिंग|gender)\s+(?:महिला|स्त्री|female)|\b(?:महिला|स्त्री|female)\b/i.test(transcript)) {
      fieldMatches.push({
        fieldKey: 'gender',
        value: 'Female',
        displayLabel: 'लिंग: महिला (Female)'
      });
    } else if (/(?:लिंग|gender)\s+(?:पुरुष|male)|\b(?:पुरुष|male)\b/i.test(transcript)) {
      fieldMatches.push({
        fieldKey: 'gender',
        value: 'Male',
        displayLabel: 'लिंग: पुरुष (Male)'
      });
    }

    // 10. Social Category Match
    if (/(?:जाति|category|वर्ग|श्रेणी)\s+(?:ओबीसी|obc|अन्य पिछड़ा)|\b(?:ओबीसी|obc|अन्य पिछड़ा)\b/i.test(transcript)) {
      fieldMatches.push({
        fieldKey: 'casteCategory',
        value: 'OBC',
        displayLabel: 'सामाजिक वर्ग: अन्य पिछड़ा वर्ग (OBC)'
      });
    } else if (/(?:अनुसूचित जाति|sc)\b/i.test(transcript)) {
      fieldMatches.push({
        fieldKey: 'casteCategory',
        value: 'SC',
        displayLabel: 'सामाजिक वर्ग: अनुसूचित जाति (SC)'
      });
    } else if (/(?:अनुसूचित जनजाति|st)\b/i.test(transcript)) {
      fieldMatches.push({
        fieldKey: 'casteCategory',
        value: 'ST',
        displayLabel: 'सामाजिक वर्ग: अनुसूचित जनजाति (ST)'
      });
    } else if (/(?:सामान्य|general)\b/i.test(transcript)) {
      fieldMatches.push({
        fieldKey: 'casteCategory',
        value: 'General',
        displayLabel: 'सामाजिक वर्ग: सामान्य (General)'
      });
    }

    // 11. Address / Village Match
    const addrMatch = transcript.match(/(?:पता|गाँव|ग्राम|निवास|वार्ड|address is|address)[\s:]+([A-Za-z\u0900-\u097F0-9\s,\-\/]{3,50})/i);
    if (addrMatch) {
      fieldMatches.push({
        fieldKey: 'villageWard',
        value: addrMatch[1].trim(),
        displayLabel: 'ग्राम अथवा वार्ड'
      });
    }

    // 12. Email Match
    const emailMatch = transcript.match(
      /(?:ईमेल पता|ईमेल आईडी|ईमेल|email address|email id|email)[\s:]*([A-Za-z0-9\u0900-\u097F._@\s\-]+)/i
    );
    if (emailMatch) {
      const parsedEmail = this.parseSpokenEmail(emailMatch[1]);
      if (parsedEmail.includes('@') && parsedEmail.includes('.')) {
        fieldMatches.push({
          fieldKey: 'email',
          value: parsedEmail,
          displayLabel: 'ईमेल पता'
        });
      }
    } else if (/@|gmail|yahoo|hotmail|outlook|rediffmail|\.com|\.in/i.test(transcript)) {
      const parsedEmail = this.parseSpokenEmail(transcript);
      if (parsedEmail.includes('@') && parsedEmail.includes('.')) {
        fieldMatches.push({
          fieldKey: 'email',
          value: parsedEmail,
          displayLabel: 'ईमेल पता'
        });
      }
    }

    return {
      transcript,
      fieldMatches
    };
  }
}

export const voiceAssistantService = new VoiceAssistant();
