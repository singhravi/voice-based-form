import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  Lock,
  FileText,
  UserCheck,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Scale,
  RefreshCw,
  Trash2,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Language } from '../types';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'notice' | 'rights' | 'grievance'>('notice');
  const isHi = language === 'hi';

  // Instant Escape key close listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dpdp-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden cursor-default"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0a5c44] via-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wide">
                  DPDP Act 2023 & DPDP Rules 2025
                </span>
                <span className="text-[10px] bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full">
                  Sec 5 & 6 Compliant
                </span>
              </div>
              <h2 id="dpdp-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {isHi
                  ? 'डिजिटल व्यक्तिगत डेटा संरक्षण सूचना एवं नागरिक अधिकार'
                  : 'Digital Personal Data Protection Notice & Citizen Rights'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 active:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('notice')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'notice'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 border-x border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={15} />
            <span>{isHi ? 'गोपनीयता सूचना (Notice)' : 'Privacy Notice (Sec 5)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('rights')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rights'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 border-x border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck size={15} />
            <span>{isHi ? 'नागरिक अधिकार (Citizen Rights)' : 'Data Principal Rights'}</span>
          </button>
          <button
            onClick={() => setActiveTab('grievance')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'grievance'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 border-x border-slate-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale size={15} />
            <span>{isHi ? 'शिकायत निवारण एवं DPO' : 'DPO & Grievance Cell'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4">
          {activeTab === 'notice' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 sm:p-4 text-slate-800">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-1">
                  <Lock size={16} className="text-emerald-700" />
                  <span>
                    {isHi
                      ? 'धारा 5 के अंतर्गत अनिवार्य सूचना (Notice under Section 5, DPDP Act 2023)'
                      : 'Statutory Notice under Section 5 of the Digital Personal Data Protection Act, 2023'}
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  {isHi
                    ? 'यह पोर्टल उत्तराखंड सरकार के विभिन्न नागरिक प्रमाण-पत्रों (स्थायी निवास, आय, जाति आदि) के पारदर्शी एवं सुरक्षित निस्तारण हेतु डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 एवं नियम 2025 के कड़े प्रावधानों के तहत कार्य करता है।'
                    : 'This portal operates in strict compliance with the Digital Personal Data Protection Act, 2023 and DPDP Rules 2025 for processing public service delivery and government certificate issuance in Uttarakhand.'}
                </p>
              </div>

              {/* Data Fiduciary Details */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide text-emerald-800">
                  <Building2 size={16} />
                  <span>{isHi ? '1. डेटा न्यासी (Data Fiduciary)' : '1. Data Fiduciary Identity'}</span>
                </h3>
                <p className="text-xs text-slate-600">
                  <strong>Department of Information Technology & e-District Cell</strong>, Government of Uttarakhand, ITDA Building, IT Park, Dehradun - 248013.
                </p>
              </div>

              {/* Purpose of Processing */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide text-emerald-800">
                  <CheckCircle2 size={16} />
                  <span>{isHi ? '2. डेटा एकत्र करने का विनिर्दिष्ट प्रयोजन (Specified Purposes)' : '2. Specified Purposes of Processing'}</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
                  <li>
                    {isHi
                      ? 'ई-डिस्ट्रिक्ट पोर्टल के माध्यम से नागरिक प्रमाण पत्र एवं सेवा वितरण।'
                      : 'Issuance and digital verification of state certificates (Domicile, Income, Caste, Birth/Death).'}
                  </li>
                  <li>
                    {isHi
                      ? 'नागरिक की पहचान का वैधानिक सत्यापन एवं शासकीय रिकॉर्ड का रखरखाव।'
                      : 'Statutory verification of citizen identity and cross-referencing with authorized government registers.'}
                  </li>
                  <li>
                    {isHi
                      ? 'आवेदन की स्थिति की जानकारी हेतु SMS/ईमेल द्वारा सूचना प्रेषण।'
                      : 'Communication of application updates, approvals, and OTP verification via SMS/Email.'}
                  </li>
                </ul>
              </div>

              {/* Itemised Data Collected */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide text-emerald-800">
                  <FileText size={16} />
                  <span>{isHi ? '3. एकत्र किए जाने वाले व्यक्तिगत डेटा की मदवार सूची (Itemised Personal Data)' : '3. Itemised Personal Data Collected'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      {isHi ? 'पहचान विवरण (Identity Details)' : 'Identity & Demographic'}
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {isHi
                        ? 'नाम, पिता/पति का नाम, माता का नाम, जन्म तिथि, लिंग, फोटो एवं हस्ताक्षर।'
                        : 'Full Name (En/Hi), Father/Husband Name, Mother Name, Date of Birth, Gender, Photo & Signature.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      {isHi ? 'वैधानिक पहचान संख्या (Statutory IDs)' : 'Government Identifiers'}
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {isHi
                        ? 'आधार संख्या (मास्क्ड व एन्क्रिप्टेड), पैन संख्या, मतदाता पहचान पत्र, राशन कार्ड।'
                        : 'Aadhaar (masked & encrypted client-side), PAN, Voter ID, Ration Card.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      {isHi ? 'संपर्क एवं निवास विवरण (Contact & Address)' : 'Contact & Address'}
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {isHi
                        ? 'मोबाइल नंबर, ईमेल, राज्य, जिला, तहसील, डाकघर, थाना, ग्राम/वार्ड, पिन कोड।'
                        : 'Mobile Number, Email, District, Tehsil, Post Office, Police Station, Village/Ward, PIN code.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      {isHi ? 'सामाजिक-आर्थिक विवरण (Socio-Economic)' : 'Socio-Economic Info'}
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      {isHi
                        ? 'व्यवसाय, वार्षिक आय, जाति श्रेणी, उत्तराखंड में निवास अवधि।'
                        : 'Occupation, Annual Family Income, Caste Category, Living Duration in Uttarakhand.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edge/Local Client-Side AI Privacy */}
              <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-3.5 text-xs text-indigo-950">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck size={16} className="text-indigo-700 shrink-0" />
                  <span>
                    {isHi
                      ? 'क्लाइंट-साइड गोपनीयता सुरक्षा (Client-Side Privacy by Design)'
                      : 'Privacy by Design & Edge Processing'}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-900">
                  {isHi
                    ? 'दस्तावेज़ संपीड़न (<200KB) एवं OCR डेटा निष्कर्षण पूरी तरह से आपके ब्राउज़र/डिवाइस पर स्थानीय रूप से संसाधित होता है। कोई भी असंसाधित बायोमेट्रिक या कच्ची छवि किसी भी तृतीय-पक्ष सर्वर पर नहीं भेजी जाती।'
                    : 'Document compression (<200KB) and OCR auto-fill are executed client-side inside your browser environment. Raw document images are never transmitted to unauthorized third parties.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rights' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-2">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {isHi
                    ? 'अधिनियम के तहत डेटा स्वामी (नागरिक) के वैधानिक अधिकार'
                    : 'Statutory Rights of the Data Principal (Citizen)'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isHi
                    ? 'DPDP अधिनियम 2023 की धारा 11, 12, 13 और 14 के अनुसार आपके पास निम्नलिखित अधिकार हैं:'
                    : 'Under Sections 11, 12, 13, and 14 of the DPDP Act 2023, you are entitled to the following enforceable rights:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <Eye size={16} className="text-emerald-700" />
                    <span>{isHi ? '1. डेटा एक्सेस का अधिकार (Sec 11)' : '1. Right to Access Personal Data'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {isHi
                      ? 'आप अपने संसाधित व्यक्तिगत डेटा का सारांश, प्रसंस्करण गतिविधियों और साझा किए गए विभागों का विवरण देखने के हकदार हैं।'
                      : 'You have the right to obtain a summary of your personal data being processed and the identities of all authorized entities with whom data is shared.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <RefreshCw size={16} className="text-emerald-700" />
                    <span>{isHi ? '2. संशोधन व अद्यतन का अधिकार (Sec 12)' : '2. Right to Correction & Updating'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {isHi
                      ? 'किसी भी अशुद्ध, अपूर्ण या पुराने व्यक्तिगत डेटा को सुधारने अथवा अद्यतन करने का अधिकार है।'
                      : 'You have the right to request correction, completion, or updating of inaccurate or misleading personal data.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <Trash2 size={16} className="text-emerald-700" />
                    <span>{isHi ? '3. विलोपन / सहमति वापसी (Sec 6 & 12)' : '3. Erasure & Consent Withdrawal'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {isHi
                      ? 'वैधानिक अवधि पूर्ण होने पर डेटा विलोपन तथा पूर्व में दी गई सहमति को किसी भी समय वापस लेने की स्वतंत्रता।'
                      : 'You may withdraw consent at any time and request erasure of personal data once the statutory certificate lifecycle ends.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <UserCheck size={16} className="text-emerald-700" />
                    <span>{isHi ? '4. नामांकन का अधिकार (Sec 14)' : '4. Right to Nominate'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {isHi
                      ? 'मृत्यु या असमर्थता की स्थिति में अपने डेटा अधिकारों के प्रयोग हेतु किसी अन्य व्यक्ति को नामित करने का अधिकार।'
                      : 'You have the right to nominate any individual to exercise your data protection rights in the event of death or incapacity.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grievance' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-amber-950 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <HelpCircle size={16} className="text-amber-700 shrink-0" />
                  <span>
                    {isHi
                      ? 'शिकायत निवारण अधिकारी (Grievance Redressal Officer under Sec 13)'
                      : 'Grievance Redressal & Data Protection Officer Contact'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900">
                  {isHi
                    ? 'DPDP नियम 2025 के अनुसार, डेटा से संबंधित किसी भी शिकायत या अधिकार प्रयोग का त्वरित निस्तारण किया जाता है।'
                    : 'Under DPDP Rules 2025, any grievance regarding personal data processing or consent will be resolved within statutory timelines.'}
                </p>
              </div>

              {/* DPO Contact Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>Data Protection Officer (DPO) & Grievance Cell</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Official Authority
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Building2 size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Office Location:</span>
                      <span className="text-slate-600">
                        Information Technology Development Agency (ITDA), IT Park, Sahastradhara Road, Dehradun, Uttarakhand - 248013
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail size={16} className="text-slate-500 shrink-0" />
                    <div>
                      <span className="font-semibold">Nodal Email:</span>{' '}
                      <a href="mailto:dpo-edistrict@uk.gov.in" className="text-emerald-700 underline font-mono">
                        dpo-edistrict@uk.gov.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-slate-500 shrink-0" />
                    <div>
                      <span className="font-semibold">Helpline / Toll-Free:</span>{' '}
                      <span className="font-bold text-slate-900">1800-180-2525</span> / <span className="font-bold">1905</span> (Uttarakhand CM Helpline)
                    </div>
                  </div>
                </div>
              </div>

              {/* Appellate Body */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">
                  {isHi ? 'अपीलीय प्राधिकारी (Appellate Authority):' : 'Data Protection Board of India (DPBI):'}
                </span>
                {isHi
                  ? 'यदि आप डेटा न्यासी के शिकायत निवारण से संतुष्ट नहीं हैं, तो आप डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 की धारा 18 के तहत भारतीय डेटा संरक्षण बोर्ड (DPBI) के समक्ष ऑनलाइन अपील दायर कर सकते हैं।'
                  : 'If unresolved within the prescribed period, you may escalate complaints to the Data Protection Board of India (DPBI) under Section 18 of the DPDP Act 2023.'}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>
              {isHi
                ? 'यह सूचना DPDP अधिनियम 2023 व DPDP नियम 2025 के अनुपालनार्थ प्रदर्शित है।'
                : 'Published in compliance with DPDP Act 2023 & DPDP Rules 2025.'}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="btn-primary text-xs py-2.5 px-6 shadow-sm cursor-pointer w-full sm:w-auto"
          >
            {isHi ? 'अवगत हुआ / बंद करें' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
