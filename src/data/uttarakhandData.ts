import { ServiceOption, UttarakhandDistrict, ExtractedDocData } from '../types';

export const UTTARAKHAND_DISTRICTS: UttarakhandDistrict[] = [
  {
    id: 'dehradun',
    nameEn: 'Dehradun',
    nameHi: 'देहरादून',
    division: 'Garhwal',
    headquarters: 'Dehradun',
    tehsils: [
      { id: 'ddn_sadar', nameEn: 'Dehradun Sadar', nameHi: 'देहरादून सदर' },
      { id: 'rishikesh', nameEn: 'Rishikesh', nameHi: 'ऋषिकेश' },
      { id: 'vikasnagar', nameEn: 'Vikasnagar', nameHi: 'विकासनगर' },
      { id: 'chakrata', nameEn: 'Chakrata', nameHi: 'चकराता' },
      { id: 'kalsi', nameEn: 'Kalsi', nameHi: 'कालसी' },
      { id: 'tyuni', nameEn: 'Tyuni', nameHi: 'त्युणी' },
      { id: 'dOIWALA', nameEn: 'Doiwala', nameHi: 'डोईवाला' }
    ]
  },
  {
    id: 'haridwar',
    nameEn: 'Haridwar',
    nameHi: 'हरिद्वार',
    division: 'Garhwal',
    headquarters: 'Haridwar',
    tehsils: [
      { id: 'haridwar_sadar', nameEn: 'Haridwar Sadar', nameHi: 'हरिद्वार सदर' },
      { id: 'roorkee', nameEn: 'Roorkee', nameHi: 'रुड़की' },
      { id: 'bhagwanpur', nameEn: 'Bhagwanpur', nameHi: 'भगवानपुर' },
      { id: 'laksar', nameEn: 'Laksar', nameHi: 'लक्सर' }
    ]
  },
  {
    id: 'nainital',
    nameEn: 'Nainital',
    nameHi: 'नैनीताल',
    division: 'Kumaon',
    headquarters: 'Nainital',
    tehsils: [
      { id: 'nainital_sadar', nameEn: 'Nainital Sadar', nameHi: 'नैनीताल सदर' },
      { id: 'haldwani', nameEn: 'Haldwani', nameHi: 'हल्द्वानी' },
      { id: 'ramnagar', nameEn: 'Ramnagar', nameHi: 'रामनगर' },
      { id: 'dhari', nameEn: 'Dhari', nameHi: 'धारी' },
      { id: 'kosyakutauli', nameEn: 'Kosyakutauli', nameHi: 'कोश्याकुटौली' },
      { id: 'kaladhungi', nameEn: 'Kaladhungi', nameHi: 'कालाढूंगी' },
      { id: 'laluan', nameEn: 'Lalkuan', nameHi: 'लालकुआं' },
      { id: 'betalghat', nameEn: 'Betalghat', nameHi: 'बेतालघाट' }
    ]
  },
  {
    id: 'almora',
    nameEn: 'Almora',
    nameHi: 'अल्मोड़ा',
    division: 'Kumaon',
    headquarters: 'Almora',
    tehsils: [
      { id: 'almora_sadar', nameEn: 'Almora Sadar', nameHi: 'अल्मोड़ा सदर' },
      { id: 'ranikhet', nameEn: 'Ranikhet', nameHi: 'रानीखेत' },
      { id: 'bhikiyasain', nameEn: 'Bhikiyasain', nameHi: 'भिकियासैंण' },
      { id: 'dwarahat', nameEn: 'Dwarahat', nameHi: 'द्वाराहाट' },
      { id: 'someshwar', nameEn: 'Someshwar', nameHi: 'सोमेश्वर' },
      { id: 'chaukhutiya', nameEn: 'Chaukhutiya', nameHi: 'चौखुटिया' },
      { id: 'sult', nameEn: 'Sult', nameHi: 'सल्ट' },
      { id: 'bhanoli', nameEn: 'Bhanoli', nameHi: 'भनोली' }
    ]
  },
  {
    id: 'pauri_garhwal',
    nameEn: 'Pauri Garhwal',
    nameHi: 'पौड़ी गढ़वाल',
    division: 'Garhwal',
    headquarters: 'Pauri',
    tehsils: [
      { id: 'pauri_sadar', nameEn: 'Pauri Sadar', nameHi: 'पौड़ी सदर' },
      { id: 'srinagar', nameEn: 'Srinagar', nameHi: 'श्रीनगर' },
      { id: 'kotdwar', nameEn: 'Kotdwar', nameHi: 'कोटद्वार' },
      { id: 'lansdowne', nameEn: 'Lansdowne', nameHi: 'लैंसडाउन' },
      { id: 'thalisain', nameEn: 'Thalisain', nameHi: 'थलीसैंण' },
      { id: 'chaubattakhal', nameEn: 'Chaubattakhal', nameHi: 'चौबट्टाखाल' },
      { id: 'satpuli', nameEn: 'Satpuli', nameHi: 'सतपुली' },
      { id: 'dhumakot', nameEn: 'Dhumakot', nameHi: 'धूमाकोट' }
    ]
  },
  {
    id: 'tehri_garhwal',
    nameEn: 'Tehri Garhwal',
    nameHi: 'टिहरी गढ़वाल',
    division: 'Garhwal',
    headquarters: 'New Tehri',
    tehsils: [
      { id: 'new_tehri', nameEn: 'New Tehri', nameHi: 'नई टिहरी' },
      { id: 'narendra_nagar', nameEn: 'Narendra Nagar', nameHi: 'नरेंद्र नगर' },
      { id: 'devprayag', nameEn: 'Devprayag', nameHi: 'देवप्रयाग' },
      { id: 'pratapnagar', nameEn: 'Pratapnagar', nameHi: 'प्रतापनगर' },
      { id: 'ghansali', nameEn: 'Ghansali', nameHi: 'घनसाली' },
      { id: 'dhanaulti', nameEn: 'Dhanaulti', nameHi: 'धनोल्टी' },
      { id: 'jakhanidhar', nameEn: 'Jakhnidhar', nameHi: 'जाखणीधार' }
    ]
  },
  {
    id: 'chamoli',
    nameEn: 'Chamoli',
    nameHi: 'चमोली',
    division: 'Garhwal',
    headquarters: 'Gopeshwar',
    tehsils: [
      { id: 'gopeshwar_chamoli', nameEn: 'Chamoli (Gopeshwar)', nameHi: 'चमोली (गोपेश्वर)' },
      { id: 'joshimath', nameEn: 'Joshimath', nameHi: 'जोशीमठ' },
      { id: 'karnaprayag', nameEn: 'Karnaprayag', nameHi: 'कर्णप्रयाग' },
      { id: 'tharali', nameEn: 'Tharali', nameHi: 'थराली' },
      { id: 'gairsain', nameEn: 'Gairsain', nameHi: 'गैरसैंण' },
      { id: 'pokhari', nameEn: 'Pokhari', nameHi: 'पोखरी' },
      { id: 'ghat', nameEn: 'Nandaprayag (Ghat)', nameHi: 'नन्दप्रयाग (घाट)' }
    ]
  },
  {
    id: 'pithoragarh',
    nameEn: 'Pithoragarh',
    nameHi: 'पिथौरागढ़',
    division: 'Kumaon',
    headquarters: 'Pithoragarh',
    tehsils: [
      { id: 'pithoragarh_sadar', nameEn: 'Pithoragarh Sadar', nameHi: 'पिथौरागढ़ सदर' },
      { id: 'didihat', nameEn: 'Didihat', nameHi: 'दीदीहाट' },
      { id: 'dharchula', nameEn: 'Dharchula', nameHi: 'धारचूला' },
      { id: 'gangolihat', nameEn: 'Gangolihat', nameHi: 'गंगोलीहाट' },
      { id: 'munsiyari', nameEn: 'Munsiyari', nameHi: 'मुनस्यारी' },
      { id: 'berinag', nameEn: 'Berinag', nameHi: 'बेरीनाग' }
    ]
  },
  {
    id: 'udham_singh_nagar',
    nameEn: 'Udham Singh Nagar',
    nameHi: 'ऊधम सिंह नगर',
    division: 'Kumaon',
    headquarters: 'Rudrapur',
    tehsils: [
      { id: 'rudrapur', nameEn: 'Rudrapur', nameHi: 'रुद्रपुर' },
      { id: 'kashipur', nameEn: 'Kashipur', nameHi: 'काशीपुर' },
      { id: 'khatima', nameEn: 'Khatima', nameHi: 'खटीमा' },
      { id: 'kichha', nameEn: 'Kichha', nameHi: 'किच्छा' },
      { id: 'sitarganj', nameEn: 'Sitarganj', nameHi: 'सितारगंज' },
      { id: 'bajpur', nameEn: 'Bajpur', nameHi: 'बाजपुर' },
      { id: 'gadarpur', nameEn: 'Gadarpur', nameHi: 'गदरपुर' },
      { id: 'jaspur', nameEn: 'Jaspur', nameHi: 'जसपुर' }
    ]
  },
  {
    id: 'uttarkashi',
    nameEn: 'Uttarkashi',
    nameHi: 'उत्तरकाशी',
    division: 'Garhwal',
    headquarters: 'Uttarkashi',
    tehsils: [
      { id: 'bhatwari', nameEn: 'Bhatwari (Uttarkashi)', nameHi: 'भटवाड़ी (उत्तरकाशी)' },
      { id: 'barkot', nameEn: 'Barkot', nameHi: 'बड़कोट' },
      { id: 'purola', nameEn: 'Purola', nameHi: 'पुरोला' },
      { id: 'mori', nameEn: 'Mori', nameHi: 'मोरी' },
      { id: 'dunda', nameEn: 'Dunda', nameHi: 'डुंडा' },
      { id: 'chinyalisaur', nameEn: 'Chinyalisaur', nameHi: 'चिन्यालीसौड़' }
    ]
  },
  {
    id: 'rudraprayag',
    nameEn: 'Rudraprayag',
    nameHi: 'रुद्रप्रयाग',
    division: 'Garhwal',
    headquarters: 'Rudraprayag',
    tehsils: [
      { id: 'rudraprayag_sadar', nameEn: 'Rudraprayag Sadar', nameHi: 'रुद्रप्रयाग सदर' },
      { id: 'ukhimath', nameEn: 'Ukhimath', nameHi: 'ऊखीमठ' },
      { id: 'jakholi', nameEn: 'Jakholi', nameHi: 'जाखोली' },
      { id: 'basukedar', nameEn: 'Basukedar', nameHi: 'बसुकेदार' }
    ]
  },
  {
    id: 'bageshwar',
    nameEn: 'Bageshwar',
    nameHi: 'बागेश्वर',
    division: 'Kumaon',
    headquarters: 'Bageshwar',
    tehsils: [
      { id: 'bageshwar_sadar', nameEn: 'Bageshwar Sadar', nameHi: 'बागेश्वर सदर' },
      { id: 'kapkot', nameEn: 'Kapkot', nameHi: 'कपकोट' },
      { id: 'garur', nameEn: 'Garur', nameHi: 'गरुड़' },
      { id: 'kanda', nameEn: 'Kanda', nameHi: 'कांडा' }
    ]
  },
  {
    id: 'champawat',
    nameEn: 'Champawat',
    nameHi: 'चंपावत',
    division: 'Kumaon',
    headquarters: 'Champawat',
    tehsils: [
      { id: 'champawat_sadar', nameEn: 'Champawat Sadar', nameHi: 'चंपावत सदर' },
      { id: 'lohaghat', nameEn: 'Lohaghat', nameHi: 'लोहाघाट' },
      { id: 'pati', nameEn: 'Pati', nameHi: 'पाटी' },
      { id: 'barakot', nameEn: 'Barakot', nameHi: 'बाराकोट' },
      { id: 'tanakpur', nameEn: 'Poornagiri (Tanakpur)', nameHi: 'पूर्णागिरि (टनकपुर)' }
    ]
  }
];

