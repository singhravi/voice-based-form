import React, { useState, useEffect } from 'react';
import { CitizenFormData, Language } from '../types';
import { voiceAssistantService, FIELD_VOICE_CONFIGS, VoiceLanguageMode } from '../utils/voiceAssistant';
import { parseUttarakhandName } from '../utils/uttarakhandPhonetics';
import {
  Mic,
  Volume2,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CitizenFormData;
  onUpdateField: (key: keyof CitizenFormData, value: string, source: 'voice') => void;
  language: Language;
}

interface StepQuestion {
  key: keyof CitizenFormData;
  questionHi: string;
  questionEn: string;
  hintHi: string;
  hintEn: string;
}

const GUIDED_STEPS: StepQuestion[] = [
  {
    key: 'fullName',
    questionHi: 'नमस्कार! कृपया अपना पूरा नाम बोलें, जैसे रमेश सिंह नेगी अथवा रवि शंकर सिंह।',
    questionEn: 'Welcome! First, please speak your full name.',
    hintHi: 'उदा. "रमेश सिंह नेगी" अथवा "रवि शंकर सिंह"',
    hintEn: 'e.g. "Ramesh Singh Negi" or "Ravi Shankar Singh"'
  },
  {
    key: 'fatherHusbandName',
    questionHi: 'आपके पिता अथवा पति का क्या नाम है? कृपया बोलें।',
    questionEn: "What is your father's or husband's name?",
    hintHi: 'उदा. "बीरेंद्र सिंह नेगी"',
    hintEn: 'e.g. "Birendra Singh Negi"'
  },
  {
    key: 'gender',
    questionHi: 'आपका लिंग क्या है? बोलें: पुरुष अथवा महिला।',
    questionEn: 'What is your gender? Speak: Male or Female.',
    hintHi: '"पुरुष" अथवा "महिला"',
    hintEn: '"Male" or "Female"'
  },
  {
    key: 'dob',
    questionHi: 'आपकी जन्म तिथि क्या है? कृपया बोलें जैसे चौदह मई उन्नीस सौ छियानवे।',
    questionEn: 'What is your date of birth?',
    hintHi: 'उदा. "14 मई 1996" अथवा "14 05 1996"',
    hintEn: 'e.g. "14 May 1996"'
  },
  {
    key: 'mobileNumber',
    questionHi: 'अपना दस अंकों का मोबाइल नंबर बोलें।',
    questionEn: 'Please speak your 10-digit mobile number.',
    hintHi: 'उदा. "9897 123 456"',
    hintEn: 'e.g. "9897 123 456"'
  },
  {
    key: 'email',
    questionHi: 'अपना ईमेल पता बोलें, जैसे ravi.singh@gmail.com अथवा "नहीं है" बोलें।',
    questionEn: 'Speak your email address, like ravi.singh@gmail.com or say "none".',
    hintHi: 'उदा. "ravi.singh@gmail.com"',
    hintEn: 'e.g. "ravi.singh@gmail.com"'
  },
  {
    key: 'aadhaarNumber',
    questionHi: 'अपना बारह अंकों का आधार कार्ड नंबर बोलें।',
    questionEn: 'Please speak your 12-digit Aadhaar number.',
    hintHi: 'उदा. "7829 4410 9821"',
    hintEn: 'e.g. "7829 4410 9821"'
  },
  {
    key: 'district',
    questionHi: 'आप उत्तराखंड के किस जिले में रहते हैं? जैसे देहरादून, अल्मोड़ा, हरिद्वार, नैनीताल...',
    questionEn: 'Which Uttarakhand district do you live in? Like Dehradun, Almora, Nainital...',
    hintHi: 'उदा. "देहरादून", "अल्मोड़ा", "हरिद्वार", "नैनीताल"',
    hintEn: 'e.g. "Dehradun", "Almora", "Nainital"'
  },
  {
    key: 'villageWard',
    questionHi: 'आपके गाँव अथवा वार्ड का क्या नाम है?',
    questionEn: 'What is the name of your village or ward?',
    hintHi: 'उदा. "राजपुर रोड वार्ड 12" अथवा गाँव का नाम',
    hintEn: 'e.g. "Rajpur Road Ward 12"'
  },
  {
    key: 'pinCode',
    questionHi: 'अपना छह अंकों का डाक पिन कोड बोलें।',
    questionEn: 'Speak your 6-digit postal PIN code.',
    hintHi: 'उदा. "248001"',
    hintEn: 'e.g. "248001"'
  },
  {
    key: 'annualIncome',
    questionHi: 'आपके परिवार की कुल वार्षिक आय कितनी है?',
    questionEn: 'What is your total annual household income?',
    hintHi: 'उदा. "साठ हजार", "अस्सी हजार", "एक लाख"',
    hintEn: 'e.g. "60000", "80000", "1 lakh"'
  },
  {
    key: 'maritalStatus',
    questionHi: 'आपकी वैवाहिक स्थिति क्या है? बोलें: विवाहित, अविवाहित, अथवा अन्य।',
    questionEn: 'What is your marital status? Speak: Married, Unmarried, Widowed, or Divorced.',
    hintHi: '"विवाहित" अथवा "अविवाहित"',
    hintEn: '"Married" or "Unmarried"'
  },
  {
    key: 'relationType',
    questionHi: 'अभिभावक अथवा संरक्षक का संबंध प्रकार क्या है? बोलें: पिता, पति, अथवा संरक्षक।',
    questionEn: 'What is the relationship type? Speak: Father, Husband, or Guardian.',
    hintHi: '"पिता", "पति" अथवा "संरक्षक"',
    hintEn: '"Father", "Husband" or "Guardian"'
  },
  {
    key: 'livingSinceYears',
    questionHi: 'आप उत्तराखंड में कितने वर्षों से निवास कर रहे हैं?',
    questionEn: 'How many years have you been living in Uttarakhand?',
    hintHi: 'उदा. "20 वर्ष" अथवा "25 वर्ष"',
    hintEn: 'e.g. "20" or "25"'
  },
  {
    key: 'casteCategory',
    questionHi: 'आपकी सामाजिक श्रेणी क्या है? बोलें: सामान्य, अन्य पिछड़ा वर्ग, अनुसूचित जाति अथवा जनजाति।',
    questionEn: 'What is your social category? General, OBC, SC, ST, or EWS.',
    hintHi: '"सामान्य", "अन्य पिछड़ा वर्ग", "अनुसूचित जाति"',
    hintEn: '"General", "OBC", "SC", "ST"'
  }
];

