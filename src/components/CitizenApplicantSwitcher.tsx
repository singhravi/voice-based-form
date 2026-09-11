import React from 'react';
import {
  User,
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  LogOut,
  Edit2
} from 'lucide-react';
import { Language, CitizenProfile, FamilyMember } from '../types';
import { getRelationHindi } from '../utils/citizenStorage';

interface CitizenApplicantSwitcherProps {
  profile: CitizenProfile;
  activeApplicantId: string; // 'self' or familyMember.id
  onSelectApplicant: (applicantId: string) => void;
  onOpenAddFamilyModal: () => void;
  onOpenEditFamilyModal: (member: FamilyMember) => void;
  onLogout: () => void;
  language: Language;
}

export const CitizenApplicantSwitcher: React.FC<CitizenApplicantSwitcherProps> = ({
  profile,
  activeApplicantId,
  onSelectApplicant,
  onOpenAddFamilyModal,
  onOpenEditFamilyModal,
  onLogout,
  language
}) => {
  const isHi = language === 'hi';
  const isSelfActive = activeApplicantId === 'self';

  return (
    <div className="bg-white border-2 border-emerald-500/30 rounded-2xl shadow-sm overflow-hidden mb-6 animate-fadeIn">
      {/* Top Profile Summary Bar */}
      <div className="bg-gradient-to-r from-[#06402f] to-[#0a5c44] text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-300 text-base shrink-0 shadow-xs">
            {profile.primaryCitizen.fullName.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-white">
                {profile.primaryCitizen.fullName}
              </span>
              {profile.primaryCitizen.fullNameHi && (
                <span className="text-xs text-emerald-200 font-semibold">
                  ({profile.primaryCitizen.fullNameHi})
                </span>
              )}
              <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                +91 {profile.mobileNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-200 mt-0.5">
              <span className="flex items-center gap-1 text-amber-300">
                <CheckCircle2 size={12} />
                {isHi ? 'मोबाइल सत्यापित' : 'Mobile Verified'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <ShieldCheck size={12} />
                {isHi ? 'UIDAI आधार सत्यापित' : 'UIDAI Verified'}
              </span>
              <span>•</span>
              <span className="text-slate-300">
                {profile.familyMembers.length} {isHi ? 'परिवार के सदस्य' : 'Family Members'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="self-end sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer"
          title="लॉगआउट करें (Log Out)"
        >
          <LogOut size={13} />
          <span>{isHi ? 'लॉगआउट (Logout)' : 'Sign Out'}</span>
        </button>
      </div>

      {/* Applicant Selection Tabs */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-700" />
            <span>
              {isHi ? 'यह आवेदन किसके लिए भरा जा रहा है?' : 'Select Certificate Applicant:'}
            </span>
          </label>
          <button
            type="button"
            onClick={onOpenAddFamilyModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <UserPlus size={13} />
            <span>{isHi ? '+ नया सदस्य जोड़ें' : '+ Add Family Member'}</span>
          </button>
        </div>

        {/* Applicant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Primary Citizen (Self) */}
          <div
            onClick={() => onSelectApplicant('self')}
            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
              isSelfActive
                ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-200'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                <User size={16} />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelfActive
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isHi ? 'स्वयं (Self)' : 'Self (Primary)'}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {profile.primaryCitizen.fullName}
            </h4>
            {profile.primaryCitizen.fullNameHi && (
              <p className="text-[11px] text-emerald-800 font-semibold truncate">
                {profile.primaryCitizen.fullNameHi}
              </p>
            )}
            <p className="text-[10px] text-slate-500 mt-1">
              DOB: {profile.primaryCitizen.dob || 'N/A'} | {profile.primaryCitizen.gender}
            </p>
          </div>

          {/* Family Members */}
          {profile.familyMembers.map((member) => {
            const isMemberActive = activeApplicantId === member.id;
            return (
              <div
                key={member.id}
                onClick={() => onSelectApplicant(member.id)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative group ${
                  isMemberActive
                    ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    <Users size={16} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMemberActive
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {member.relation} {isHi ? `(${getRelationHindi(member.relation)})` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditFamilyModal(member);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title={isHi ? 'सदस्य संपादित करें' : 'Edit Member'}
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                  {member.fullName}
                </h4>
                {member.fullNameHi && (
                  <p className="text-[11px] text-teal-800 font-semibold truncate">
                    {member.fullNameHi}
                  </p>
                )}
                <p className="text-[10px] text-slate-500 mt-1">
                  DOB: {member.dob || 'N/A'} | {member.gender}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
