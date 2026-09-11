import { UidaiEkycResult } from '../types';
import { parseUttarakhandName, parseBilingualAddress } from './uttarakhandPhonetics';

interface ActiveOtpSession {
  target: string;
  otp: string;
  expiresAt: number;
  type: 'mobile' | 'aadhaar';
}

const activeOtpSessions = new Map<string, ActiveOtpSession>();

/**
 * Known Mock UIDAI database records
 */
const MOCK_UIDAI_RECORDS: Record<string, Partial<UidaiEkycResult>> = {
  '234567890123': {
    aadhaarNumber: '234567890123',
    fullName: 'Ravi Shankar Singh',
    fullNameHi: 'रवि शंकर सिंह',
    fatherHusbandName: 'Late Birendra Singh Negi',
    fatherHusbandNameHi: 'स्व. बीरेंद्र सिंह नेगी',
    dob: '1988-06-15',
    gender: 'Male',
    addressLine: 'House No. 42-B, Near Clock Tower, Rajpur Road',
    addressLineHi: 'मकान संख्या 42-बी, घंटाघर के पास, राजपुर रोड',
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
    pinCode: '248001'
  },
  '345678901234': {
    aadhaarNumber: '345678901234',
    fullName: 'Sunita Devi',
    fullNameHi: 'सुनीता देवी',
    fatherHusbandName: 'Ravi Shankar Singh',
    fatherHusbandNameHi: 'रवि शंकर सिंह',
    dob: '1992-04-10',
    gender: 'Female',
    addressLine: 'House No. 42-B, Near Clock Tower, Rajpur Road',
    addressLineHi: 'मकान संख्या 42-बी, घंटाघर के पास, राजपुर रोड',
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
    pinCode: '248001'
  }
};

/**
 * Request Mobile OTP
 */
export function requestMobileOtp(mobileNumber: string): { success: boolean; otp: string; message: string } {
  const cleanMob = mobileNumber.replace(/\D/g, '').slice(-10);
  if (cleanMob.length !== 10) {
    return { success: false, otp: '', message: 'Invalid 10-digit mobile number' };
  }

  // Generate 6 digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const session: ActiveOtpSession = {
    target: cleanMob,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    type: 'mobile'
  };

  activeOtpSessions.set(`mob_${cleanMob}`, session);

  return {
    success: true,
    otp,
    message: `OTP sent to +91 ${cleanMob}. (Dev Mode OTP: ${otp})`
  };
}

/**
 * Verify Mobile OTP
 */
