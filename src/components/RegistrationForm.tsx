import React, { useState, useRef } from 'react';
import {
  CitizenFormData,
  Language
} from '../types';
import { UTTARAKHAND_DISTRICTS, OCCUPATIONS_LIST } from '../data/uttarakhandData';
import { voiceAssistantService, FIELD_VOICE_CONFIGS, VoiceLanguageMode, parseSpokenDate } from '../utils/voiceAssistant';
import { parseUttarakhandName, parseBilingualAddress } from '../utils/uttarakhandPhonetics';
import { lookupPincode, lookupPincodeSync } from '../utils/pincodeLookup';
import {
  User,
  MapPin,
  Camera,
  Sparkles,
  Mic,
  Briefcase,
  Eye,
  EyeOff,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Check,
  X,
  Radio,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Zap,
  Shield,
  Loader2,
  Calendar,
  Phone,
  Mail,
  Users,
  IndianRupee,
  Award,
  Heart,
  UserCheck,
  Code
} from 'lucide-react';
import { formatKB } from '../utils/imageCompressor';
import { maskAadhaarNumber, formatAadhaarNumber } from '../utils/aadhaarUtils';
import { ExtractedJsonModal } from './ExtractedJsonModal';

interface RegistrationFormProps {
  formData: CitizenFormData;
  onChange: (updated: Partial<CitizenFormData>, source?: 'manual' | 'ocr' | 'voice' | 'pincode' | 'uidai' | 'family_profile') => void;
  onOpenPhotoModal: () => void;
  onOpenGuidedVoice: () => void;
  onSubmitPreview: () => void;
  onOpenPrivacyNotice?: () => void;
  onOpenMobileAuth?: () => void;
  onOpenUidaiVerification?: () => void;
  language: Language;
}

