export type Language = 'hi' | 'en';

export type ServiceCategory = 
  | 'domicile' 
  | 'income' 
  | 'caste' 
  | 'employment' 
  | 'character' 
  | 'ration' 
  | 'birth' 
  | 'hill_certificate';

export interface ServiceOption {
  id: ServiceCategory;
  nameEn: string;
  nameHi: string;
  departmentEn: string;
  departmentHi: string;
  icon: string;
  descriptionEn: string;
  descriptionHi: string;
  deliveryDays: number;
  fee: string;
  requiredDocs: Array<{
    id: string;
    nameEn: string;
    nameHi: string;
    maxSizeKB: number;
    mandatory: boolean;
  }>;
}

export interface UttarakhandDistrict {
  id: string;
  nameEn: string;
  nameHi: string;
  division: 'Garhwal' | 'Kumaon';
  headquarters: string;
  tehsils: Array<{
    id: string;
    nameEn: string;
    nameHi: string;
  }>;
}

export interface UploadedDocument {
  id: string;
  docType: string;
  name: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  dataUrl: string;
  mimeType: string;
  uploadTimestamp: number;
  isCompressed: boolean;
  ocrExtracted: boolean;
  extractedData?: ExtractedDocData;
}

export interface ExtractedDocData {
  fullName?: string;
  fullNameHi?: string;
  fatherHusbandName?: string;
  fatherHusbandNameHi?: string;
  motherName?: string;
  motherNameHi?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Transgender';
  aadhaarNumber?: string;
  panNumber?: string;
  voterId?: string;
  state?: string;
  stateHi?: string;
  district?: string;
  districtHi?: string;
  tehsil?: string;
  tehsilHi?: string;
  postOffice?: string;
  postOfficeHi?: string;
  policeStation?: string;
  policeStationHi?: string;
  villageWard?: string;
  villageWardHi?: string;
  addressLine?: string;
  addressLineHi?: string;
  pinCode?: string;
  mobileNumber?: string;
  documentTypeDetected?: string;
  rawText?: string;
  confidence?: number;
  belowScissorLineExtracted?: boolean;
}

export interface CitizenFormData {
  // Service info
  serviceType: ServiceCategory;
  applicationNumber: string;

  // Personal info
  fullName: string;
  fullNameHi?: string;
  gender: string;
  dob: string;
  age?: number;
  maritalStatus: string;
  religion: string;
  casteCategory: string; // General, OBC, SC, ST, EWS
  subCaste?: string;

  // Family info
  fatherHusbandName: string;
  fatherHusbandNameHi?: string;
  motherName: string;
  motherNameHi?: string;
  relationType: 'Father' | 'Husband' | 'Guardian';

  // Contact info
  mobileNumber: string;
  email: string;
  aadhaarNumber: string;
  panNumber?: string;
  voterId?: string;
  rationCardNo?: string;

  // Address info (Uttarakhand & India)
  state: string;
  stateHi?: string;
  district: string;
  districtHi?: string;
  tehsil: string;
  tehsilHi?: string;
  postOffice: string;
  postOfficeHi?: string;
  policeStation: string;
  policeStationHi?: string;
  villageWard: string;
  villageWardHi?: string;
  gramPanchayatBlock?: string;
  addressLine: string;
  addressLineHi?: string;
  pinCode: string;
  livingSinceYears?: string;
  isPermanentResident: boolean;

  // Socio-Economic Details
  occupation: string;
  annualIncome: string;
  incomeSource?: string;

  // Photos & Docs
  applicantPhotoUrl?: string;
  applicantPhotoSizeKB?: number;
  signatureUrl?: string;
  documents: UploadedDocument[];

  // Field metadata (for highlighting fields filled via OCR or Voice or PIN code)
  fieldSources?: Record<string, 'manual' | 'ocr' | 'voice' | 'pincode'>;
}

export interface CompressionOptions {
  maxSizeKB: number;
  maxWidthOrHeight?: number;
  quality?: number;
  fileType?: string;
}

export interface CompressionResult {
  file: File | Blob;
  dataUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

export interface VoiceRecognitionResult {
  transcript: string;
  fieldMatches: Array<{
    fieldKey: keyof CitizenFormData;
    value: string;
    displayLabel: string;
  }>;
}
