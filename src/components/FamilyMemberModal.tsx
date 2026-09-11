import React, { useState, useEffect } from 'react';
import {
  Users,
  X,
  UserPlus
} from 'lucide-react';
import { Language, FamilyMember, FamilyRelation } from '../types';
import { parseUttarakhandName } from '../utils/uttarakhandPhonetics';
import { getRelationHindi } from '../utils/citizenStorage';
import { formatAadhaarNumber } from '../utils/aadhaarUtils';

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMember: (member: FamilyMember) => void;
  editingMember?: FamilyMember | null;
  language: Language;
}

const RELATIONS: FamilyRelation[] = [
  'Spouse',
  'Son',
  'Daughter',
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Guardian',
  'Dependent'
];

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onSaveMember,
  editingMember,
  language
}) => {
  const isHi = language === 'hi';
  const [relation, setRelation] = useState<FamilyRelation>('Spouse');
  const [fullName, setFullName] = useState('');
  const [fullNameHi, setFullNameHi] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Transgender'>('Female');
  const [dob, setDob] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [occupation, setOccupation] = useState('Homemaker / गृहिणी');
  const [casteCategory, setCasteCategory] = useState('General');
  const [annualIncome, setAnnualIncome] = useState('0');

  useEffect(() => {
    if (isOpen) {
      if (editingMember) {
        setRelation(editingMember.relation);
        setFullName(editingMember.fullName);
        setFullNameHi(editingMember.fullNameHi || '');
        setGender(editingMember.gender);
        setDob(editingMember.dob);
        setAadhaarNumber(editingMember.aadhaarNumber || '');
        setMobileNumber(editingMember.mobileNumber || '');
        setOccupation(editingMember.occupation || 'Student / छात्र');
        setCasteCategory(editingMember.casteCategory || 'General');
        setAnnualIncome(editingMember.annualIncome || '0');
      } else {
        setRelation('Spouse');
        setFullName('');
        setFullNameHi('');
        setGender('Female');
        setDob('');
        setAadhaarNumber('');
        setMobileNumber('');
        setOccupation('Homemaker / गृहिणी');
        setCasteCategory('General');
        setAnnualIncome('0');
      }
    }
  }, [isOpen, editingMember]);

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

  const handleNameChange = (val: string) => {
    setFullName(val);
    const parsed = parseUttarakhandName(val);
    setFullNameHi(parsed.hindiName);
  };

  const handleRelationChange = (rel: FamilyRelation) => {
    setRelation(rel);
    if (rel === 'Son' || rel === 'Father' || rel === 'Brother') {
      setGender('Male');
    } else if (rel === 'Daughter' || rel === 'Mother' || rel === 'Sister') {
      setGender('Female');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newMember: FamilyMember = {
      id: editingMember?.id || `fam_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      relation,
      relationHi: getRelationHindi(relation),
      fullName: fullName.trim(),
      fullNameHi: fullNameHi.trim() || fullName.trim(),
      gender,
      dob,
      aadhaarNumber: aadhaarNumber.replace(/\D/g, '').slice(0, 12),
      isAadhaarVerified: editingMember?.isAadhaarVerified || false,
      mobileNumber: mobileNumber.replace(/\D/g, '').slice(-10),
      isMobileVerified: editingMember?.isMobileVerified || false,
      occupation,
      casteCategory,
      annualIncome
    };

    onSaveMember(newMember);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-slideUp cursor-default"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                Family Profile Repository
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {editingMember
                  ? isHi ? 'परिवार के सदस्य का विवरण संपादित करें' : 'Edit Family Member Details'
                  : isHi ? 'परिवार का नया सदस्य जोड़ें' : 'Add New Family Member'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 active:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Relation Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHi ? 'आवेदक से संबंध (Relation with Primary Citizen) *' : 'Relation with Primary Citizen *'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RELATIONS.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => handleRelationChange(rel)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg border text-left transition-all cursor-pointer ${
                    relation === rel
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block">{rel}</span>
                  <span className="text-[10px] font-normal text-slate-500 block truncate">
                    {getRelationHindi(rel)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name in English and Hindi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'पूरा नाम (अंग्रेजी में) *' : 'Full Name (in English) *'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Sunita Devi"
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'पूरा नाम (हिंदी में):' : 'Full Name (in Hindi):'}
              </label>
              <input
                type="text"
                value={fullNameHi}
                onChange={(e) => setFullNameHi(e.target.value)}
                placeholder="जैसे: सुनीता देवी"
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'लिंग (Gender):' : 'Gender:'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                <option value="Female">{isHi ? 'महिला (Female)' : 'Female'}</option>
                <option value="Male">{isHi ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="Transgender">{isHi ? 'अन्य (Transgender)' : 'Transgender'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'जन्म तिथि (DOB):' : 'Date of Birth:'}
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
          </div>

          {/* Aadhaar & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'आधार संख्या (12 अंक):' : 'Aadhaar Number (Optional):'}
              </label>
              <input
                type="text"
                maxLength={14}
                value={formatAadhaarNumber(aadhaarNumber)}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="XXXX XXXX XXXX"
                className="w-full font-mono text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'मोबाइल नंबर (10 अंक):' : 'Mobile Number (Optional):'}
              </label>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
          </div>

          {/* Occupation & Annual Income */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'व्यवसाय (Occupation):' : 'Occupation:'}
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Student, Homemaker"
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'व्यक्तिगत वार्षिक आय (₹):' : 'Individual Annual Income (₹):'}
              </label>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="0"
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-5 shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus size={14} />
              <span>
                {editingMember
                  ? isHi ? 'विवरण सुरक्षित करें' : 'Save Changes'
                  : isHi ? 'सदस्य जोड़ें' : 'Add Family Member'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
