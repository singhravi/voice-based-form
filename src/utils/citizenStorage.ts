import { CitizenProfile, FamilyMember } from '../types';

const CITIZEN_STORAGE_KEY = 'uk_citizen_profiles_v1';
const ACTIVE_SESSION_KEY = 'uk_active_citizen_session_v1';

/**
  * Default Seed Profile for instant demo & testing
  */
const SEED_PROFILES: Record<string, CitizenProfile> = {
  '9876543210': {
    mobileNumber: '9876543210',
    isMobileVerified: true,
    isAadhaarVerified: true,
    verifiedAadhaar: '234567890123',
    registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastLoginAt: new Date().toISOString(),
    primaryCitizen: {
      serviceType: 'domicile',
      applicationNumber: 'UK-EDIST-2026-849201',
      fullName: 'Ravi Shankar Singh',
      fullNameHi: 'रवि शंकर सिंह',
      gender: 'Male',
      dob: '1988-06-15',
      maritalStatus: 'Married',
      religion: 'Hindu',
      casteCategory: 'General',
      fatherHusbandName: 'Late Birendra Singh Negi',
      fatherHusbandNameHi: 'स्व. बीरेंद्र सिंह नेगी',
      motherName: 'Kamla Devi',
      motherNameHi: 'कमला देवी',
      relationType: 'Father',
      mobileNumber: '9876543210',
      email: 'ravi.singh@example.com',
      aadhaarNumber: '234567890123',
      panNumber: 'ABCPS1234F',
      voterId: 'UK/01/023/456789',
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
      villageWard: 'Ward 12, Rajpur Road',
      villageWardHi: 'वार्ड 12, राजपुर रोड',
      addressLine: 'House No. 42-B, Near Clock Tower, Rajpur Road',
      addressLineHi: 'मकान संख्या 42-बी, घंटाघर के पास, राजपुर रोड',
      pinCode: '248001',
      isPermanentResident: false,
      occupation: 'Self Employed / Business / स्वरोजगार',
      annualIncome: '180000',
      livingSinceYears: '25',
      documents: [],
      fieldSources: {
        fullName: 'uidai',
        fullNameHi: 'uidai',
        dob: 'uidai',
        gender: 'uidai',
        fatherHusbandName: 'uidai',
        fatherHusbandNameHi: 'uidai',
        district: 'pincode',
        tehsil: 'pincode',
        postOffice: 'pincode',
        policeStation: 'pincode',
        addressLine: 'uidai',
        addressLineHi: 'uidai',
        mobileNumber: 'manual',
        aadhaarNumber: 'uidai'
      },
      isMobileVerified: true,
      isAadhaarVerified: true
    },
    familyMembers: [
      {
        id: 'fam_sunita_01',
        relation: 'Spouse',
        relationHi: 'पत्नी / जीवनसाथी',
        fullName: 'Sunita Devi',
        fullNameHi: 'सुनीता देवी',
        gender: 'Female',
        dob: '1992-04-10',
        aadhaarNumber: '345678901234',
        isAadhaarVerified: true,
        mobileNumber: '9876543211',
        isMobileVerified: false,
        casteCategory: 'General',
        occupation: 'Homemaker / गृहिणी',
        annualIncome: '0'
      },
      {
        id: 'fam_aarav_02',
        relation: 'Son',
        relationHi: 'पुत्र (बेटा)',
        fullName: 'Aarav Singh',
        fullNameHi: 'आरव सिंह',
        gender: 'Male',
        dob: '2015-09-22',
        aadhaarNumber: '456789012345',
        isAadhaarVerified: true,
        mobileNumber: '9876543210',
        isMobileVerified: true,
        casteCategory: 'General',
        occupation: 'Student / छात्र',
        annualIncome: '0'
      },
      {
        id: 'fam_ananya_03',
        relation: 'Daughter',
        relationHi: 'पुत्री (बेटी)',
        fullName: 'Ananya Singh',
        fullNameHi: 'अनन्या सिंह',
        gender: 'Female',
        dob: '2018-12-05',
        aadhaarNumber: '567890123456',
        isAadhaarVerified: false,
        mobileNumber: '9876543210',
        casteCategory: 'General',
        occupation: 'Student / छात्रा',
        annualIncome: '0'
      }
    ]
  }
};

/**
  * Initialize storage with default seed profiles if empty
  */
function initializeStorage(): Record<string, CitizenProfile> {
  try {
    const raw = localStorage.getItem(CITIZEN_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(SEED_PROFILES));
      return SEED_PROFILES;
    }
    const parsed = JSON.parse(raw);
    // Ensure seed profiles exist
    let updated = false;
    for (const [mob, prof] of Object.entries(SEED_PROFILES)) {
      if (!parsed[mob]) {
        parsed[mob] = prof;
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error('Error reading citizen storage:', err);
    return SEED_PROFILES;
  }
}

/**
 * Get profile for a mobile number
 */
export function getCitizenProfile(mobileNumber: string): CitizenProfile | null {
  const cleanMob = mobileNumber.replace(/\D/g, '').slice(-10);
  if (!cleanMob) return null;
  const profiles = initializeStorage();
  return profiles[cleanMob] || null;
}

/**
 * Save or update a citizen profile
 */
export function saveCitizenProfile(profile: CitizenProfile): void {
  const cleanMob = profile.mobileNumber.replace(/\D/g, '').slice(-10);
  if (!cleanMob) return;
  const profiles = initializeStorage();
  profiles[cleanMob] = {
    ...profile,
    mobileNumber: cleanMob,
    lastLoginAt: new Date().toISOString()
  };
  localStorage.setItem(CITIZEN_STORAGE_KEY, JSON.stringify(profiles));
}

/**
 * Add or update a family member in a citizen's profile
 */
export function addOrUpdateFamilyMember(
  mobileNumber: string,
  member: FamilyMember
): CitizenProfile | null {
  const profile = getCitizenProfile(mobileNumber);
  if (!profile) return null;

  const existingIdx = profile.familyMembers.findIndex((m) => m.id === member.id);
  if (existingIdx >= 0) {
    profile.familyMembers[existingIdx] = member;
  } else {
    profile.familyMembers.push(member);
  }

  saveCitizenProfile(profile);
  return profile;
}

/**
 * Delete a family member from a citizen's profile
 */
export function deleteFamilyMember(
  mobileNumber: string,
  memberId: string
): CitizenProfile | null {
  const profile = getCitizenProfile(mobileNumber);
  if (!profile) return null;

  profile.familyMembers = profile.familyMembers.filter((m) => m.id !== memberId);
  saveCitizenProfile(profile);
  return profile;
}

/**
 * Active Logged-in Session Management
 */
export function getActiveSessionMobile(): string | null {
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
}

export function setActiveSessionMobile(mobileNumber: string | null): void {
  try {
    if (mobileNumber) {
      const cleanMob = mobileNumber.replace(/\D/g, '').slice(-10);
      localStorage.setItem(ACTIVE_SESSION_KEY, cleanMob);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch (err) {
    console.error('Error updating active session:', err);
  }
}

/**
 * Map Family Relation to Hindi Label
 */
export function getRelationHindi(rel: string): string {
  const map: Record<string, string> = {
    Spouse: 'पति / पत्नी (जीवनसाथी)',
    Son: 'पुत्र (बेटा)',
    Daughter: 'पुत्री (बेटी)',
    Father: 'पिता',
    Mother: 'माता',
    Brother: 'भाई',
    Sister: 'बहन',
    Guardian: 'अभिभावक / संरक्षक',
    Dependent: 'आश्रित'
  };
  return map[rel] || rel;
}
