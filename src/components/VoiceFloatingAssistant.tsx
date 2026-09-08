import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { voiceAssistantService } from '../utils/voiceAssistant';
import { CitizenFormData, Language, VoiceRecognitionResult } from '../types';

interface VoiceFloatingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoiceData: (fields: Array<{ fieldKey: keyof CitizenFormData; value: string; displayLabel: string }>) => void;
  language: Language;
}

export const VoiceFloatingAssistant: React.FC<VoiceFloatingAssistantProps> = ({
  isOpen,
  onClose,
  onApplyVoiceData,
  language
}) => {
  const isHi = language === 'hi';
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [recentMatches, setRecentMatches] = useState<Array<{ fieldKey: keyof CitizenFormData; value: string; displayLabel: string }>>([]);
  const [statusMessage, setStatusMessage] = useState(
    isHi ? 'माइक पर क्लिक करके बोलें...' : 'Click the microphone and speak...'
  );

  useEffect(() => {
    voiceAssistantService.setLanguage(language);
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      voiceAssistantService.stopListening();
      setIsListening(false);
      setStatusMessage(isHi ? 'माइक रुका हुआ है' : 'Microphone paused');
    } else {
      setInterimText('');
      setStatusMessage(isHi ? 'सुन रहा हूँ... कृपया बोलें' : 'Listening... please speak');

      voiceAssistantService.startListening(
        (interim) => {
          setInterimText(interim);
        },
        (result: VoiceRecognitionResult) => {
          setInterimText('');
          if (result.fieldMatches.length > 0) {
            setRecentMatches((prev) => [...result.fieldMatches, ...prev]);
            onApplyVoiceData(result.fieldMatches);

            // Audio confirmation feedback
            const firstMatch = result.fieldMatches[0];
            const speakText = isHi
              ? `${firstMatch.displayLabel} दर्ज कर दिया गया है`
              : `${firstMatch.displayLabel} updated`;
            voiceAssistantService.speak(speakText, language);

            setStatusMessage(
              isHi
                ? `सफलता: ${result.fieldMatches.length} विवरण फॉर्म में भरे गए`
                : `Updated ${result.fieldMatches.length} field(s)`
            );
          } else {
            setStatusMessage(
              isHi
                ? `सुना: "${result.transcript}" (कृपया नाम, जिला या पिता का नाम स्पष्ट बोलें)`
                : `Heard: "${result.transcript}"`
            );
          }
        },
        (err) => {
          setStatusMessage(`त्रुटि (Error): ${err}`);
          setIsListening(false);
        },
        (state) => {
          setIsListening(state);
        }
      );
    }
  };

  const sampleVoicePrompts = isHi
    ? [
        'मेरा नाम राजेश नेगी है',
        'पिता का नाम बीरेंद्र नेगी',
        'जिला देहरादून',
        'तहसील विकासनगर',
        'पिन कोड 248198',
        'मोबाइल नंबर 9897123456',
        'वार्षिक आय 60000',
        'लिंग पुरुष'
      ]
    : [
        'My name is Ramesh Singh',
        'Father name is Birendra Singh',
        'District Almora',
        'Tehsil Ranikhet',
        'PIN code 263645',
        'Mobile number 9897112233',
        'Annual income 80000'
      ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[92vw] sm:w-[420px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-300 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles size={18} className="text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-tight">
              {isHi ? 'उत्तराखंड ई-सेवा ध्वनि सहायक' : 'Uttarakhand Voice Assistant'}
            </h3>
            <p className="text-[11px] text-purple-200">
              {isHi ? 'हिंदी एवं अंग्रेजी में बोलकर फॉर्म भरें' : 'Speak in Hindi or English to Auto-Fill'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (isListening) toggleListening();
            onClose();
          }}
          className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Pulsing Mic Visualizer */}
        <div className="flex flex-col items-center justify-center py-3 bg-purple-50/50 rounded-xl border border-purple-100">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
              isListening
                ? 'bg-gradient-to-br from-rose-500 to-purple-600 text-white scale-110 shadow-rose-200 ring-8 ring-purple-200 animate-pulse'
                : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:scale-105 shadow-purple-200'
            }`}
          >
            {isListening ? <Mic size={32} className="animate-bounce" /> : <Mic size={32} />}
          </button>

          {/* Waveform Indicator */}
          {isListening && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1 bg-purple-600 rounded-full animate-[voice-wave_0.8s_ease-in-out_infinite]" />
              <span className="w-1 bg-purple-500 rounded-full animate-[voice-wave_0.6s_ease-in-out_infinite_0.2s]" />
              <span className="w-1 bg-indigo-600 rounded-full animate-[voice-wave_1s_ease-in-out_infinite_0.4s]" />
              <span className="w-1 bg-purple-600 rounded-full animate-[voice-wave_0.7s_ease-in-out_infinite_0.1s]" />
              <span className="w-1 bg-purple-400 rounded-full animate-[voice-wave_0.9s_ease-in-out_infinite_0.3s]" />
            </div>
          )}

          <p className="text-xs font-semibold text-purple-900 mt-2 text-center px-4">
            {statusMessage}
          </p>

          {interimText && (
            <div className="mt-2 text-xs italic text-slate-600 bg-white px-3 py-1 rounded-lg border border-purple-200 max-w-[90%] truncate">
              "{interimText}"
            </div>
          )}
        </div>

        {/* Quick Voice Suggestion Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            {isHi ? 'उदाहरण के लिए ऐसे बोलें (Try saying):' : 'Suggested Voice Commands:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleVoicePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const parsed = voiceAssistantService.parseVoiceIntent(prompt);
                  if (parsed.fieldMatches.length > 0) {
                    setRecentMatches((prev) => [...parsed.fieldMatches, ...prev]);
                    onApplyVoiceData(parsed.fieldMatches);
                    const first = parsed.fieldMatches[0];
                    voiceAssistantService.speak(
                      isHi ? `${first.displayLabel} दर्ज किया गया` : `${first.displayLabel} updated`,
                      language
                    );
                  }
                }}
                className="text-[11px] font-medium bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 text-left cursor-pointer"
              >
                <span>"{prompt}"</span>
                <ArrowRight size={10} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Recognized Matches */}
        {recentMatches.length > 0 && (
          <div className="border-t border-slate-200 pt-3">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Check size={13} />
              {isHi ? 'हाल में दर्ज किए गए विवरण:' : 'Recently Filled via Voice:'}
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {recentMatches.slice(0, 5).map((match, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center justify-between"
                >
                  <span className="font-semibold">{match.displayLabel}:</span>
                  <span className="font-bold text-emerald-950 truncate max-w-[150px]">
                    {match.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">
          {isHi ? 'भाषा: हिंदी (भारत)' : 'Language: English (India)'}
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 font-semibold text-purple-700 hover:text-purple-900 rounded-lg cursor-pointer"
        >
          {isHi ? 'समाप्त (Done)' : 'Done'}
        </button>
      </div>
    </div>
  );
};