export function verifyMobileOtp(
  mobileNumber: string,
  enteredOtp: string
): { verified: boolean; message: string } {
  const cleanMob = mobileNumber.replace(/\D/g, '').slice(-10);
  const session = activeOtpSessions.get(`mob_${cleanMob}`);

  // Support dev master bypass OTP
  if (enteredOtp.trim() === '123456') {
    return { verified: true, message: 'Mobile successfully verified (Demo Master PIN).' };
  }

  if (!session) {
    return { verified: false, message: 'No active OTP request found. Please request a new OTP.' };
  }

  if (Date.now() > session.expiresAt) {
    activeOtpSessions.delete(`mob_${cleanMob}`);
    return { verified: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  if (session.otp !== enteredOtp.trim()) {
    return { verified: false, message: 'Incorrect OTP. Please enter the valid 6-digit code.' };
  }

  activeOtpSessions.delete(`mob_${cleanMob}`);
  return { verified: true, message: 'Mobile verified successfully.' };
}

/**
 * Request UIDAI Aadhaar OTP (Simulated)
 */
export function requestUidaiAadhaarOtp(
  aadhaarNumber: string
): { success: boolean; otp: string; maskedMobile: string; message: string } {
  const cleanAadhaar = aadhaarNumber.replace(/\D/g, '').slice(0, 12);
  if (cleanAadhaar.length !== 12) {
    return {
      success: false,
      otp: '',
      maskedMobile: '',
      message: 'Invalid 12-digit Aadhaar number.'
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const maskedMobile = `XXXXXX${cleanAadhaar.slice(-4)}`;

  const session: ActiveOtpSession = {
    target: cleanAadhaar,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    type: 'aadhaar'
  };

  activeOtpSessions.set(`aadhaar_${cleanAadhaar}`, session);

  return {
    success: true,
    otp,
    maskedMobile,
    message: `UIDAI OTP sent to registered mobile (${maskedMobile}). (Dev Mode OTP: ${otp})`
  };
}

/**
 * Verify UIDAI Aadhaar OTP and fetch e-KYC Data
 */
export function verifyUidaiAadhaarOtp(
  aadhaarNumber: string,
  enteredOtp: string,
  fallbackName?: string
): { verified: boolean; ekyc?: UidaiEkycResult; message: string } {
  const cleanAadhaar = aadhaarNumber.replace(/\D/g, '').slice(0, 12);
  const session = activeOtpSessions.get(`aadhaar_${cleanAadhaar}`);

  const isBypass = enteredOtp.trim() === '123456';
  if (!isBypass) {
    if (!session) {
      return { verified: false, message: 'No active UIDAI OTP session. Please request a new OTP.' };
    }

    if (Date.now() > session.expiresAt) {
      activeOtpSessions.delete(`aadhaar_${cleanAadhaar}`);
      return { verified: false, message: 'UIDAI OTP expired. Please request a new OTP.' };
    }

    if (session.otp !== enteredOtp.trim()) {
      return { verified: false, message: 'Incorrect UIDAI OTP code. Please re-enter.' };
    }
  }

  activeOtpSessions.delete(`aadhaar_${cleanAadhaar}`);

  // Retrieve or generate mock e-KYC Record
  const existingRecord = MOCK_UIDAI_RECORDS[cleanAadhaar];
  if (existingRecord) {
    const ekyc: UidaiEkycResult = {
      aadhaarNumber: cleanAadhaar,
      fullName: existingRecord.fullName || 'Ravi Shankar Singh',
      fullNameHi: existingRecord.fullNameHi || 'रवि शंकर सिंह',
      fatherHusbandName: existingRecord.fatherHusbandName || 'Late Birendra Singh Negi',
      fatherHusbandNameHi: existingRecord.fatherHusbandNameHi || 'स्व. बीरेंद्र सिंह नेगी',
      dob: existingRecord.dob || '1988-06-15',
      gender: (existingRecord.gender as any) || 'Male',
      addressLine: existingRecord.addressLine || 'House No. 42-B, Rajpur Road',
      addressLineHi: existingRecord.addressLineHi || 'मकान संख्या 42-बी, राजपुर रोड',
      state: existingRecord.state || 'Uttarakhand',
      stateHi: existingRecord.stateHi || 'उत्तराखंड',
      district: existingRecord.district || 'Dehradun',
      districtHi: existingRecord.districtHi || 'देहरादून',
      tehsil: existingRecord.tehsil || 'Dehradun Sadar',
      tehsilHi: existingRecord.tehsilHi || 'देहरादून सदर',
      postOffice: existingRecord.postOffice || 'Dehradun G.P.O.',
      postOfficeHi: existingRecord.postOfficeHi || 'देहरादून मुख्य डाकघर (GPO)',
      policeStation: existingRecord.policeStation || 'Kotwali Dehradun',
      policeStationHi: existingRecord.policeStationHi || 'कोतवाली देहरादून नगर',
      villageWard: existingRecord.villageWard || 'Ward 12, Rajpur Road',
      villageWardHi: existingRecord.villageWardHi || 'वार्ड 12, राजपुर रोड',
      pinCode: existingRecord.pinCode || '248001',
      verifiedTimestamp: Date.now()
    };
    return { verified: true, ekyc, message: 'UIDAI e-KYC authentication successful.' };
  }

  // Dynamic dynamic generator for arbitrary Aadhaar numbers
  const candidateName = fallbackName?.trim() || 'Virendra Singh Chauhan';
  const parsedNames = parseUttarakhandName(candidateName);
  const parsedFather = parseUttarakhandName('Pt. Radhey Shyam Chauhan');
  const parsedAddr = parseBilingualAddress('House No. 108, Civil Lines');

  const dynamicEkyc: UidaiEkycResult = {
    aadhaarNumber: cleanAadhaar,
    fullName: parsedNames.englishName,
    fullNameHi: parsedNames.hindiName,
    fatherHusbandName: parsedFather.englishName,
    fatherHusbandNameHi: parsedFather.hindiName,
    dob: '1990-08-14',
    gender: 'Male',
    addressLine: parsedAddr.english,
    addressLineHi: parsedAddr.hindi,
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
    villageWard: 'Civil Lines Ward 04',
    villageWardHi: 'सिविल लाइन्स वार्ड 04',
    pinCode: '248001',
    verifiedTimestamp: Date.now()
  };

  return { verified: true, ekyc: dynamicEkyc, message: 'UIDAI e-KYC authentication successful.' };
}
