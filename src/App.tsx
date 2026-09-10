import React, { useState } from 'react';
import {
  CitizenFormData,
  ExtractedDocData,
  Language
} from './types';
import { Header } from './components/Header';
import { ServiceSelector } from './components/ServiceSelector';
import { DocumentUploader } from './components/DocumentUploader';
import { RegistrationForm } from './components/RegistrationForm';
import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { VoiceFloatingAssistant } from './components/VoiceFloatingAssistant';
import { GuidedVoiceModal } from './components/GuidedVoiceModal';
import { ApplicationPreviewModal } from './components/ApplicationPreviewModal';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import {
  CheckCircle,
  FileCheck2,
  Mic,
  Camera,
  Sparkles,
  ChevronRight,
  Volume2
} from 'lucide-react';

import { parseUttarakhandName, parseBilingualAddress } from './utils/uttarakhandPhonetics';
import { UTTARAKHAND_DISTRICTS } from './data/uttarakhandData';
import { lookupPincodeSync } from './utils/pincodeLookup';

const INITIAL_FORM_DATA: CitizenFormData = {
  serviceType: 'domicile',
  applicationNumber: `UK-EDIST-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
  fullName: '',
  fullNameHi: '',
  gender: 'Male',
  dob: '',
  maritalStatus: 'Unmarried',
  religion: 'Hindu',
  casteCategory: 'General',
  fatherHusbandName: '',
  fatherHusbandNameHi: '',
  motherName: '',
  motherNameHi: '',
  relationType: 'Father',
  mobileNumber: '',
  email: '',
  aadhaarNumber: '',
  state: 'Uttarakhand',
  stateHi: 'उत्तराखंड',
  district: 'Dehradun',
  districtHi: 'देहरादून',
  tehsil: 'Dehradun Sadar',
  tehsilHi: 'देहरादून सदर',
  postOffice: 'Dehradun G.P.O.',
  postOfficeHi: 'देहरादून मुख्य डाकघर (GPO)',
  policeStation: 'Kotwali Dehradun',
  policeStationHi: 'कोतवाली देहरादून नगर',
  villageWard: '',
  villageWardHi: '',
  addressLine: '',
  addressLineHi: '',
  pinCode: '248001',
  isPermanentResident: true,
  occupation: 'Self Employed / Business / स्वरोजगार',
  annualIncome: '85000',
  livingSinceYears: '20',
  documents: [],
  fieldSources: {}
};

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('hi');
  const [formData, setFormData] = useState<CitizenFormData>(INITIAL_FORM_DATA);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isGuidedVoiceOpen, setIsGuidedVoiceOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'info' } | null>(null);

  const isHi = language === 'hi';
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');

  const showToast = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ title, message, type });
    setScreenReaderAnnouncement(`${title}. ${message}`);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Global Hands-Free Voice Commands Executor
  const handleExecuteVoiceCommand = (command: 'openCamera' | 'submitForm' | 'scrollTop' | 'resetForm' | 'openGuidedVoice') => {
    switch (command) {
      case 'openCamera':
        setIsPhotoModalOpen(true);
        break;
      case 'submitForm':
        setIsPreviewModalOpen(true);
        break;
      case 'scrollTop':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'resetForm':
        setFormData(INITIAL_FORM_DATA);
        showToast(
          isHi ? 'फॉर्म रीसेट किया गया' : 'Form Reset',
          isHi ? 'सभी फ़ील्ड्स को खाली कर दिया गया है' : 'All form inputs have been cleared'
        );
        break;
      case 'openGuidedVoice':
        setIsGuidedVoiceOpen(true);
        break;
    }
  };

  // Handle OCR Auto Fill
  const handleAutoFillFromDocument = (extracted: ExtractedDocData) => {
    const updatedSources = { ...formData.fieldSources };
    const updates: Partial<CitizenFormData> = {};

    if (extracted.fullName || extracted.fullNameHi) {
      const rawName = extracted.fullName || extracted.fullNameHi || '';
      const names = parseUttarakhandName(rawName);
      updates.fullName = extracted.fullName || names.englishName || rawName;
      updates.fullNameHi = extracted.fullNameHi || names.hindiName;
      updatedSources.fullName = 'ocr';
      updatedSources.fullNameHi = 'ocr';
    }
    if (extracted.fatherHusbandName || extracted.fatherHusbandNameHi) {
      const rawF = extracted.fatherHusbandName || extracted.fatherHusbandNameHi || '';
      const names = parseUttarakhandName(rawF);
      updates.fatherHusbandName = extracted.fatherHusbandName || names.englishName || rawF;
      updates.fatherHusbandNameHi = extracted.fatherHusbandNameHi || names.hindiName;
      updatedSources.fatherHusbandName = 'ocr';
      updatedSources.fatherHusbandNameHi = 'ocr';
    }
    if (extracted.dob) {
      updates.dob = extracted.dob;
      updatedSources.dob = 'ocr';
    }
    if (extracted.gender) {
      updates.gender = extracted.gender;
      updatedSources.gender = 'ocr';
    }
    if (extracted.aadhaarNumber) {
      updates.aadhaarNumber = extracted.aadhaarNumber;
      updatedSources.aadhaarNumber = 'ocr';
    }
    if (extracted.mobileNumber) {
      updates.mobileNumber = extracted.mobileNumber;
      updatedSources.mobileNumber = 'ocr';
    }
    if (extracted.pinCode) {
      updates.pinCode = extracted.pinCode;
      updatedSources.pinCode = 'ocr';

      // Auto-fill state, district, tehsil, post office, police station from PIN code
      const pinInfo = lookupPincodeSync(extracted.pinCode);
      if (pinInfo) {
        updates.state = pinInfo.state;
        updates.stateHi = pinInfo.stateHi;
        updates.district = pinInfo.district;
        updates.districtHi = pinInfo.districtHi;
        updates.tehsil = pinInfo.tehsil;
        updates.tehsilHi = pinInfo.tehsilHi;
        updates.postOffice = pinInfo.postOffice;
        updates.postOfficeHi = pinInfo.postOfficeHi;
        updates.policeStation = pinInfo.policeStation;
        updates.policeStationHi = pinInfo.policeStationHi;
        updatedSources.state = 'ocr';
        updatedSources.district = 'ocr';
        updatedSources.districtHi = 'ocr';
        updatedSources.tehsil = 'ocr';
        updatedSources.tehsilHi = 'ocr';
        updatedSources.postOffice = 'ocr';
        updatedSources.postOfficeHi = 'ocr';
        updatedSources.policeStation = 'ocr';
      }
    }
    if (extracted.state || extracted.stateHi) {
      updates.state = extracted.state || 'Uttarakhand';
      updates.stateHi = extracted.stateHi || 'उत्तराखंड';
      updatedSources.state = 'ocr';
    }
    if (extracted.district || extracted.districtHi) {
      const distObj = UTTARAKHAND_DISTRICTS.find(
        (d) =>
          d.nameEn.toLowerCase() === extracted.district?.toLowerCase() ||
          d.nameHi === extracted.district ||
          d.nameHi === extracted.districtHi
      );
      updates.district = distObj ? distObj.nameEn : (extracted.district || updates.district || '');
      updates.districtHi = distObj ? distObj.nameHi : (extracted.districtHi || updates.districtHi || '');
      updatedSources.district = 'ocr';
      updatedSources.districtHi = 'ocr';
    }
    if (extracted.tehsil || extracted.tehsilHi) {
      updates.tehsil = extracted.tehsil || updates.tehsil || '';
      updates.tehsilHi = extracted.tehsilHi || updates.tehsilHi || '';
      updatedSources.tehsil = 'ocr';
      updatedSources.tehsilHi = 'ocr';
    }
    if (extracted.postOffice || extracted.postOfficeHi) {
      const rawPo = extracted.postOffice || extracted.postOfficeHi || '';
      const addr = parseBilingualAddress(rawPo);
      updates.postOffice = extracted.postOffice || addr.english || rawPo;
      updates.postOfficeHi = extracted.postOfficeHi || addr.hindi || rawPo;
      updatedSources.postOffice = 'ocr';
      updatedSources.postOfficeHi = 'ocr';
    }
    if (extracted.policeStation || extracted.policeStationHi) {
      const rawPs = extracted.policeStation || extracted.policeStationHi || '';
      const addr = parseBilingualAddress(rawPs);
      updates.policeStation = extracted.policeStation || addr.english || rawPs;
      updates.policeStationHi = extracted.policeStationHi || addr.hindi || rawPs;
      updatedSources.policeStation = 'ocr';
      updatedSources.policeStationHi = 'ocr';
    }
    if (extracted.addressLine || extracted.addressLineHi) {
      const rawAddr = extracted.addressLine || extracted.addressLineHi || '';
      const addr = parseBilingualAddress(rawAddr);
      updates.addressLine = extracted.addressLine || addr.english || rawAddr;
      updates.addressLineHi = extracted.addressLineHi || addr.hindi || rawAddr;
      updatedSources.addressLine = 'ocr';
      updatedSources.addressLineHi = 'ocr';
    }
    if (extracted.villageWard || extracted.villageWardHi) {
      const rawVw = extracted.villageWard || extracted.villageWardHi || '';
      const addr = parseBilingualAddress(rawVw);
      updates.villageWard = extracted.villageWard || addr.english || rawVw;
      updates.villageWardHi = extracted.villageWardHi || addr.hindi || rawVw;
      updatedSources.villageWard = 'ocr';
      updatedSources.villageWardHi = 'ocr';
    }

    setFormData((prev) => ({
      ...prev,
      ...updates,
      fieldSources: updatedSources
    }));

    showToast(
      isHi ? 'दस्तावेज़ से डेटा स्वतः प्रविष्ट!' : 'Auto-Filled from Document!',
      isHi
        ? 'आवेदक का नाम (हिंदी व अंग्रेजी), पिता का नाम, पिन कोड, जिला, तहसील, डाकघर व थाना फॉर्म में दर्ज कर दिया गया है।'
        : 'Name (English & Hindi), Father Name, PIN Code, District, Tehsil, Post Office, and Police Station populated from uploaded ID.'
    );
  };

  // Handle Voice Assistant Matches
  const handleApplyVoiceData = (
    fields: Array<{ fieldKey: keyof CitizenFormData; value: string; displayLabel: string }>
  ) => {
    const updatedSources = { ...formData.fieldSources };
    const updates: any = {};

    fields.forEach((field) => {
      updates[field.fieldKey] = field.value;
      updatedSources[field.fieldKey] = 'voice';
    });

    setFormData((prev) => ({
      ...prev,
      ...updates,
      fieldSources: updatedSources
    }));

    showToast(
      isHi ? 'ध्वनि द्वारा विवरण दर्ज किया गया!' : 'Voice Input Applied!',
      isHi ? `${fields.length} फ़ील्ड्स में बोलकर जानकारी जोड़ी गई` : `Updated ${fields.length} field(s) via voice`
    );
  };

  // Handle direct manual/OCR/Voice/PIN update to single field
  const handleSingleFieldUpdate = (
    key: keyof CitizenFormData,
    value: any,
    source: 'manual' | 'ocr' | 'voice' | 'pincode' = 'manual'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      fieldSources: {
        ...prev.fieldSources,
        [key]: source
      }
    }));
  };

  // Handle multiple updates
  const handleFormChange = (
    updated: Partial<CitizenFormData>,
    source: 'manual' | 'ocr' | 'voice' | 'pincode' = 'manual'
  ) => {
    const newSources = { ...formData.fieldSources };
    Object.keys(updated).forEach((k) => {
      newSources[k] = source;
    });

    setFormData((prev) => ({
      ...prev,
      ...updated,
      fieldSources: newSources
    }));
  };

  const handlePhotoSaved = (photoDataUrl: string, sizeKB: number) => {
    setFormData((prev) => ({
      ...prev,
      applicantPhotoUrl: photoDataUrl,
      applicantPhotoSizeKB: sizeKB
    }));
    showToast(
      isHi ? 'पासपोर्ट फोटो संलग्न!' : 'Passport Photo Attached!',
      isHi ? `फोटो का आकार <50KB संपीड़ित (${sizeKB} KB) किया गया` : `Photo compressed to <50KB (${sizeKB} KB)`
    );
  };

  // Calculate Form Completion Progress
  const requiredFields: Array<keyof CitizenFormData> = [
    'fullName',
    'fatherHusbandName',
    'dob',
    'mobileNumber',
    'aadhaarNumber',
    'district',
    'tehsil',
    'pinCode'
  ];
  const filledCount = requiredFields.filter((f) => !!formData[f]).length;
  const progressPercent = Math.round((filledCount / requiredFields.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/40 via-slate-50 to-teal-50/30">
      {/* Universal Inclusion & Accessibility Toolbar (Font Sizing, High Contrast, Screen Reader) */}
      <AccessibilityToolbar
        isHi={isHi}
        onAnnounceMessage={screenReaderAnnouncement}
      />

      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onToggleVoiceModal={() => setIsVoiceModalOpen(!isVoiceModalOpen)}
        isVoiceActive={isVoiceModalOpen}
      />

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#06402f] via-[#0a5c44] to-[#128060] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles size={13} />
              {isHi ? 'उत्तराखंड शासन ई-गवर्नेंस 2.0 (सर्व-समावेशी)' : 'Govt. of Uttarakhand e-Governance 2.0 (Inclusive)'}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {isHi
                ? 'बोलकर या दस्तावेज़ अपलोड कर भरें सरकारी फॉर्म'
                : 'Accessible Voice & Smart Document Form Assistant'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
              {isHi
                ? 'साक्षर व निरक्षर सभी नागरिकों हेतु: हर खाने के पास माइक 🎙️ दबाकर बोलें, स्पीकर 🔊 से सुनें, या स्वतः गाइड मोड से पूरा फॉर्म भरें।'
                : 'Inclusive for all users: Click inline Mic 🎙️ on any field, listen with Speaker 🔊, or use guided voice walkthrough.'}
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsGuidedVoiceOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl p-3.5 text-left shadow-lg transition-all hover:scale-102 flex flex-col justify-between cursor-pointer border-2 border-amber-200"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-950 text-amber-300 flex items-center justify-center mb-2 font-bold">
                <Volume2 size={18} />
              </div>
              <div>
                <span className="text-xs font-black block">
                  {isHi ? 'ऑडियो गाइड मोड' : 'Guided Voice Flow'}
                </span>
                <span className="text-[10px] text-slate-800 font-semibold">
                  {isHi ? 'सुनें और बोलें' : 'Speak Step-by-Step'}
                </span>
              </div>
            </button>

            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3.5 text-left backdrop-blur-sm transition-all hover:scale-102 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/30 text-amber-200 flex items-center justify-center mb-2">
                <Camera size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isHi ? 'पासपोर्ट फोटो' : 'Passport Photo'}
                </span>
                <span className="text-[10px] text-amber-200">
                  {isHi ? 'वेबकैम / <50KB' : 'Webcam / <50KB'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Progress & Stats Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center font-extrabold text-sm text-emerald-800 flex-shrink-0">
              {progressPercent}%
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {isHi ? 'आवेदन पत्र पूर्णता स्थिति' : 'Application Completion Status'}
              </span>
              <span className="text-xs text-slate-500">
                {filledCount} of {requiredFields.length} {isHi ? 'अनिवार्य विवरण भरे गए' : 'mandatory fields completed'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsGuidedVoiceOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <Mic size={14} className="text-purple-700 animate-pulse" />
              <span>{isHi ? 'वॉयस गाइड से भरें' : 'Voice Guide Flow'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
              <FileCheck2 size={15} className="text-emerald-600" />
              <span>
                {formData.documents.length} {isHi ? 'दस्तावेज़ (<200KB)' : 'Docs (<200KB)'}
              </span>
            </div>

            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="btn-primary text-xs py-2 px-4 shadow-sm cursor-pointer"
            >
              <span>{isHi ? 'आवेदन पत्र देखें (Preview)' : 'Review Application'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Step 1: Service Selector */}
        <ServiceSelector
          selectedService={formData.serviceType}
          onSelectService={(srv) => setFormData((prev) => ({ ...prev, serviceType: srv }))}
          language={language}
        />

        {/* Step 2: Document Uploader with Auto-Compress & OCR Auto-Fill */}
        <DocumentUploader
          documents={formData.documents}
          onDocumentsChange={(docs) => setFormData((prev) => ({ ...prev, documents: docs }))}
          onAutoFillData={handleAutoFillFromDocument}
          language={language}
        />

        {/* Step 3: Registration Form with Inline Voice & Speaker Support */}
        <RegistrationForm
          formData={formData}
          onChange={handleFormChange}
          onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          onOpenGuidedVoice={() => setIsGuidedVoiceOpen(true)}
          onSubmitPreview={() => setIsPreviewModalOpen(true)}
          language={language}
        />
      </main>

      {/* Step-by-Step Guided Voice Flow Modal */}
      <GuidedVoiceModal
        isOpen={isGuidedVoiceOpen}
        onClose={() => setIsGuidedVoiceOpen(false)}
        formData={formData}
        onUpdateField={handleSingleFieldUpdate}
        language={language}
      />

      {/* Floating Assistant Trigger & Modal */}
      <VoiceFloatingAssistant
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onApplyVoiceData={handleApplyVoiceData}
        onExecuteCommand={handleExecuteVoiceCommand}
        language={language}
      />

      {/* Passport Photo Modal */}
      <PhotoCaptureModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSavePhoto={handlePhotoSaved}
        language={language}
      />

      {/* Official e-District Application Preview & PDF Modal */}
      <ApplicationPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        formData={formData}
        language={language}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-start gap-3 animate-slide-up max-w-sm">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle size={16} />
          </div>
          <div className="text-xs">
            <h5 className="font-bold text-emerald-300">{notification.title}</h5>
            <p className="text-slate-300 mt-0.5">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold">
              UK
            </div>
            <div>
              <p className="font-bold text-white">
                उत्तराखंड शासन - सूचना प्रौद्योगिकी विकास एजेंसी (ITDA)
              </p>
              <p className="text-[11px] text-slate-500">
                Government of Uttarakhand • e-District Citizen Services Portal (Inclusive Access)
              </p>
            </div>
          </div>
          <p className="text-[11px]">
            © {new Date().getFullYear()} e-District Uttarakhand. Universal Accessibility Standards Compliant.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default App;