export const GuidedVoiceModal: React.FC<GuidedVoiceModalProps> = ({
  isOpen,
  onClose,
  formData,
  onUpdateField,
  language
}) => {
  const isHi = language === 'hi';
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [currentRecordedValue, setCurrentRecordedValue] = useState<string>('');
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [alternativeChoices, setAlternativeChoices] = useState<string[]>([]);
  const [voiceMode, setVoiceMode] = useState<VoiceLanguageMode>(language === 'hi' ? 'hindi' : 'english');

  const currentStep = GUIDED_STEPS[currentStepIndex];
  const config = FIELD_VOICE_CONFIGS[currentStep.key as string];

  useEffect(() => {
    if (isOpen) {
      askCurrentQuestion();
    } else {
      voiceAssistantService.stopListening();
    }
  }, [isOpen, currentStepIndex]);

  const askCurrentQuestion = () => {
    setIsListening(false);
    setInterimText('');
    setAlternativeChoices([]);
    const currentValue = String(formData[currentStep.key] || '');
    setCurrentRecordedValue(currentValue);

    const questionText = isHi ? currentStep.questionHi : currentStep.questionEn;
    setIsSpeakingPrompt(true);

    voiceAssistantService.speak(questionText, language, () => {
      setIsSpeakingPrompt(false);
      startListeningToAnswer();
    });
  };

  const startListeningToAnswer = () => {
    setIsListening(true);
    setInterimText('');
    setAlternativeChoices([]);

    const activeMode = voiceMode;

    voiceAssistantService.listenForField(currentStep.key, {
      speakPromptFirst: false,
      voiceMode: activeMode,
      lang: language,
      onListeningState: (state) => setIsListening(state),
      onInterim: (text) => setInterimText(text),
      onSuccess: (value, _label, _raw, extraData) => {
        if (currentStep.key === 'fullName') {
          const names = parseUttarakhandName(value);
          setCurrentRecordedValue(names.hindiName || value);
          onUpdateField('fullName', names.englishName || value, 'voice');
          if (names.hindiName) {
            onUpdateField('fullNameHi', names.hindiName, 'voice');
          }
        } else {
          setCurrentRecordedValue(value);
          onUpdateField(currentStep.key, value, 'voice');
        }

        if (extraData?.alternativeChoices && extraData.alternativeChoices.length > 1) {
          setAlternativeChoices(extraData.alternativeChoices);
        }

        setIsListening(false);
      },
      onError: () => {
        setIsListening(false);
      }
    });
  };

  const handleSelectChoice = (choice: string) => {
    if (currentStep.key === 'fullName') {
      const names = parseUttarakhandName(choice);
      setCurrentRecordedValue(names.hindiName || choice);
      onUpdateField('fullName', names.englishName || choice, 'voice');
      if (names.hindiName) {
        onUpdateField('fullNameHi', names.hindiName, 'voice');
      }
    } else {
      setCurrentRecordedValue(choice);
      onUpdateField(currentStep.key, choice, 'voice');
    }
  };

  const handleNext = () => {
    if (currentStepIndex < GUIDED_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      confetti({ particleCount: 70, spread: 60 });
      voiceAssistantService.speak(
        isHi
          ? 'बधाई हो! आपके सभी मुख्य विवरण आवाज़ द्वारा दर्ज हो चुके हैं।'
          : 'Congratulations! All primary fields have been filled via voice.',
        language
      );
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-emerald-500 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Inclusivity Header */}
        <div className="bg-gradient-to-r from-[#06402f] via-[#0a5c44] to-[#128060] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black text-xl">
              <Volume2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/30 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-300/40">
                  {isHi ? 'सर्व-समावेशी ध्वनि सहायक 2.0' : 'High-Accuracy Voice Flow'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-0.5">
                {isHi ? 'बोलकर आसान पंजीकरण (सुनें और बोलें)' : 'Step-by-Step Voice Assisted Filling'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Voice Mode Switch */}
            <div className="hidden sm:flex items-center bg-black/30 p-1 rounded-xl text-xs">
              <button
                onClick={() => {
                  setVoiceMode('hinglish');
                  voiceAssistantService.setVoiceMode('hinglish');
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                  voiceMode === 'hinglish' ? 'bg-amber-400 text-slate-950' : 'text-emerald-200'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => {
                  setVoiceMode('hindi');
                  voiceAssistantService.setVoiceMode('hindi');
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                  voiceMode === 'hindi' ? 'bg-amber-400 text-slate-950' : 'text-emerald-200'
                }`}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={() => {
                voiceAssistantService.stopListening();
                onClose();
              }}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-900">
          <span>
            {isHi ? `प्रश्न ${currentStepIndex + 1} / ${GUIDED_STEPS.length}` : `Question ${currentStepIndex + 1} of ${GUIDED_STEPS.length}`}
          </span>
          <div className="flex-1 max-w-xs mx-4 bg-emerald-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / GUIDED_STEPS.length) * 100}%` }}
            />
          </div>
          <span>
            {Math.round(((currentStepIndex + 1) / GUIDED_STEPS.length) * 100)}%
          </span>
        </div>

        {/* Main Interactive Stage */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col items-center text-center space-y-6">
          {/* Question Text Box (Spoken aloud) */}
          <div className="w-full bg-slate-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-xs relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {isHi ? config?.labelHi : config?.labelEn}
              </span>
              <button
                onClick={askCurrentQuestion}
                className="p-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                title={isHi ? 'प्रश्न दोबारा सुनें' : 'Listen Again'}
              >
                <Volume2 size={16} />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {isHi ? currentStep.questionHi : currentStep.questionEn}
            </h2>

            <p className="text-xs font-semibold text-slate-500 mt-2">
              {isHi ? currentStep.hintHi : currentStep.hintEn}
            </p>
          </div>

          {/* Big Tactile Microphone Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                if (isListening) {
                  voiceAssistantService.stopListening();
                  setIsListening(false);
                } else {
                  startListeningToAnswer();
                }
              }}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 text-white scale-110 ring-8 ring-purple-300 animate-pulse'
                  : 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white hover:scale-105 shadow-emerald-200'
              }`}
            >
              <Mic size={44} className={isListening ? 'animate-bounce' : ''} />
              <span className="text-[11px] font-extrabold uppercase mt-1">
                {isListening ? (isHi ? 'सुन रहा हूँ...' : 'Listening...') : isHi ? 'बोलने हेतु दबाएं' : 'Tap to Speak'}
              </span>
            </button>

            {isSpeakingPrompt && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Volume2 size={14} className="animate-pulse" />
                <span>{isHi ? 'सहायक बोल रहा है...' : 'Assistant is speaking...'}</span>
              </div>
            )}

            {interimText && (
              <div className="mt-3 text-sm italic font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full max-w-md animate-fade-in">
                "{interimText}"
              </div>
            )}
          </div>

          {/* Current Captured Answer Box with In-Place Correction */}
          <div className="w-full max-w-md bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-sm text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span>{isHi ? 'दर्ज उत्तर (त्रुटि होने पर यहाँ सुधारें):' : 'Captured Answer (Edit to Correct):'}</span>
              </span>
              {currentRecordedValue && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {isHi ? 'पुष्टि करें / सुधारें' : 'Review & Correct'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentRecordedValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentRecordedValue(val);
                  if (currentStep.key === 'fullName') {
                    const names = parseUttarakhandName(val);
                    onUpdateField('fullName', names.englishName || val, 'voice');
                    if (names.hindiName) {
                      onUpdateField('fullNameHi', names.hindiName, 'voice');
                    }
                  } else {
                    onUpdateField(currentStep.key, val, 'voice');
                  }
                }}
                placeholder={isHi ? 'यहाँ बोलें अथवा सुधार हेतु टाइप करें...' : 'Speak or type here to correct...'}
                className="flex-1 text-sm sm:text-base font-bold text-slate-900 bg-slate-50 px-3.5 py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:bg-white outline-none transition-all"
              />
              <button
                type="button"
                onClick={startListeningToAnswer}
                className="p-2.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                title={isHi ? 'दोबारा बोलें' : 'Re-speak'}
              >
                <RotateCcw size={16} />
                <span className="text-xs hidden sm:inline">{isHi ? 'पुनः बोलें' : 'Re-speak'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-1.5">
              {isHi
                ? '💡 यदि आवाज़ से गलत शब्द दर्ज हुआ है, तो ऊपर बॉक्स में सीधे सुधार कर सकते हैं या पुनः बोल सकते हैं।'
                : '💡 If transcribed incorrectly, you can directly edit the text above or click Re-speak.'}
            </p>

            {/* Alternative Candidate Suggestions */}
            {alternativeChoices.length > 1 && (
              <div className="mt-3 pt-2 border-t border-slate-200 text-left">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">
                  {isHi ? 'संभावित उच्चारण विकल्प (क्लिक करके चुनें):' : 'Suggested phonetic alternatives (click to select):'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {alternativeChoices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectChoice(choice)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        choice === currentRecordedValue
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex items-center justify-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft size={16} />
            <span>{isHi ? 'पिछला सवाल' : 'Previous'}</span>
          </button>

          <button
            onClick={askCurrentQuestion}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>{isHi ? 'सवाल दोहराएं' : 'Repeat Question'}</span>
          </button>

          <button
            onClick={handleNext}
            className="btn-primary text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>
              {currentStepIndex === GUIDED_STEPS.length - 1
                ? isHi ? 'पूर्ण करें (Finish)' : 'Finish'
                : isHi ? 'अगला सवाल (Next)' : 'Next Question'}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