export const GOVT_SERVICES: ServiceOption[] = [
  {
    id: 'domicile',
    nameEn: 'Permanent Resident / Domicile Certificate',
    nameHi: 'स्थाई निवास प्रमाण पत्र (मूल निवास)',
    departmentEn: 'Revenue Department, Govt. of Uttarakhand',
    departmentHi: 'राजस्व विभाग, उत्तराखंड शासन',
    icon: 'Home',
    descriptionEn: 'Official certificate verifying permanent residency in Uttarakhand for education, jobs, and social benefits.',
    descriptionHi: 'शिक्षा, सरकारी नौकरी एवं योजनाओं के लिए उत्तराखंड के स्थाई नागरिक होने का प्रमाण पत्र।',
    deliveryDays: 15,
    fee: '₹ 30',
    requiredDocs: [
      { id: 'doc_aadhaar', nameEn: 'Aadhaar Card / ID Proof', nameHi: 'आधार कार्ड / पहचान पत्र', maxSizeKB: 200, mandatory: true },
      { id: 'doc_residence', nameEn: 'Electricity / Water Bill / Khatoni', nameHi: 'बिजली/पानी बिल या खतौनी', maxSizeKB: 200, mandatory: true },
      { id: 'doc_photo', nameEn: 'Passport Size Photo', nameHi: 'पासपोर्ट साइज फोटो', maxSizeKB: 50, mandatory: true },
      { id: 'doc_school', nameEn: 'School Certificate (10th/12th)', nameHi: 'शैक्षणिक योग्यता प्रमाण पत्र', maxSizeKB: 200, mandatory: false }
    ]
  },
  {
    id: 'income',
    nameEn: 'Income Certificate',
    nameHi: 'आय प्रमाण पत्र',
    departmentEn: 'Revenue Department, Govt. of Uttarakhand',
    departmentHi: 'राजस्व विभाग, उत्तराखंड शासन',
    icon: 'TrendingUp',
    descriptionEn: 'Certificate showing annual household income for scholarships, fee concessions, and government schemes.',
    descriptionHi: 'छात्रवृत्ति, फीस छूट और सरकारी योजनाओं के लिए पारिवारिक वार्षिक आय का आधिकारिक प्रमाण।',
    deliveryDays: 7,
    fee: '₹ 30',
    requiredDocs: [
      { id: 'doc_aadhaar', nameEn: 'Aadhaar Card / Ration Card', nameHi: 'आधार कार्ड / राशन कार्ड', maxSizeKB: 200, mandatory: true },
      { id: 'doc_salary', nameEn: 'Salary Slip / Patwari Report', nameHi: 'वेतन पर्ची / पटवारी रिपोर्ट', maxSizeKB: 200, mandatory: true },
      { id: 'doc_photo', nameEn: 'Applicant Photo', nameHi: 'आवेदक का फोटो', maxSizeKB: 50, mandatory: true }
    ]
  },
  {
    id: 'caste',
    nameEn: 'Caste Certificate (SC / ST / OBC / EWS)',
    nameHi: 'जाति प्रमाण पत्र (अ.जा. / अ.ज.जा. / ओ.बी.सी. / ई.डब्ल्यू.एस.)',
    departmentEn: 'Social Welfare & Revenue Department',
    departmentHi: 'समाज कल्याण एवं राजस्व विभाग',
    icon: 'Award',
    descriptionEn: 'Statutory certificate for availing constitutional reservations and affirmative welfare support in Uttarakhand.',
    descriptionHi: 'आरक्षण और सामाजिक कल्याण लाभ प्राप्त करने हेतु जाति सत्यापन प्रमाण पत्र।',
    deliveryDays: 15,
    fee: '₹ 30',
    requiredDocs: [
      { id: 'doc_aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', maxSizeKB: 200, mandatory: true },
      { id: 'doc_family_caste', nameEn: 'Father/Ancestor Caste Record', nameHi: 'पिता/पूर्वज का जाति अभिलेख', maxSizeKB: 200, mandatory: true },
      { id: 'doc_photo', nameEn: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', maxSizeKB: 50, mandatory: true }
    ]
  },
  {
    id: 'employment',
    nameEn: 'Employment Exchange Registration',
    nameHi: 'उत्तराखंड सेवायोजन / रोजगार पंजीकरण',
    departmentEn: 'Directorate of Training and Employment, UK',
    departmentHi: 'प्रशिक्षण एवं सेवायोजन निदेशालय, उत्तराखंड',
    icon: 'Briefcase',
    descriptionEn: 'Registration on UK Rojgar Portal for state government jobs (UKSSSC, UKPSC) and employment fairs.',
    descriptionHi: 'उत्तराखंड अधीनस्थ सेवा चयन आयोग एवं राज्य नौकरियों हेतु अनिवार्य सेवायोजन पंजीयन।',
    deliveryDays: 3,
    fee: 'Free (निशुल्क)',
    requiredDocs: [
      { id: 'doc_aadhaar', nameEn: 'Aadhaar Card', nameHi: 'आधार कार्ड', maxSizeKB: 200, mandatory: true },
      { id: 'doc_marksheet', nameEn: 'Highest Qualification Marksheet', nameHi: 'उच्चतम शैक्षणिक अंकतालिका', maxSizeKB: 200, mandatory: true },
      { id: 'doc_domicile', nameEn: 'Uttarakhand Domicile Certificate', nameHi: 'मूल निवास प्रमाण पत्र', maxSizeKB: 200, mandatory: true }
    ]
  },
  {
    id: 'character',
    nameEn: 'Character Certificate',
    nameHi: 'चरित्र प्रमाण पत्र',
    departmentEn: 'Police & District Administration',
    departmentHi: 'पुलिस एवं जिला प्रशासन',
    icon: 'ShieldCheck',
    descriptionEn: 'Police and administrative verification of conduct for licensing, government tenders, and admissions.',
    descriptionHi: 'प्रशासनिक व पुलिस सत्यापन आधारित आचरण प्रमाण पत्र।',
    deliveryDays: 10,
    fee: '₹ 30',
    requiredDocs: [
      { id: 'doc_aadhaar', nameEn: 'Aadhaar Card / Voter ID', nameHi: 'आधार कार्ड / मतदाता पहचान पत्र', maxSizeKB: 200, mandatory: true },
      { id: 'doc_photo', nameEn: 'Passport Photo', nameHi: 'पासपोर्ट फोटो', maxSizeKB: 50, mandatory: true }
    ]
  },
  {
    id: 'ration',
    nameEn: 'e-Ration Card (NFSA / State Food Security)',
    nameHi: 'राशन कार्ड (राष्ट्रीय खाद्य सुरक्षा / राज्य खाद्य)',
    departmentEn: 'Food, Civil Supplies & Consumer Affairs',
    departmentHi: 'खाद्य, नागरिक आपूर्ति एवं उपभोक्ता मामले',
    icon: 'ShoppingBag',
    descriptionEn: 'Subsidized ration quota card (APL/BPL/Antyodaya) for fair price shops in Uttarakhand.',
    descriptionHi: 'सस्ते गल्ले की दुकान एवं राशन आवंटन हेतु परिवार खाद्य सुरक्षा कार्ड।',
    deliveryDays: 21,
    fee: '₹ 20',
    requiredDocs: [
      { id: 'doc_aadhaar', nameEn: 'Family Head & Members Aadhaar', nameHi: 'मुखिया व सदस्यों के आधार कार्ड', maxSizeKB: 200, mandatory: true },
      { id: 'doc_lpg', nameEn: 'LPG Gas Passbook / Income Proof', nameHi: 'गैस कनेक्शन पासबुक / आय प्रमाण', maxSizeKB: 200, mandatory: true }
    ]
  }
];

export const OCCUPATIONS_LIST = [
  'Agriculture / कृषक',
  'Private Service / निजी सेवा',
  'Government Employee / सरकारी कर्मचारी',
  'Self Employed / Business / स्वरोजगार',
  'Student / विद्यार्थी',
  'Homemaker / गृहणी',
  'Daily Wage / श्रमिक',
  'Retired / सेवानिवृत्त',
  'Other / अन्य'
];

export const SAMPLE_AADHAAR_MOCK: ExtractedDocData = {
  fullName: 'Ramesh Singh Negi',
  fullNameHi: 'रमेश सिंह नेगी',
  fatherHusbandName: 'Birendra Singh Negi',
  fatherHusbandNameHi: 'बीरेंद्र सिंह नेगी',
  dob: '1996-05-14',
  gender: 'Male',
  aadhaarNumber: '7829 4410 9821',
  mobileNumber: '9876543210',
  addressLine: 'H.No 42, Deodar Enclave, Near Clock Tower',
  addressLineHi: 'मकान नं. ४२, देवदार एन्क्लेव, क्लॉक टॉवर के पास',
  villageWard: 'Rajpur Road Ward No 12',
  villageWardHi: 'राजपुर रोड वार्ड नं. १२',
  postOffice: 'Dehradun G.P.O.',
  postOfficeHi: 'देहरादून मुख्य डाकघर (GPO)',
  policeStation: 'Kotwali Dehradun',
  policeStationHi: 'कोतवाली देहरादून नगर',
  state: 'Uttarakhand',
  stateHi: 'उत्तराखंड',
  district: 'Dehradun',
  districtHi: 'देहरादून',
  tehsil: 'Dehradun Sadar',
  tehsilHi: 'देहरादून सदर',
  pinCode: '248001'
};

export const SAMPLE_BAAL_AADHAAR_MOCK: ExtractedDocData = {
  fullName: 'Aadhaya Kargeti',
  fullNameHi: 'आध्या करगेती',
  fatherHusbandName: 'Asha Kargeti',
  fatherHusbandNameHi: 'आशा करगेती',
  dob: '2024-05-02',
  gender: 'Female',
  aadhaarNumber: '3881 2746 1164',
  mobileNumber: '9410341276',
  addressLine: 'taya po taya, Talya, PO: Chaunallia, Sub District: Bhikia Sain',
  addressLineHi: 'तया पोओ तया, तल्या, चौनाल्लिया, अल्मोड़ा, उत्तराखंड',
  villageWard: 'Talya',
  villageWardHi: 'तल्या',
  postOffice: 'Chaunallia S.O',
  postOfficeHi: 'चौनालिया उप डाकघर',
  policeStation: 'Bhikiyasain Police Station',
  policeStationHi: 'भिकियासैंण थाना',
  state: 'Uttarakhand',
  stateHi: 'उत्तराखंड',
  district: 'Almora',
  districtHi: 'अल्मोड़ा',
  tehsil: 'Bhikiyasain',
  tehsilHi: 'भिकियासैंण',
  pinCode: '263680',
  documentTypeDetected: 'Baal Aadhaar Card (बाल आधार - अल्मोड़ा)',
  belowScissorLineExtracted: true
};

export const SAMPLE_TEHRI_AADHAAR_MOCK: ExtractedDocData = {
  fullName: 'Sarswati',
  fullNameHi: 'सरस्वती',
  dob: '1960-01-01',
  gender: 'Female',
  aadhaarNumber: '3958 7206 6000',
  mobileNumber: '7249957572',
  addressLine: 'CHAKA, Narendranagar, Tehri Garhwal',
  addressLineHi: 'चाका, नरेंद्रनगर, टिहरी गढ़वाल, उत्तराखंड',
  villageWard: 'CHAKA',
  villageWardHi: 'चाका',
  postOffice: 'Narendranagar S.O',
  postOfficeHi: 'नरेंद्रनगर उप डाकघर',
  policeStation: 'Narendranagar Police Station',
  policeStationHi: 'नरेंद्रनगर थाना',
  state: 'Uttarakhand',
  stateHi: 'उत्तराखंड',
  district: 'Tehri Garhwal',
  districtHi: 'टिहरी गढ़वाल',
  tehsil: 'Narendranagar',
  tehsilHi: 'नरेंद्रनगर',
  pinCode: '249175',
  documentTypeDetected: 'Aadhaar Card (टिहरी गढ़वाल)',
  belowScissorLineExtracted: true
};