interface PendingVoiceConfirmation {
  fieldKey: keyof CitizenFormData;
  displayLabel: string;
  rawValue: string;
  cleanValue: string;
  extraHindiValue?: string;
  alternativeChoices?: string[];
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  onChange,
  onOpenPhotoModal,
  onOpenGuidedVoice,
  onSubmitPreview,
  onOpenPrivacyNotice,
  onOpenMobileAuth,
  onOpenUidaiVerification,
  language
}) => {
  const isHi = language === 'hi';
  const [activeListeningField, setActiveListeningField] = useState<string | null>(null);
  const [activeSpeakingField, setActiveSpeakingField] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingVoiceConfirmation | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [voiceMode, setVoiceMode] = useState<VoiceLanguageMode>(language === 'hi' ? 'hindi' : 'english');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeFeedback, setPincodeFeedback] = useState<string | null>(null);
  const [availablePostOfficesList, setAvailablePostOfficesList] = useState<Array<{ en: string; hi: string }>>([]);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [isFormJsonModalOpen, setIsFormJsonModalOpen] = useState(false);
  const [declarationError, setDeclarationError] = useState(false);
  const declarationRef = useRef<HTMLDivElement>(null);

  // Find tehsils for selected district
  const selectedDistrictData = UTTARAKHAND_DISTRICTS.find(
    (d) => d.nameEn.toLowerCase() === (formData.district || '').toLowerCase()
  );
  const availableTehsils = selectedDistrictData?.tehsils || [];

  const handleFieldChange = (key: keyof CitizenFormData, value: any) => {
    onChange({ [key]: value }, 'manual');
  };

  const handleReviewClick = () => {
    if (!formData.isPermanentResident) {
      setDeclarationError(true);
      if (declarationRef.current) {
        declarationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setDeclarationError(false);
    onSubmitPreview();
  };

  /**
   * Handle PIN code change with automatic State, District, Tehsil, Post Office & Police Station lookup
   */
  const handlePincodeChange = async (pin: string) => {
    const clean = pin.replace(/\D/g, '').slice(0, 6);
    const updates: Partial<CitizenFormData> = { pinCode: clean };

    if (clean.length === 6) {
      setPincodeLoading(true);
      setPincodeFeedback(isHi ? 'पिन कोड से विवरण खोजा जा रहा है...' : 'Resolving PIN details...');

      // 1. Instant local database check
      const syncMatch = lookupPincodeSync(clean);
      if (syncMatch) {
        updates.state = syncMatch.state;
        updates.stateHi = syncMatch.stateHi;
        updates.district = syncMatch.district;
        updates.districtHi = syncMatch.districtHi;
        updates.tehsil = syncMatch.tehsil;
        updates.tehsilHi = syncMatch.tehsilHi;
        updates.postOffice = syncMatch.postOffice;
        updates.postOfficeHi = syncMatch.postOfficeHi;
        updates.policeStation = syncMatch.policeStation;
        updates.policeStationHi = syncMatch.policeStationHi;

        if (syncMatch.availablePostOffices && syncMatch.availablePostOffices.length > 0) {
          setAvailablePostOfficesList(syncMatch.availablePostOffices);
        } else {
          setAvailablePostOfficesList([]);
        }

        onChange(updates, 'pincode');
        setPincodeLoading(false);
        setPincodeFeedback(
          isHi
            ? `✓ ${syncMatch.districtHi} (${syncMatch.tehsilHi}) - डाकघर व थाना स्वतः भरे गए!`
            : `✓ ${syncMatch.district} (${syncMatch.tehsil}) - Auto-filled Post Office & Police Station!`
        );
        setTimeout(() => setPincodeFeedback(null), 4000);
        return;
      }

      // 2. Asynchronous Postal API check
      try {
        const asyncMatch = await lookupPincode(clean);
        if (asyncMatch) {
          onChange(
            {
              pinCode: clean,
              state: asyncMatch.state,
              stateHi: asyncMatch.stateHi,
              district: asyncMatch.district,
              districtHi: asyncMatch.districtHi,
              tehsil: asyncMatch.tehsil,
              tehsilHi: asyncMatch.tehsilHi,
              postOffice: asyncMatch.postOffice,
              postOfficeHi: asyncMatch.postOfficeHi,
              policeStation: asyncMatch.policeStation,
              policeStationHi: asyncMatch.policeStationHi
            },
            'pincode'
          );

          if (asyncMatch.availablePostOffices) {
            setAvailablePostOfficesList(asyncMatch.availablePostOffices);
          }

          setPincodeFeedback(
            isHi
              ? `✓ ${asyncMatch.districtHi} (${asyncMatch.tehsilHi}) - विवरण स्वतः दर्ज!`
              : `✓ ${asyncMatch.district} (${asyncMatch.tehsil}) - Details Auto-Filled!`
          );
          setTimeout(() => setPincodeFeedback(null), 4000);
        } else {
          onChange(updates, 'manual');
          setPincodeFeedback(null);
        }
      } catch (err) {
        console.warn('Pincode fetch error:', err);
        onChange(updates, 'manual');
        setPincodeFeedback(null);
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setPincodeFeedback(null);
      setAvailablePostOfficesList([]);
      onChange(updates, 'manual');
    }
  };

  /**
   * Inline field-level mic handler with instant auto-fill and visual feedback
   */
  const handleInlineMicClick = (fieldKey: keyof CitizenFormData) => {
    setVoiceError(null);

    if (activeListeningField === fieldKey) {
      voiceAssistantService.stopListening();
      setActiveListeningField(null);
      setInterimTranscript('');
      return;
    }

    setPendingConfirmation(null);
    setActiveListeningField(fieldKey as string);
    setInterimTranscript('');

    const currentActiveMode = voiceMode;

    voiceAssistantService.listenForField(fieldKey, {
      speakPromptFirst: false,
      voiceMode: currentActiveMode,
      lang: language,
      onListeningState: (state) => {
        if (!state && activeListeningField === fieldKey) {
          setActiveListeningField(null);
        }
      },
      onInterim: (text) => {
        setInterimTranscript(text);
      },
      onSuccess: (cleanValue, displayLabel, rawTranscript, extraData) => {
        setActiveListeningField(null);
        setInterimTranscript('');

        if (cleanValue) {
          const updates: Partial<CitizenFormData> = {};

          if (fieldKey === 'fullName' || fieldKey === 'fullNameHi') {
            const names = parseUttarakhandName(cleanValue);
            updates.fullName = names.englishName || cleanValue;
            updates.fullNameHi = names.hindiName || extraData?.hindiValue || cleanValue;
          } else if (fieldKey === 'fatherHusbandName' || fieldKey === 'fatherHusbandNameHi') {
            const names = parseUttarakhandName(cleanValue);
            updates.fatherHusbandName = names.englishName || cleanValue;
            updates.fatherHusbandNameHi = names.hindiName || cleanValue;
          } else if (fieldKey === 'motherName' || fieldKey === 'motherNameHi') {
            const names = parseUttarakhandName(cleanValue);
            updates.motherName = names.englishName || cleanValue;
            updates.motherNameHi = names.hindiName || cleanValue;
          } else if (fieldKey === 'dob') {
            const parsedDob = parseSpokenDate(cleanValue);
            updates.dob = parsedDob || cleanValue;
          } else if (fieldKey === 'mobileNumber') {
            const parsedMob = voiceAssistantService.cleanMobileNumber(cleanValue);
            updates.mobileNumber = parsedMob || cleanValue;
          } else if (fieldKey === 'villageWard' || fieldKey === 'villageWardHi') {
            const addr = parseBilingualAddress(cleanValue);
            updates.villageWard = addr.english || cleanValue;
            updates.villageWardHi = addr.hindi || cleanValue;
          } else if (fieldKey === 'postOffice' || fieldKey === 'postOfficeHi') {
            const addr = parseBilingualAddress(cleanValue);
            updates.postOffice = addr.english || cleanValue;
            updates.postOfficeHi = addr.hindi || cleanValue;
          } else if (fieldKey === 'addressLine' || fieldKey === 'addressLineHi') {
            const addr = parseBilingualAddress(cleanValue);
            updates.addressLine = addr.english || cleanValue;
            updates.addressLineHi = addr.hindi || cleanValue;
          } else if (fieldKey === 'district') {
            const distObj = UTTARAKHAND_DISTRICTS.find((d) => d.nameEn.toLowerCase() === cleanValue.toLowerCase() || d.nameHi === cleanValue);
            updates.district = distObj ? distObj.nameEn : cleanValue;
            updates.districtHi = distObj ? distObj.nameHi : cleanValue;
          } else if (fieldKey === 'tehsil') {
            const distObj = UTTARAKHAND_DISTRICTS.find((d) => d.nameEn === formData.district);
            const tehObj = distObj?.tehsils.find((t) => t.nameEn.toLowerCase() === cleanValue.toLowerCase() || t.nameHi === cleanValue);
            updates.tehsil = tehObj ? tehObj.nameEn : cleanValue;
            updates.tehsilHi = tehObj ? tehObj.nameHi : cleanValue;
          } else {
            (updates as any)[fieldKey] = cleanValue;
          }

          onChange(updates, 'voice');

          const recordedVal = (updates[fieldKey] as string) || cleanValue;
          const speechEcho = isHi
            ? `${displayLabel} सुना गया: ${recordedVal}।`
            : `${displayLabel} heard as: ${recordedVal}.`;
          voiceAssistantService.speakFeedback(speechEcho, isHi ? 'hi' : 'en');

          setPendingConfirmation({
            fieldKey,
            displayLabel,
            rawValue: rawTranscript,
            cleanValue: (updates[fieldKey] as string) || cleanValue,
            extraHindiValue: updates.fullNameHi || updates.fatherHusbandNameHi || updates.motherNameHi || updates.villageWardHi || updates.postOfficeHi || updates.addressLineHi,
            alternativeChoices: extraData?.alternativeChoices
          });
          setEditingValue((updates[fieldKey] as string) || cleanValue);
        }
      },
      onError: (err) => {
        console.warn('Field voice error:', err);
        setVoiceError(err);
        setActiveListeningField(null);
        setInterimTranscript('');
      }
    });
  };

  /**
   * Confirm or Edit captured voice
   */
  const handleAcceptVoice = (customVal?: string) => {
    const valToUse = customVal !== undefined ? customVal : editingValue;
    if (pendingConfirmation) {
      let finalVal = valToUse;
      if (pendingConfirmation.fieldKey === 'dob') {
        finalVal = parseSpokenDate(valToUse) || valToUse;
      } else if (pendingConfirmation.fieldKey === 'mobileNumber') {
        const p = voiceAssistantService.cleanMobileNumber(valToUse);
        finalVal = p || valToUse;
      }
      const updates: Partial<CitizenFormData> = { [pendingConfirmation.fieldKey]: finalVal };
      if (pendingConfirmation.fieldKey === 'fullName') {
        const names = parseUttarakhandName(valToUse);
        if (names.hindiName) {
          updates.fullNameHi = names.hindiName;
        }
      }
      onChange(updates, 'voice');
      setPendingConfirmation(null);
    }
  };

  const handleRetryVoice = () => {
    if (pendingConfirmation) {
      const key = pendingConfirmation.fieldKey;
      setPendingConfirmation(null);
      handleInlineMicClick(key);
    }
  };

  /**
   * Read field name, description, and current value aloud
   */
  const handleReadFieldAloud = (fieldKey: string) => {
    setActiveSpeakingField(fieldKey);
    const currentValue = String(formData[fieldKey as keyof CitizenFormData] || '');
    voiceAssistantService.readFieldAloud(fieldKey, currentValue, language);
    setTimeout(() => {
      setActiveSpeakingField(null);
    }, 3500);
  };

  const getFieldHighlightClass = (key: string) => {
    if (activeListeningField === key) {
      return 'border-purple-600 bg-purple-50/50 ring-4 ring-purple-300 animate-pulse';
    }
    const source = formData.fieldSources?.[key];
    if (source === 'ocr') return 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30';
    if (source === 'voice') return 'border-purple-500 bg-purple-50/20 ring-1 ring-purple-500/30';
    if (source === 'pincode') return 'border-sky-500 bg-sky-50/30 ring-1 ring-sky-500/30';
    return 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20';
  };

  const renderInlineVoiceControls = (fieldKey: keyof CitizenFormData) => {
    const isListening = activeListeningField === fieldKey;
    const isSpeaking = activeSpeakingField === fieldKey;

    return (
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Audio Reader for Non-readers */}
        <button
          type="button"
          onClick={() => handleReadFieldAloud(fieldKey as string)}
          className={`p-1 rounded-md transition-colors cursor-pointer ${isSpeaking
              ? 'bg-amber-100 text-amber-800'
              : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          title={isHi ? 'विवरण सुनें (Read aloud)' : 'Read field aloud'}
        >
          <Volume2 size={15} className={isSpeaking ? 'animate-pulse' : ''} />
        </button>

        {/* Inline Dictation Mic Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleInlineMicClick(fieldKey);
          }}
          className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${isListening
              ? 'bg-rose-600 text-white shadow-lg scale-110 ring-4 ring-rose-300 animate-pulse'
              : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100 bg-purple-50 border border-purple-200'
            }`}
          title={
            isHi
              ? 'बोलकर भरने हेतु क्लिक करें'
              : 'Click to speak and auto-fill this field'
          }
        >
          <Mic size={14} className={isListening ? 'animate-bounce' : ''} />
          {isListening && (
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isHi ? 'सुन रहा हूँ...' : 'Listening...'}
            </span>
          )}
        </button>
      </div>
    );
  };

  const renderFieldSourceBadge = (key: string) => {
    const source = formData.fieldSources?.[key];
    if (source === 'ocr') {
      return (
        <span className="badge-ocr ml-1.5 text-[10px] py-0 px-1.5">
          <Sparkles size={10} /> OCR
        </span>
      );
    }
    if (source === 'voice') {
      return (
        <span className="badge-voice ml-1.5 text-[10px] py-0 px-1.5">
          <Mic size={10} /> Voice
        </span>
      );
    }
    if (source === 'pincode') {
      return (
        <span className="inline-flex items-center gap-1 ml-1.5 text-[10px] py-0 px-1.5 bg-sky-100 text-sky-800 border border-sky-300 rounded font-bold">
          <Zap size={10} className="fill-current text-sky-600" /> PIN Auto
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12 relative">
      {/* Active Speech Live Bubble Overlay */}
      {activeListeningField && (
        <div className="sticky top-16 z-30 bg-purple-950 text-white p-3 px-4 shadow-xl border-b-2 border-purple-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center animate-bounce flex-shrink-0 shadow-lg">
              <Mic size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-amber-300">
                  {isHi ? 'सुन रहा हूँ... बोलिए:' : 'Listening for:'}{' '}
                  {FIELD_VOICE_CONFIGS[activeListeningField]?.labelHi || activeListeningField}
                </span>
                <span className="text-[10px] bg-purple-800 text-purple-200 px-2 py-0.5 rounded uppercase font-semibold">
                  Mode: {voiceMode}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                  <ShieldCheck size={11} />
                  {isHi ? 'माइक सक्रिय' : 'Mic Active'}
                </span>
              </div>
              <p className="text-xs text-purple-100 italic mt-0.5 truncate">
                {interimTranscript ? `"${interimTranscript}"` : (isHi ? 'माइक के पास आकर स्पष्ट बोलें...' : 'Speak clearly into the microphone...')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => {
                voiceAssistantService.stopListening();
                setActiveListeningField(null);
              }}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              {isHi ? 'पूर्ण (Done)' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* Voice Error Notice */}
      {voiceError && (
        <div className="bg-amber-900/90 text-amber-100 px-4 py-2 text-xs flex items-center justify-between border-b border-amber-600">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-300 flex-shrink-0" />
            <span>{voiceError}</span>
          </div>
          <button
            onClick={() => setVoiceError(null)}
            className="text-amber-200 hover:text-white text-xs font-bold ml-2 p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Voice Verification & Multi-Alternative Candidate Pill */}
      {pendingConfirmation && (
        <div className="sticky top-16 z-30 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-3.5 px-4 shadow-2xl border-b-2 border-emerald-400 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-bold">
                <CheckCircle2 size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase">
                    {pendingConfirmation.displayLabel}:
                  </span>
                  <span className="text-[10px] text-slate-300 italic truncate">
                    (सुना: "{pendingConfirmation.rawValue}")
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="text-sm font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-emerald-400/50 w-full max-w-xs outline-none"
                  />
                  {pendingConfirmation.extraHindiValue && (
                    <span className="text-xs text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/40 font-semibold">
                      हिंदी: {pendingConfirmation.extraHindiValue}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleRetryVoice}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer"
                title="दोबारा बोलें"
              >
                <RotateCcw size={13} />
                <span>{isHi ? 'दोबारा बोलें' : 'Retry'}</span>
              </button>
              <button
                onClick={() => handleAcceptVoice()}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-sm cursor-pointer"
              >
                <Check size={14} />
                <span>{isHi ? 'स्वीकार करें (Accept)' : 'Accept'}</span>
              </button>
              <button
                onClick={() => setPendingConfirmation(null)}
                className="p-1 rounded text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Alternative Suggestion Chips */}
          {pendingConfirmation.alternativeChoices && pendingConfirmation.alternativeChoices.length > 1 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] text-slate-400 font-semibold">
                {isHi ? 'अन्य विकल्प (Tap to choose):' : 'Did you mean:'}
              </span>
              {pendingConfirmation.alternativeChoices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setEditingValue(choice);
                    handleAcceptVoice(choice);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${choice === editingValue
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15'
                    }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Top Title */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a5c44] to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-0.5 rounded shadow-sm">
              e-District UK
            </span>
            <span className="text-xs text-slate-300">
              Ref ID: {formData.applicationNumber}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold mt-1">
            {isHi ? '3. नागरिक पंजीकरण एवं आवेदन पत्र' : '3. Citizen Registration & Application Form'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
            {isHi
              ? 'शोर-शराबा निरोधक शील्ड (Noise Shield) सक्षम। शोर वाले स्थान में माइक दबाकर रखें और बोलें।'
              : 'Noise Shield & DSP filtering enabled. Hold mic button to speak in noisy environments.'}
          </p>
        </div>

        {/* Passport Photo Box */}
        <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/20 backdrop-blur-xs">
          <div className="relative w-16 h-20 bg-slate-800 rounded-lg overflow-hidden border border-amber-300 flex items-center justify-center flex-shrink-0">
            {formData.applicantPhotoUrl ? (
              <img
                src={formData.applicantPhotoUrl}
                alt="Applicant"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="text-xs">
            <span className="font-bold block text-amber-200">
              {formData.applicantPhotoUrl
                ? isHi ? 'पासपोर्ट फोटो संलग्न (<50KB)' : 'Photo Attached (<50KB)'
                : isHi ? 'फोटो आवश्यक है (<50KB)' : 'Passport Photo Required'}
            </span>
            {formData.applicantPhotoSizeKB && (
              <span className="text-[10px] text-emerald-300 block">
                {formatKB(formData.applicantPhotoSizeKB)}
              </span>
            )}
            <button
              onClick={onOpenPhotoModal}
              className="mt-1.5 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Camera size={12} />
              {formData.applicantPhotoUrl
                ? isHi ? 'फोटो बदलें' : 'Change Photo'
                : isHi ? 'फोटो लें / अपलोड करें' : 'Take / Upload Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Engine & Noise Shield Control Bar */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-purple-400/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-bold flex-shrink-0 animate-pulse">
            <Volume2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-400/30 text-purple-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-purple-300/40 flex items-center gap-1">
                <Radio size={11} className="text-emerald-400 animate-pulse" />
                {isHi ? 'शोर निरोधक वॉयस इंजन 3.0' : 'Noise-Resistant Voice Engine 3.0'}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black mt-0.5 text-white">
              {isHi
                ? 'भीड़भाड़ व शोर वाले स्थान में भी सटीक बोलकर भरें'
                : 'Robust Voice Recognition in Disturbed / Noisy Areas'}
            </h4>
            <p className="text-xs text-purple-200 mt-0.5">
              {isHi
                ? 'तहसील/सीएससी केंद्र या सड़क के शोर को फिल्टर कर केवल आपकी आवाज़ को पहचानता है।'
                : 'Filters ambient background rumble & chatter at CSCs/Tehsil centers.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

          {/* Voice Mode Selector */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-purple-400/30 text-xs w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={() => {
                setVoiceMode('hinglish');
                voiceAssistantService.setVoiceMode('hinglish');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${voiceMode === 'hinglish'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
                }`}
            >
              <span>🇮🇳 हिंग्लिश</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setVoiceMode('hindi');
                voiceAssistantService.setVoiceMode('hindi');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${voiceMode === 'hindi'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
                }`}
            >
              <span>हिन्दी</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setVoiceMode('english');
                voiceAssistantService.setVoiceMode('english');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${voiceMode === 'english'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
                }`}
            >
              <span>English</span>
            </button>
          </div>

          <button
            onClick={onOpenGuidedVoice}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer whitespace-nowrap"
          >
            <Mic size={16} className="animate-bounce" />
            <span>{isHi ? 'गाइड वॉयस मोड' : 'Guided Flow'}</span>
          </button>
        </div>
      </div>

      {/* Form Content Sections */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Section A: Applicant Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-slate-900">
                {isHi ? 'क. आवेदक का व्यक्तिगत विवरण' : 'A. Applicant Personal Information'}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsFormJsonModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-300 rounded-lg transition-colors cursor-pointer"
              title="फॉर्म में दर्ज डेटा को JSON के रूप में देखें"
            >
              <Code size={13} className="text-emerald-600" />
              <span>{isHi ? '{ } डेटा JSON देखें' : '{ } View Form JSON'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User size={13} className="text-emerald-700" />
                  <span>{isHi ? 'पूरा नाम (अंग्रेजी में) *' : 'Full Name (in English) *'}</span>
                  {renderFieldSourceBadge('fullName')}
                </label>
                {renderInlineVoiceControls('fullName')}
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  const val = e.target.value;
                  const names = parseUttarakhandName(val);
                  onChange({
                    fullName: val,
                    fullNameHi: val.trim() ? names.hindiName : ''
                  }, 'manual');
                }}
                placeholder="e.g. Ramesh Singh Negi"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('fullName')}`}
                required
              />
            </div>

            {/* Full Name Hindi */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User size={13} className="text-emerald-700" />
                  <span>{isHi ? 'पूरा नाम (हिंदी में)' : 'Full Name (in Hindi)'}</span>
                  {renderFieldSourceBadge('fullNameHi')}
                </label>
                {renderInlineVoiceControls('fullNameHi')}
              </div>
              <input
                type="text"
                value={formData.fullNameHi || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const names = parseUttarakhandName(val);
                  onChange({
                    fullNameHi: val,
                    fullName: val.trim() ? names.englishName : ''
                  }, 'manual');
                }}
                placeholder="उदा. रमेश सिंह नेगी या रवि शंकर सिंह"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('fullNameHi')}`}
              />
            </div>

            {/* Gender */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <UserCheck size={13} className="text-blue-700" />
                  <span>{isHi ? 'लिंग (Gender) *' : 'Gender *'}</span>
                  {renderFieldSourceBadge('gender')}
                </label>
                {renderInlineVoiceControls('gender')}
              </div>
              <select
                value={formData.gender}
                onChange={(e) => handleFieldChange('gender', e.target.value)}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold bg-white ${getFieldHighlightClass('gender')}`}
              >
                <option value="">{isHi ? '-- लिंग चुनें --' : '-- Select Gender --'}</option>
                <option value="Male">Male / पुरुष</option>
                <option value="Female">Female / महिला</option>
                <option value="Transgender">Transgender / तृतीय लिंग</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar size={13} className="text-purple-700" />
                  <span>{isHi ? 'जन्म तिथि (DOB) *' : 'Date of Birth (DOB) *'}</span>
                  {renderFieldSourceBadge('dob')}
                </label>
                {renderInlineVoiceControls('dob')}
              </div>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleFieldChange('dob', e.target.value)}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('dob')}`}
                required
              />
            </div>

            {/* Aadhaar Number with Privacy Masking, Show/Hide and UIDAI Verification Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 flex-wrap">
                  <span>{isHi ? 'आधार संख्या (मास्क्ड) *' : 'Aadhaar Number (Masked) *'}</span>
                  {renderFieldSourceBadge('aadhaarNumber')}
                  {formData.isAadhaarVerified ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      <ShieldCheck size={12} className="text-emerald-700" />
                      UIDAI Verified ✓
                    </span>
                  ) : onOpenUidaiVerification ? (
                    <button
                      type="button"
                      onClick={onOpenUidaiVerification}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200 cursor-pointer transition-all shadow-2xs"
                    >
                      <ShieldCheck size={11} className="text-red-600" />
                      <span>{isHi ? 'UIDAI सत्यापन (e-KYC)' : 'Verify with UIDAI'}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      <ShieldCheck size={11} className="text-slate-500" />
                      UIDAI Masked
                    </span>
                  )}
                </label>
                {renderInlineVoiceControls('aadhaarNumber')}
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={showAadhaar ? formData.aadhaarNumber : maskAadhaarNumber(formData.aadhaarNumber)}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const digits = raw.replace(/[^0-9]/g, '').slice(0, 12);
                    const formatted = digits ? formatAadhaarNumber(digits) : raw;
                    handleFieldChange('aadhaarNumber', formatted);
                  }}
                  placeholder="XXXX XXXX 1234"
                  className={`w-full text-sm pl-3.5 pr-24 py-2.5 rounded-lg border outline-none font-mono font-bold tracking-wider ${getFieldHighlightClass('aadhaarNumber')}`}
                  required
                />

                {/* Show / Hide Masking Toggle Button */}
                {formData.aadhaarNumber && (
                  <button
                    type="button"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    className="absolute right-2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title={showAadhaar ? (isHi ? 'आधार नंबर छिपाएं' : 'Hide Aadhaar digits') : (isHi ? 'पूरा आधार नंबर देखें' : 'Show full Aadhaar digits')}
                  >
                    {showAadhaar ? (
                      <>
                        <EyeOff size={13} className="text-slate-600" />
                        <span>{isHi ? 'छिपाएं' : 'Hide'}</span>
                      </>
                    ) : (
                      <>
                        <Eye size={13} className="text-emerald-700" />
                        <span>{isHi ? 'देखें' : 'Show'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>{isHi ? 'सुरक्षा हेतु केवल अंतिम 4 अंक प्रदर्शित हैं।' : 'UIDAI Privacy: Only last 4 digits visible by default.'}</span>
                {formData.aadhaarNumber && (
                  <span className="text-emerald-700 font-semibold">
                    {showAadhaar ? (isHi ? 'पूर्ण संख्या दृश्यमान' : 'Full 12 digits visible') : (isHi ? 'मास्क्ड मोड सक्रिय' : 'Masked mode active')}
                  </span>
                )}
              </p>
            </div>

            {/* Mobile Number with OTP Verification */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 flex-wrap">
                  <Phone size={13} className="text-emerald-700" />
                  <span>{isHi ? 'मोबाइल नंबर (SMS हेतु) *' : 'Mobile Number (for SMS) *'}</span>
                  {renderFieldSourceBadge('mobileNumber')}
                  {formData.isMobileVerified ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      <CheckCircle2 size={11} className="text-emerald-700" />
                      Verified ✓
                    </span>
                  ) : onOpenMobileAuth ? (
                    <button
                      type="button"
                      onClick={onOpenMobileAuth}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 cursor-pointer transition-all shadow-2xs"
                    >
                      <Sparkles size={11} className="text-emerald-600" />
                      <span>{isHi ? 'सत्यापित करें (OTP)' : 'Verify Mobile (OTP)'}</span>
                    </button>
                  ) : null}
                </label>
                {renderInlineVoiceControls('mobileNumber')}
              </div>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
                placeholder="98XXXXXXXX"
                maxLength={10}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('mobileNumber')}`}
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Mail size={13} className="text-blue-700" />
                  <span>{isHi ? 'ईमेल पता' : 'Email Address'}</span>
                  {renderFieldSourceBadge('email')}
                </label>
                {renderInlineVoiceControls('email')}
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="citizen@example.com"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none ${getFieldHighlightClass('email')}`}
              />
            </div>

            {/* Caste Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Award size={13} className="text-amber-700" />
                  <span>{isHi ? 'सामाजिक वर्ग (Category) *' : 'Social Category *'}</span>
                  {renderFieldSourceBadge('casteCategory')}
                </label>
                {renderInlineVoiceControls('casteCategory')}
              </div>
              <select
                value={formData.casteCategory}
                onChange={(e) => handleFieldChange('casteCategory', e.target.value)}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold bg-white ${getFieldHighlightClass('casteCategory')}`}
              >
                <option value="">{isHi ? '-- सामाजिक वर्ग चुनें --' : '-- Select Category --'}</option>
                <option value="General">General / सामान्य वर्ग</option>
                <option value="OBC">OBC / अन्य पिछड़ा वर्ग</option>
                <option value="SC">SC / अनुसूचित जाति</option>
                <option value="ST">ST / अनुसूचित जनजाति</option>
                <option value="EWS">EWS / आर्थिक रूप से कमजोर</option>
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Heart size={13} className="text-rose-600" />
                  <span>{isHi ? 'वैवाहिक स्थिति *' : 'Marital Status *'}</span>
                  {renderFieldSourceBadge('maritalStatus')}
                </label>
                {renderInlineVoiceControls('maritalStatus')}
              </div>
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none bg-white ${getFieldHighlightClass('maritalStatus')}`}
              >
                <option value="">{isHi ? '-- वैवाहिक स्थिति चुनें --' : '-- Select Marital Status --'}</option>
                <option value="Unmarried">Unmarried / अविवाहित</option>
                <option value="Married">Married / विवाहित</option>
                <option value="Widowed">Widowed / विधवा अथवा विधुर</option>
                <option value="Divorced">Divorced / तलाकशुदा</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section B: Family & Relation Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Users className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-slate-900">
              {isHi ? 'ख. पारिवारिक एवं संरक्षक विवरण (द्विभाषी / Dual Entry)' : 'B. Family & Guardian Details (Bilingual / Dual Entry)'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Father / Husband Name (English) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User size={13} className="text-blue-700" />
                  <span>{isHi ? 'पिता / पति का नाम (अंग्रेजी में) *' : "Father / Husband's Name (in English) *"}</span>
                  {renderFieldSourceBadge('fatherHusbandName')}
                </label>
                {renderInlineVoiceControls('fatherHusbandName')}
              </div>
              <input
                type="text"
                value={formData.fatherHusbandName}
                onChange={(e) => {
                  const val = e.target.value;
                  const names = parseUttarakhandName(val);
                  onChange({
                    fatherHusbandName: val,
                    fatherHusbandNameHi: val.trim() ? names.hindiName : ''
                  }, 'manual');
                }}
                placeholder="e.g. Birendra Singh Negi"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('fatherHusbandName')}`}
                required
              />
            </div>

            {/* Father / Husband Name (Hindi) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User size={13} className="text-blue-700" />
                  <span>{isHi ? 'पिता / पति का नाम (हिंदी में)' : "Father / Husband's Name (in Hindi)"}</span>
                  {renderFieldSourceBadge('fatherHusbandNameHi')}
                </label>
                {renderInlineVoiceControls('fatherHusbandNameHi')}
              </div>
              <input
                type="text"
                value={formData.fatherHusbandNameHi || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const names = parseUttarakhandName(val);
                  onChange({
                    fatherHusbandNameHi: val,
                    fatherHusbandName: val.trim() ? names.englishName : ''
                  }, 'manual');
                }}
                placeholder="उदा. बीरेंद्र सिंह नेगी"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('fatherHusbandNameHi')}`}
              />
            </div>

            {/* Relation Type */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Users size={13} className="text-indigo-700" />
                  <span>{isHi ? 'संबंध प्रकार *' : 'Relation Type *'}</span>
                  {renderFieldSourceBadge('relationType')}
                </label>
                {renderInlineVoiceControls('relationType')}
              </div>
              <select
                value={formData.relationType}
                onChange={(e) => handleFieldChange('relationType', e.target.value)}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none bg-white ${getFieldHighlightClass('relationType')}`}
              >
                <option value="Father">Father / पिता</option>
                <option value="Husband">Husband / पति</option>
                <option value="Guardian">Guardian / संरक्षक</option>
              </select>
            </div>

            {/* Mother Name (English) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Heart size={13} className="text-rose-700" />
                  <span>{isHi ? 'माता का नाम (अंग्रेजी में) *' : "Mother's Name (in English) *"}</span>
                  {renderFieldSourceBadge('motherName')}
                </label>
                {renderInlineVoiceControls('motherName')}
              </div>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => {
                  const val = e.target.value;
                  const names = parseUttarakhandName(val);
                  onChange({
                    motherName: val,
                    motherNameHi: val.trim() ? names.hindiName : ''
                  }, 'manual');
                }}
                placeholder="e.g. Sunita Devi"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('motherName')}`}
              />
            </div>

            {/* Mother Name (Hindi) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Heart size={13} className="text-rose-700" />
                  <span>{isHi ? 'माता का नाम (हिंदी में)' : "Mother's Name (in Hindi)"}</span>
                  {renderFieldSourceBadge('motherNameHi')}
                </label>
                {renderInlineVoiceControls('motherNameHi')}
              </div>
              <input
                type="text"
                value={formData.motherNameHi || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const names = parseUttarakhandName(val);
                  onChange({
                    motherNameHi: val,
                    motherName: val.trim() ? names.englishName : ''
                  }, 'manual');
                }}
                placeholder="उदा. सुनीता देवी"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('motherNameHi')}`}
              />
            </div>
          </div>
        </div>

        {/* Section C: Uttarakhand Address & Residence */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-slate-900">
                {isHi
                  ? 'ग. निवास एवं पता विवरण (पिन कोड से स्वतः प्रविष्टि व द्विभाषी)'
                  : 'C. Address & Residence Details (PIN-Code Auto-Fill & Bilingual)'}
              </h3>
            </div>
            <span className="text-xs text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 self-start sm:self-auto">
              <Zap size={13} className="text-amber-500 fill-current" />
              {isHi ? 'पिन कोड से राज्य, जिला, तहसील, डाकघर व थाना स्वतः भरेंगे' : 'PIN code auto-fills State, District, Tehsil, PO & Police Station'}
            </span>
          </div>

          {/* PIN Code Interactive Hub Card */}
          <div className="p-4 bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 border-2 border-sky-300 rounded-2xl shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* PIN Code Input */}
              <div className="md:col-span-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-slate-900 flex items-center">
                    <span className="flex items-center gap-1">
                      <Zap size={13} className="text-amber-500 fill-current" />
                      {isHi ? 'डाक पिन कोड (PIN Code) *' : 'Postal PIN Code *'}
                    </span>
                    {renderFieldSourceBadge('pinCode')}
                  </label>
                  {renderInlineVoiceControls('pinCode')}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="248001"
                    maxLength={6}
                    className={`w-full text-base px-3.5 py-2.5 rounded-xl border-2 outline-none font-mono font-black tracking-widest text-slate-900 bg-white shadow-xs ${pincodeLoading ? 'border-amber-400 bg-amber-50/40' : getFieldHighlightClass('pinCode')
                      }`}
                    required
                  />
                  {pincodeLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 animate-spin">
                      <Loader2 size={18} />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {isHi ? '६ अंकों का पिन कोड (उदा. 248001, 263001)' : '6-digit PIN (e.g. 248001, 263001)'}
                </span>
              </div>

              {/* Real-time Status / Auto-fill Feedback */}
              <div className="md:col-span-2 flex flex-col justify-center">
                {pincodeFeedback ? (
                  <div className="p-2.5 bg-white border border-emerald-300 rounded-xl shadow-2xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-emerald-950">{pincodeFeedback}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl border border-sky-200">
                    <span className="font-bold text-slate-800 block mb-0.5">
                      {isHi ? '💡 स्मार्ट पिन कोड आधारित ऑटो-फिल:' : '💡 Smart PIN-Code Auto-Fill Active:'}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {isHi
                        ? 'पिन कोड दर्ज करते ही उत्तराखंड व भारत के सभी क्षेत्रों के राज्य, जिला, तहसील, डाकघर एवं अधिकार क्षेत्र थाना स्वतः प्रविष्ट हो जाते हैं।'
                        : 'Entering a 6-digit PIN code instantly resolves State, District, Tehsil, Post Office and Police Station.'}
                    </span>
                  </div>
                )}

                {/* Quick Post Office Selector dropdown if available */}
                {availablePostOfficesList.length > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                      {isHi ? 'संबंधित डाकघर चुनें:' : 'Select Post Office:'}
                    </span>
                    <select
                      value={formData.postOffice}
                      onChange={(e) => {
                        const selectedPo = e.target.value;
                        const matchPo = availablePostOfficesList.find((p) => p.en === selectedPo);
                        onChange({
                          postOffice: selectedPo,
                          postOfficeHi: matchPo?.hi || formData.postOfficeHi
                        }, 'manual');
                      }}
                      className="text-xs font-semibold bg-white border border-sky-300 rounded-lg px-2.5 py-1 text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none w-full"
                    >
                      {availablePostOfficesList.map((po, idx) => (
                        <option key={idx} value={po.en}>
                          {po.en} {po.hi ? `(${po.hi})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* State (English) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'राज्य (अंग्रेजी में) *' : 'State (in English) *'}</span>
                  {renderFieldSourceBadge('state')}
                </label>
                {renderInlineVoiceControls('state')}
              </div>
              <input
                type="text"
                value={formData.state || 'Uttarakhand'}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    state: val,
                    stateHi: addr.hindi || formData.stateHi
                  }, 'manual');
                }}
                placeholder="e.g. Uttarakhand"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-bold ${getFieldHighlightClass('state')}`}
                required
              />
            </div>

            {/* State (Hindi) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'राज्य (हिंदी में) *' : 'State (in Hindi) *'}</span>
                  {renderFieldSourceBadge('stateHi')}
                </label>
                {renderInlineVoiceControls('stateHi')}
              </div>
              <input
                type="text"
                value={formData.stateHi || 'उत्तराखंड'}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    stateHi: val,
                    state: formData.state || addr.english
                  }, 'manual');
                }}
                placeholder="उदा. उत्तराखंड"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-bold ${getFieldHighlightClass('stateHi')}`}
                required
              />
            </div>

            {/* District (English & Hindi) Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'जिला (District) *' : 'District *'}</span>
                  {renderFieldSourceBadge('district')}
                </label>
                {renderInlineVoiceControls('district')}
              </div>
              <select
                value={formData.district}
                onChange={(e) => {
                  const newDist = e.target.value;
                  const distObj = UTTARAKHAND_DISTRICTS.find((d) => d.nameEn === newDist);
                  const firstTehsil = distObj?.tehsils[0]?.nameEn || '';
                  const firstTehsilHi = distObj?.tehsils[0]?.nameHi || '';
                  onChange({
                    district: newDist,
                    districtHi: distObj?.nameHi || newDist,
                    tehsil: firstTehsil,
                    tehsilHi: firstTehsilHi
                  }, 'manual');
                }}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-bold bg-white ${getFieldHighlightClass('district')}`}
                required
              >
                <option value="">{isHi ? '-- जिला चुनें --' : '-- Select District --'}</option>
                {UTTARAKHAND_DISTRICTS.map((dist) => (
                  <option key={dist.id} value={dist.nameEn}>
                    {dist.nameEn} ({dist.nameHi})
                  </option>
                ))}
              </select>
            </div>

            {/* Tehsil (English & Hindi) Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'तहसील (Tehsil) *' : 'Tehsil *'}</span>
                  {renderFieldSourceBadge('tehsil')}
                </label>
                {renderInlineVoiceControls('tehsil')}
              </div>
              <select
                value={formData.tehsil}
                onChange={(e) => {
                  const newTeh = e.target.value;
                  const distObj = UTTARAKHAND_DISTRICTS.find((d) => d.nameEn === formData.district);
                  const tehObj = distObj?.tehsils.find((t) => t.nameEn === newTeh);
                  onChange({
                    tehsil: newTeh,
                    tehsilHi: tehObj?.nameHi || newTeh
                  }, 'manual');
                }}
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold bg-white ${getFieldHighlightClass('tehsil')}`}
                required
              >
                <option value="">{isHi ? '-- तहसील चुनें --' : '-- Select Tehsil --'}</option>
                {availableTehsils.map((teh) => (
                  <option key={teh.id} value={teh.nameEn}>
                    {teh.nameEn} ({teh.nameHi})
                  </option>
                ))}
              </select>
            </div>

            {/* Police Station / Thana (English) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span className="flex items-center gap-1">
                    <Shield size={12} className="text-emerald-700" />
                    {isHi ? 'थाना / पुलिस स्टेशन (अंग्रेजी में) *' : 'Police Station (in English) *'}
                  </span>
                  {renderFieldSourceBadge('policeStation')}
                </label>
                {renderInlineVoiceControls('policeStation')}
              </div>
              <input
                type="text"
                value={formData.policeStation || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    policeStation: val,
                    policeStationHi: addr.hindi || formData.policeStationHi
                  }, 'manual');
                }}
                placeholder="e.g. Kotwali Dehradun"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('policeStation')}`}
                required
              />
            </div>

            {/* Police Station / Thana (Hindi) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span className="flex items-center gap-1">
                    <Shield size={12} className="text-emerald-700" />
                    {isHi ? 'थाना / पुलिस स्टेशन (हिंदी में)' : 'Police Station (in Hindi)'}
                  </span>
                  {renderFieldSourceBadge('policeStationHi')}
                </label>
                {renderInlineVoiceControls('policeStationHi')}
              </div>
              <input
                type="text"
                value={formData.policeStationHi || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    policeStationHi: val,
                    policeStation: formData.policeStation || addr.english
                  }, 'manual');
                }}
                placeholder="उदा. कोतवाली देहरादून नगर"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('policeStationHi')}`}
              />
            </div>

            {/* Post Office (English) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'डाकघर (अंग्रेजी में) *' : 'Post Office (in English) *'}</span>
                  {renderFieldSourceBadge('postOffice')}
                </label>
                {renderInlineVoiceControls('postOffice')}
              </div>
              <input
                type="text"
                value={formData.postOffice}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    postOffice: val,
                    postOfficeHi: addr.hindi || formData.postOfficeHi
                  }, 'manual');
                }}
                placeholder="e.g. Dehradun G.P.O. / Rajpur P.O."
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none ${getFieldHighlightClass('postOffice')}`}
                required
              />
            </div>

            {/* Post Office (Hindi) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'डाकघर (हिंदी में)' : 'Post Office (in Hindi)'}</span>
                  {renderFieldSourceBadge('postOfficeHi')}
                </label>
                {renderInlineVoiceControls('postOfficeHi')}
              </div>
              <input
                type="text"
                value={formData.postOfficeHi || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    postOfficeHi: val,
                    postOffice: formData.postOffice || addr.english
                  }, 'manual');
                }}
                placeholder="उदा. देहरादून मुख्य डाकघर"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none ${getFieldHighlightClass('postOfficeHi')}`}
              />
            </div>

            {/* Village / Ward (English) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'ग्राम / वार्ड / मोहल्ला (अंग्रेजी में) *' : 'Village / Ward (in English) *'}</span>
                  {renderFieldSourceBadge('villageWard')}
                </label>
                {renderInlineVoiceControls('villageWard')}
              </div>
              <input
                type="text"
                value={formData.villageWard}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    villageWard: val,
                    villageWardHi: val.trim() ? addr.hindi : ''
                  }, 'manual');
                }}
                placeholder="e.g. Rajpur Road Ward 12"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('villageWard')}`}
              />
            </div>

            {/* Village / Ward (Hindi) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'ग्राम / वार्ड / मोहल्ला (हिंदी में)' : 'Village / Ward (in Hindi)'}</span>
                  {renderFieldSourceBadge('villageWardHi')}
                </label>
                {renderInlineVoiceControls('villageWardHi')}
              </div>
              <input
                type="text"
                value={formData.villageWardHi || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    villageWardHi: val,
                    villageWard: val.trim() ? addr.english : ''
                  }, 'manual');
                }}
                placeholder="उदा. राजपुर रोड वार्ड १२"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none font-semibold ${getFieldHighlightClass('villageWardHi')}`}
              />
            </div>

            {/* Full Street Address Line (English) */}
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'पूरा पता विवरण (अंग्रेजी में) *' : 'Full Street Address (in English) *'}</span>
                  {renderFieldSourceBadge('addressLine')}
                </label>
                {renderInlineVoiceControls('addressLine')}
              </div>
              <input
                type="text"
                value={formData.addressLine}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    addressLine: val,
                    addressLineHi: val.trim() ? addr.hindi : ''
                  }, 'manual');
                }}
                placeholder="House No 42, Building name, Landmark..."
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none ${getFieldHighlightClass('addressLine')}`}
              />
            </div>

            {/* Full Street Address Line (Hindi) */}
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center">
                  <span>{isHi ? 'पूरा पता विवरण (हिंदी में)' : 'Full Street Address (in Hindi)'}</span>
                  {renderFieldSourceBadge('addressLineHi')}
                </label>
                {renderInlineVoiceControls('addressLineHi')}
              </div>
              <input
                type="text"
                value={formData.addressLineHi || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const addr = parseBilingualAddress(val);
                  onChange({
                    addressLineHi: val,
                    addressLine: val.trim() ? addr.english : ''
                  }, 'manual');
                }}
                placeholder="उदा. मकान नं. ४२, देवदार एन्क्लेव, मुख्य मार्ग"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none ${getFieldHighlightClass('addressLineHi')}`}
              />
            </div>
          </div>
        </div>

        {/* Section D: Socio-Economic & Service Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Briefcase className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-slate-900">
              {isHi ? 'घ. आय एवं व्यवसाय विवरण' : 'D. Occupation & Income Details'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Occupation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {isHi ? 'व्यवसाय (Occupation)' : 'Occupation'}
                </label>
                {renderInlineVoiceControls('occupation')}
              </div>
              <select
                value={formData.occupation}
                onChange={(e) => handleFieldChange('occupation', e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 outline-none bg-white"
              >
                <option value="">{isHi ? '-- व्यवसाय चुनें --' : '-- Select Occupation --'}</option>
                {OCCUPATIONS_LIST.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <IndianRupee size={13} className="text-emerald-700" />
                  <span>{isHi ? 'पारिवारिक वार्षिक आय (₹) *' : 'Annual Household Income (₹) *'}</span>
                  {renderFieldSourceBadge('annualIncome')}
                </label>
                {renderInlineVoiceControls('annualIncome')}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => handleFieldChange('annualIncome', e.target.value)}
                  placeholder="e.g. 80000"
                  className={`w-full text-sm pl-8 pr-3.5 py-2.5 rounded-lg border outline-none font-bold ${getFieldHighlightClass('annualIncome')}`}
                  required
                />
              </div>
            </div>

            {/* Living Since Years */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar size={13} className="text-indigo-700" />
                  <span>{isHi ? 'उत्तराखंड में निवास अवधि (वर्ष)' : 'Years in Uttarakhand'}</span>
                  {renderFieldSourceBadge('livingSinceYears')}
                </label>
                {renderInlineVoiceControls('livingSinceYears')}
              </div>
              <input
                type="number"
                value={formData.livingSinceYears || ''}
                onChange={(e) => handleFieldChange('livingSinceYears', e.target.value)}
                placeholder="e.g. 25"
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none ${getFieldHighlightClass('livingSinceYears')}`}
              />
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 & DPDP Rules 2025 Statutory Notice Card */}
        <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-cyan-50/90 border border-emerald-300 rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={18} className="text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    DPDP Act 2023 & DPDP Rules 2025
                  </span>
                  <span className="text-[10px] text-teal-800 font-semibold bg-teal-100/70 px-2 py-0.5 rounded">
                    Sec 5 Statutory Notice
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                  {isHi ? 'डिजिटल व्यक्तिगत डेटा संरक्षण एवं गोपनीयता सूचना' : 'Digital Personal Data Protection & Privacy Notice'}
                </h4>
              </div>
            </div>
            {onOpenPrivacyNotice && (
              <button
                type="button"
                onClick={onOpenPrivacyNotice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Shield size={13} className="text-amber-300" />
                <span>{isHi ? 'पूर्ण सूचना व नागरिक अधिकार देखें' : 'View Full Notice & Rights'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-slate-700 mt-2 bg-white/80 p-3 rounded-lg border border-emerald-200/70">
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">
                {isHi ? '🎯 विनिर्दिष्ट प्रयोजन (Purpose):' : '🎯 Specified Purpose:'}
              </span>
              <span className="text-slate-600">
                {isHi
                  ? 'उत्तराखंड ई-डिस्ट्रिक्ट पोर्टल के माध्यम से नागरिक प्रमाण-पत्र जारी करना एवं वैधानिक सत्यापन।'
                  : 'Verification of eligibility and issuance of official state certificates / public service delivery.'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">
                {isHi ? '🛡️ डेटा संरक्षण अधिकारी (DPO):' : '🛡️ Grievance & DPO:'}
              </span>
              <span className="text-slate-600">
                dpo-edistrict@uk.gov.in | ITDA, IT Park, Dehradun | Helpline: 1800-180-2525
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">
                {isHi ? '⚖️ नागरिक अधिकार (Your Rights):' : '⚖️ Your Rights (Sec 11-14):'}
              </span>
              <span className="text-slate-600">
                {isHi
                  ? 'डेटा एक्सेस, संशोधन/अद्यतन, सहमति वापसी, एवं विलोपन का वैधानिक अधिकार।'
                  : 'Right to Access, Correction, Erasure, Grievance Redressal, and Consent Withdrawal.'}
              </span>
            </div>
          </div>
        </div>

        {/* Declaration & Submission Box */}
        <div
          ref={declarationRef}
          className={`rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200 ${
            declarationError
              ? 'bg-rose-50 border-2 border-rose-500 shadow-md shadow-rose-100 ring-2 ring-rose-200'
              : 'bg-emerald-50/50 border border-emerald-200'
          }`}
        >
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="declaration"
                checked={!!formData.isPermanentResident}
                onChange={(e) => {
                  handleFieldChange('isPermanentResident', e.target.checked);
                  if (e.target.checked) {
                    setDeclarationError(false);
                  }
                }}
                className={`mt-1 w-4 h-4 rounded cursor-pointer ${
                  declarationError ? 'accent-rose-600 ring-2 ring-rose-400' : 'accent-emerald-600'
                }`}
                required
              />
              <label htmlFor="declaration" className="text-xs text-slate-700 cursor-pointer select-none">
                <span className="font-bold text-slate-900 block mb-0.5">
                  {isHi ? 'स्व-घोषणा (Citizen Self Declaration) *' : 'Citizen Self Declaration *'}
                  <span className={`ml-2 text-xs font-semibold ${declarationError ? 'text-rose-600' : 'text-slate-500'}`}>
                    ({isHi ? 'अनिवार्य' : 'Mandatory'})
                  </span>
                </span>
                {isHi
                  ? 'मैं प्रमाणित करता/करती हूँ कि आवेदन में दी गई समस्त जानकारी पूर्णतः सत्य है। यदि कोई भी विवरण असत्य पाया गया तो मेरा आवेदन निरस्त किया जा सकता है।'
                  : 'I hereby declare that all information furnished above is true and correct to the best of my knowledge.'}
              </label>
            </div>
            {declarationError && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mt-1 sm:ml-7 bg-rose-100/80 px-2.5 py-1 rounded-md border border-rose-300">
                <AlertCircle size={14} className="shrink-0 text-rose-600" />
                <span>
                  {isHi
                    ? 'कृपया आवेदन पूर्वावलोकन एवं सबमिट करने से पहले स्व-घोषणा (Self Declaration) को चेक करके स्वीकार करें।'
                    : 'Please accept the Citizen Self Declaration checkbox before reviewing and submitting.'}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleReviewClick}
            className="btn-primary w-full sm:w-auto px-6 py-3 text-sm shadow-md whitespace-nowrap cursor-pointer shrink-0"
          >
            <Eye size={16} />
            {isHi ? 'आवेदन पत्र पूर्वावलोकन एवं PDF' : 'Review & Generate Official Application'}
          </button>
        </div>
      </div>

      {/* Form Data JSON Inspector Modal */}
      <ExtractedJsonModal
        isOpen={isFormJsonModalOpen}
        onClose={() => setIsFormJsonModalOpen(false)}
        extractedData={{
          fullName: formData.fullName,
          fullNameHi: formData.fullNameHi,
          fatherHusbandName: formData.fatherHusbandName,
          fatherHusbandNameHi: formData.fatherHusbandNameHi,
          motherName: formData.motherName,
          motherNameHi: formData.motherNameHi,
          dob: formData.dob,
          gender: (formData.gender as 'Male' | 'Female' | 'Transgender') || undefined,
          aadhaarNumber: formData.aadhaarNumber,
          panNumber: formData.panNumber,
          voterId: formData.voterId,
          mobileNumber: formData.mobileNumber,
          addressLine: formData.addressLine,
          addressLineHi: formData.addressLineHi,
          pinCode: formData.pinCode,
          district: formData.district,
          districtHi: formData.districtHi,
          tehsil: formData.tehsil,
          tehsilHi: formData.tehsilHi,
          postOffice: formData.postOffice,
          postOfficeHi: formData.postOfficeHi,
          policeStation: formData.policeStation,
          policeStationHi: formData.policeStationHi,
          villageWard: formData.villageWard,
          villageWardHi: formData.villageWardHi,
          state: formData.state,
          stateHi: formData.stateHi,
          documentTypeDetected: 'Citizen Application Profile Data',
          confidence: 100
        }}
        documentName={`Application_${formData.applicationNumber}`}
        language={language}
      />
    </div>
  );
};
