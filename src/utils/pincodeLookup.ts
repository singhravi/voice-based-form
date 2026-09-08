/**
 * Comprehensive Indian & Uttarakhand Postal PIN Code Directory & Lookup Service
 * Maps 6-digit PIN codes to State, District, Tehsil, Post Office, and Police Station (Bilingual: English & Hindi).
 */

export interface PincodeLookupResult {
  pinCode: string;
  state: string;
  stateHi: string;
  district: string;
  districtHi: string;
  tehsil: string;
  tehsilHi: string;
  postOffice: string;
  postOfficeHi: string;
  policeStation: string;
  policeStationHi: string;
  availablePostOffices?: Array<{ en: string; hi: string }>;
  availablePoliceStations?: Array<{ en: string; hi: string }>;
}

export const UTTARAKHAND_PINCODE_DATABASE: Record<string, PincodeLookupResult> = {
  // === DEHRADUN DISTRICT ===
  '248001': {
    pinCode: '248001',
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
    availablePostOffices: [
      { en: 'Dehradun G.P.O.', hi: 'देहरादून मुख्य डाकघर' },
      { en: 'Clock Tower S.O', hi: 'घंटाघर उप डाकघर' },
      { en: 'Rajpur Road S.O', hi: 'राजपुर रोड उप डाकघर' },
      { en: 'Paltan Bazar S.O', hi: 'पलटन बाजार उप डाकघर' }
    ],
    availablePoliceStations: [
      { en: 'Kotwali Dehradun', hi: 'कोतवाली देहरादून नगर' },
      { en: 'Dalanwala Police Station', hi: 'डालनवाला थाना' },
      { en: 'Rajpur Police Station', hi: 'राजपुर थाना' }
    ]
  },
  '248002': {
    pinCode: '248002',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Dehradun Sadar',
    tehsilHi: 'देहरादून सदर',
    postOffice: 'Dalanwala S.O',
    postOfficeHi: 'डालनवाला उप डाकघर',
    policeStation: 'Dalanwala Police Station',
    policeStationHi: 'डालनवाला थाना',
    availablePostOffices: [
      { en: 'Dalanwala S.O', hi: 'डालनवाला उप डाकघर' },
      { en: 'Karanpur S.O', hi: 'करनपुर उप डाकघर' }
    ],
    availablePoliceStations: [
      { en: 'Dalanwala Police Station', hi: 'डालनवाला थाना' }
    ]
  },
  '248003': {
    pinCode: '248003',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Dehradun Sadar',
    tehsilHi: 'देहरादून सदर',
    postOffice: 'Forest Research Institute (FRI) S.O',
    postOfficeHi: 'वन अनुसंधान संस्थान (FRI)',
    policeStation: 'Cantt Police Station',
    policeStationHi: 'कैंट थाना देहरादून'
  },
  '248006': {
    pinCode: '248006',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Dehradun Sadar',
    tehsilHi: 'देहरादून सदर',
    postOffice: 'Clement Town S.O',
    postOfficeHi: 'क्लेमेंटाउन उप डाकघर',
    policeStation: 'Clement Town Police Station',
    policeStationHi: 'क्लेमेंटाउन थाना'
  },
  '248007': {
    pinCode: '248007',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Dehradun Sadar',
    tehsilHi: 'देहरादून सदर',
    postOffice: 'Prem Nagar S.O',
    postOfficeHi: 'प्रेमनगर उप डाकघर',
    policeStation: 'Prem Nagar Police Station',
    policeStationHi: 'प्रेमनगर थाना'
  },
  '248008': {
    pinCode: '248008',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Dehradun Sadar',
    tehsilHi: 'देहरादून सदर',
    postOffice: 'Raipur S.O',
    postOfficeHi: 'रायपुर उप डाकघर',
    policeStation: 'Raipur Police Station',
    policeStationHi: 'रायपुर थाना'
  },
  '248009': {
    pinCode: '248009',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Dehradun Sadar',
    tehsilHi: 'देहरादून सदर',
    postOffice: 'Rajpur S.O',
    postOfficeHi: 'राजपुर उप डाकघर',
    policeStation: 'Rajpur Police Station',
    policeStationHi: 'राजपुर थाना'
  },
  '248197': {
    pinCode: '248197',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Vikasnagar',
    tehsilHi: 'विकासनगर',
    postOffice: 'Vikasnagar S.O',
    postOfficeHi: 'विकासनगर उप डाकघर',
    policeStation: 'Vikasnagar Police Station',
    policeStationHi: 'विकासनगर कोतवाली'
  },
  '248198': {
    pinCode: '248198',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Vikasnagar',
    tehsilHi: 'विकासनगर',
    postOffice: 'Dakpathar S.O',
    postOfficeHi: 'डाकपत्थर उप डाकघर',
    policeStation: 'Dakpathar Police Station',
    policeStationHi: 'डाकपत्थर थाना'
  },
  '248140': {
    pinCode: '248140',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Rishikesh',
    tehsilHi: 'ऋषिकेश',
    postOffice: 'Rishikesh S.O',
    postOfficeHi: 'ऋषिकेश मुख्य डाकघर',
    policeStation: 'Kotwali Rishikesh',
    policeStationHi: 'कोतवाली ऋषिकेश'
  },
  '248142': {
    pinCode: '248142',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Doiwala',
    tehsilHi: 'डोईवाला',
    postOffice: 'Doiwala S.O',
    postOfficeHi: 'डोईवाला उप डाकघर',
    policeStation: 'Doiwala Police Station',
    policeStationHi: 'डोईवाला कोतवाली'
  },
  '248171': {
    pinCode: '248171',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Mussoorie',
    tehsilHi: 'मसूरी',
    postOffice: 'Mussoorie H.O',
    postOfficeHi: 'मसूरी मुख्य डाकघर',
    policeStation: 'Mussoorie Police Station',
    policeStationHi: 'मसूरी कोतवाली'
  },
  '248123': {
    pinCode: '248123',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Kalsi',
    tehsilHi: 'कालसी',
    postOffice: 'Kalsi S.O',
    postOfficeHi: 'कालसी उप डाकघर',
    policeStation: 'Kalsi Police Station',
    policeStationHi: 'कालसी थाना'
  },
  '248158': {
    pinCode: '248158',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Chakrata',
    tehsilHi: 'चकराता',
    postOffice: 'Chakrata S.O',
    postOfficeHi: 'चकराता उप डाकघर',
    policeStation: 'Chakrata Police Station',
    policeStationHi: 'चकराता थाना'
  },
  '248196': {
    pinCode: '248196',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Dehradun',
    districtHi: 'देहरादून',
    tehsil: 'Tyuni',
    tehsilHi: 'त्यूणी',
    postOffice: 'Tyuni S.O',
    postOfficeHi: 'त्यूणी उप डाकघर',
    policeStation: 'Tyuni Police Station',
    policeStationHi: 'त्यूणी थाना'
  },

  // === HARIDWAR DISTRICT ===
  '249401': {
    pinCode: '249401',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Haridwar Sadar',
    tehsilHi: 'हरिद्वार सदर',
    postOffice: 'Haridwar H.O',
    postOfficeHi: 'हरिद्वार मुख्य डाकघर',
    policeStation: 'Kotwali City Haridwar',
    policeStationHi: 'नगर कोतवाली हरिद्वार'
  },
  '249402': {
    pinCode: '249402',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Haridwar Sadar',
    tehsilHi: 'हरिद्वार सदर',
    postOffice: 'BHEL Ranipur S.O',
    postOfficeHi: 'भेल रानीपुर उप डाकघर',
    policeStation: 'Ranipur Police Station',
    policeStationHi: 'रानीपुर कोतवाली'
  },
  '249403': {
    pinCode: '249403',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Haridwar Sadar',
    tehsilHi: 'हरिद्वार सदर',
    postOffice: 'Jwalapur S.O',
    postOfficeHi: 'ज्वालापुर उप डाकघर',
    policeStation: 'Jwalapur Police Station',
    policeStationHi: 'ज्वालापुर कोतवाली'
  },
  '249407': {
    pinCode: '249407',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Haridwar Sadar',
    tehsilHi: 'हरिद्वार सदर',
    postOffice: 'Kankhal S.O',
    postOfficeHi: 'कनखल उप डाकघर',
    policeStation: 'Kankhal Police Station',
    policeStationHi: 'कनखल थाना'
  },
  '249408': {
    pinCode: '249408',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Haridwar Sadar',
    tehsilHi: 'हरिद्वार सदर',
    postOffice: 'Shivalik Nagar S.O',
    postOfficeHi: 'शिवालिक नगर उप डाकघर',
    policeStation: 'Ranipur Police Station',
    policeStationHi: 'रानीपुर थाना'
  },
  '247667': {
    pinCode: '247667',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Roorkee',
    tehsilHi: 'रुड़की',
    postOffice: 'Roorkee H.O',
    postOfficeHi: 'रुड़की मुख्य डाकघर',
    policeStation: 'Gangnahar Roorkee',
    policeStationHi: 'गंगनहर कोतवाली रुड़की'
  },
  '247668': {
    pinCode: '247668',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Roorkee',
    tehsilHi: 'रुड़की',
    postOffice: 'IIT Roorkee S.O',
    postOfficeHi: 'आईआईटी रुड़की उप डाकघर',
    policeStation: 'Civil Lines Roorkee',
    policeStationHi: 'सिविल लाइंस रुड़की कोतवाली'
  },
  '247663': {
    pinCode: '247663',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Bhagwanpur',
    tehsilHi: 'भगवानपुर',
    postOffice: 'Bhagwanpur S.O',
    postOfficeHi: 'भगवानपुर उप डाकघर',
    policeStation: 'Bhagwanpur Police Station',
    policeStationHi: 'भगवानपुर थाना'
  },
  '247656': {
    pinCode: '247656',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Laksar',
    tehsilHi: 'लक्सर',
    postOffice: 'Laksar S.O',
    postOfficeHi: 'लक्सर उप डाकघर',
    policeStation: 'Laksar Police Station',
    policeStationHi: 'लक्सर कोतवाली'
  },
  '247671': {
    pinCode: '247671',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Haridwar',
    districtHi: 'हरिद्वार',
    tehsil: 'Roorkee',
    tehsilHi: 'रुड़की',
    postOffice: 'Manglaur S.O',
    postOfficeHi: 'मंगलौर उप डाकघर',
    policeStation: 'Manglaur Police Station',
    policeStationHi: 'मंगलौर कोतवाली'
  },

  // === NAINITAL DISTRICT ===
  '263001': {
    pinCode: '263001',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Nainital Sadar',
    tehsilHi: 'नैनीताल सदर',
    postOffice: 'Nainital H.O (Mallital)',
    postOfficeHi: 'नैनीताल मुख्य डाकघर (मल्लीताल)',
    policeStation: 'Mallital Police Station',
    policeStationHi: 'मल्लीताल कोतवाली नैनीताल'
  },
  '263002': {
    pinCode: '263002',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Nainital Sadar',
    tehsilHi: 'नैनीताल सदर',
    postOffice: 'Tallital S.O',
    postOfficeHi: 'तल्लीताल उप डाकघर',
    policeStation: 'Tallital Police Station',
    policeStationHi: 'तल्लीताल थाना'
  },
  '263139': {
    pinCode: '263139',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Haldwani',
    tehsilHi: 'हल्द्वानी',
    postOffice: 'Haldwani H.O',
    postOfficeHi: 'हल्द्वानी मुख्य डाकघर',
    policeStation: 'Kotwali Haldwani',
    policeStationHi: 'कोतवाली हल्द्वानी'
  },
  '263136': {
    pinCode: '263136',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Haldwani',
    tehsilHi: 'हल्द्वानी',
    postOffice: 'Kathgodam S.O',
    postOfficeHi: 'काठगोदाम उप डाकघर',
    policeStation: 'Kathgodam Police Station',
    policeStationHi: 'काठगोदाम थाना'
  },
  '263126': {
    pinCode: '263126',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Ramnagar',
    tehsilHi: 'रामनगर',
    postOffice: 'Ramnagar S.O',
    postOfficeHi: 'रामनगर उप डाकघर',
    policeStation: 'Ramnagar Police Station',
    policeStationHi: 'रामनगर कोतवाली'
  },
  '263132': {
    pinCode: '263132',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Kaladhungi',
    tehsilHi: 'कालाढूंगी',
    postOffice: 'Kaladhungi S.O',
    postOfficeHi: 'कालाढूंगी उप डाकघर',
    policeStation: 'Kaladhungi Police Station',
    policeStationHi: 'कालाढूंगी थाना'
  },
  '263138': {
    pinCode: '263138',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Lalkuan',
    tehsilHi: 'लालकुआँ',
    postOffice: 'Lalkuan S.O',
    postOfficeHi: 'लालकुआँ उप डाकघर',
    policeStation: 'Lalkuan Police Station',
    policeStationHi: 'लालकुआँ कोतवाली'
  },
  '263156': {
    pinCode: '263156',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Dhari',
    tehsilHi: 'धारी',
    postOffice: 'Bhowali S.O',
    postOfficeHi: 'भवाली उप डाकघर',
    policeStation: 'Bhowali Police Station',
    policeStationHi: 'भवाली थाना'
  },
  '263137': {
    pinCode: '263137',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Nainital Sadar',
    tehsilHi: 'नैनीताल सदर',
    postOffice: 'Bhimtal S.O',
    postOfficeHi: 'भीमताल उप डाकघर',
    policeStation: 'Bhimtal Police Station',
    policeStationHi: 'भीमताल थाना'
  },
  '263135': {
    pinCode: '263135',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Nainital',
    districtHi: 'नैनीताल',
    tehsil: 'Dhari',
    tehsilHi: 'धारी',
    postOffice: 'Mukteshwar S.O',
    postOfficeHi: 'मुक्तेश्वर उप डाकघर',
    policeStation: 'Mukteshwar Police Station',
    policeStationHi: 'मुक्तेश्वर थाना'
  },

  // === ALMORA DISTRICT ===
  '263601': {
    pinCode: '263601',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Almora',
    districtHi: 'अल्मोड़ा',
    tehsil: 'Almora Sadar',
    tehsilHi: 'अल्मोड़ा सदर',
    postOffice: 'Almora H.O',
    postOfficeHi: 'अल्मोड़ा मुख्य डाकघर',
    policeStation: 'Kotwali Almora',
    policeStationHi: 'कोतवाली अल्मोड़ा'
  },
  '263645': {
    pinCode: '263645',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Almora',
    districtHi: 'अल्मोड़ा',
    tehsil: 'Ranikhet',
    tehsilHi: 'रानीखेत',
    postOffice: 'Ranikhet H.O',
    postOfficeHi: 'रानीखेत मुख्य डाकघर',
    policeStation: 'Ranikhet Police Station',
    policeStationHi: 'रानीखेत कोतवाली'
  },
  '263646': {
    pinCode: '263646',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Almora',
    districtHi: 'अल्मोड़ा',
    tehsil: 'Dwarahat',
    tehsilHi: 'द्वाराहाट',
    postOffice: 'Dwarahat S.O',
    postOfficeHi: 'द्वाराहाट उप डाकघर',
    policeStation: 'Dwarahat Police Station',
    policeStationHi: 'द्वाराहाट थाना'
  },
  '263656': {
    pinCode: '263656',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Almora',
    districtHi: 'अल्मोड़ा',
    tehsil: 'Chaukhutiya',
    tehsilHi: 'चौखुटिया',
    postOffice: 'Chaukhutiya S.O',
    postOfficeHi: 'चौखुटिया उप डाकघर',
    policeStation: 'Chaukhutiya Police Station',
    policeStationHi: 'चौखुटिया थाना'
  },
  '263628': {
    pinCode: '263628',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Almora',
    districtHi: 'अल्मोड़ा',
    tehsil: 'Someshwar',
    tehsilHi: 'सोमेश्वर',
    postOffice: 'Someshwar S.O',
    postOfficeHi: 'सोमेश्वर उप डाकघर',
    policeStation: 'Someshwar Police Station',
    policeStationHi: 'सोमेश्वर थाना'
  },
  '263658': {
    pinCode: '263658',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Almora',
    districtHi: 'अल्मोड़ा',
    tehsil: 'Bhikiyasain',
    tehsilHi: 'भिकियासैंण',
    postOffice: 'Bhikiyasain S.O',
    postOfficeHi: 'भिकियासैंण उप डाकघर',
    policeStation: 'Bhikiyasain Police Station',
    policeStationHi: 'भिकियासैंण थाना'
  },
  '263680': {
    pinCode: '263680',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Almora',
    districtHi: 'अल्मोड़ा',
    tehsil: 'Bhikiyasain',
    tehsilHi: 'भिकियासैंण',
    postOffice: 'Chaunallia S.O (Talya)',
    postOfficeHi: 'चौनालिया उप डाकघर (तल्या)',
    policeStation: 'Bhikiyasain Police Station',
    policeStationHi: 'भिकियासैंण थाना'
  },

  // === PAURI GARHWAL DISTRICT ===
  '246001': {
    pinCode: '246001',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pauri Garhwal',
    districtHi: 'पौड़ी गढ़वाल',
    tehsil: 'Pauri Sadar',
    tehsilHi: 'पौड़ी सदर',
    postOffice: 'Pauri H.O',
    postOfficeHi: 'पौड़ी मुख्य डाकघर',
    policeStation: 'Kotwali Pauri',
    policeStationHi: 'कोतवाली पौड़ी'
  },
  '246149': {
    pinCode: '246149',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pauri Garhwal',
    districtHi: 'पौड़ी गढ़वाल',
    tehsil: 'Kotdwar',
    tehsilHi: 'कोटद्वार',
    postOffice: 'Kotdwar H.O',
    postOfficeHi: 'कोटद्वार मुख्य डाकघर',
    policeStation: 'Kotwali Kotdwar',
    policeStationHi: 'कोतवाली कोटद्वार'
  },
  '246173': {
    pinCode: '246173',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pauri Garhwal',
    districtHi: 'पौड़ी गढ़वाल',
    tehsil: 'Srinagar',
    tehsilHi: 'श्रीनगर',
    postOffice: 'Srinagar Garhwal S.O',
    postOfficeHi: 'श्रीनगर गढ़वाल मुख्य डाकघर',
    policeStation: 'Kotwali Srinagar',
    policeStationHi: 'कोतवाली श्रीनगर गढ़वाल'
  },
  '246128': {
    pinCode: '246128',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pauri Garhwal',
    districtHi: 'पौड़ी गढ़वाल',
    tehsil: 'Lansdowne',
    tehsilHi: 'लैंसडाउन',
    postOffice: 'Lansdowne S.O',
    postOfficeHi: 'लैंसडाउन उप डाकघर',
    policeStation: 'Lansdowne Police Station',
    policeStationHi: 'लैंसडाउन कोतवाली'
  },
  '246172': {
    pinCode: '246172',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pauri Garhwal',
    districtHi: 'पौड़ी गढ़वाल',
    tehsil: 'Satpuli',
    tehsilHi: 'सतपुली',
    postOffice: 'Satpuli S.O',
    postOfficeHi: 'सतपुली उप डाकघर',
    policeStation: 'Satpuli Police Station',
    policeStationHi: 'सतपुली थाना'
  },
  '246176': {
    pinCode: '246176',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pauri Garhwal',
    districtHi: 'पौड़ी गढ़वाल',
    tehsil: 'Thalisain',
    tehsilHi: 'थलीसैंण',
    postOffice: 'Thalisain S.O',
    postOfficeHi: 'थलीसैंण उप डाकघर',
    policeStation: 'Thalisain Police Station',
    policeStationHi: 'थलीसैंण थाना'
  },

  // === TEHRI GARHWAL DISTRICT ===
  '249001': {
    pinCode: '249001',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Tehri Garhwal',
    districtHi: 'टिहरी गढ़वाल',
    tehsil: 'Tehri Sadar',
    tehsilHi: 'टिहरी सदर',
    postOffice: 'New Tehri H.O',
    postOfficeHi: 'नई टिहरी मुख्य डाकघर',
    policeStation: 'New Tehri Police Station',
    policeStationHi: 'नई टिहरी कोतवाली'
  },
  '249199': {
    pinCode: '249199',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Tehri Garhwal',
    districtHi: 'टिहरी गढ़वाल',
    tehsil: 'Tehri Sadar',
    tehsilHi: 'टिहरी सदर',
    postOffice: 'Chamba S.O',
    postOfficeHi: 'चंबा उप डाकघर',
    policeStation: 'Chamba Police Station',
    policeStationHi: 'चंबा थाना'
  },
  '249145': {
    pinCode: '249145',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Tehri Garhwal',
    districtHi: 'टिहरी गढ़वाल',
    tehsil: 'Ghansali',
    tehsilHi: 'घनसाली',
    postOffice: 'Ghansali S.O',
    postOfficeHi: 'घनसाली उप डाकघर',
    policeStation: 'Ghansali Police Station',
    policeStationHi: 'घनसाली थाना'
  },
  '249175': {
    pinCode: '249175',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Tehri Garhwal',
    districtHi: 'टिहरी गढ़वाल',
    tehsil: 'Narendranagar',
    tehsilHi: 'नरेंद्रनगर',
    postOffice: 'Narendranagar S.O',
    postOfficeHi: 'नरेंद्रनगर उप डाकघर',
    policeStation: 'Narendranagar Police Station',
    policeStationHi: 'नरेंद्रनगर थाना'
  },
  '249130': {
    pinCode: '249130',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Tehri Garhwal',
    districtHi: 'टिहरी गढ़वाल',
    tehsil: 'Devprayag',
    tehsilHi: 'देवप्रयाग',
    postOffice: 'Devprayag S.O',
    postOfficeHi: 'देवप्रयाग उप डाकघर',
    policeStation: 'Devprayag Police Station',
    policeStationHi: 'देवप्रयाग थाना'
  },
  '249192': {
    pinCode: '249192',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Tehri Garhwal',
    districtHi: 'टिहरी गढ़वाल',
    tehsil: 'Narendranagar',
    tehsilHi: 'नरेंद्रनगर',
    postOffice: 'Muni Ki Reti S.O',
    postOfficeHi: 'मुनि की रेती उप डाकघर',
    policeStation: 'Muni Ki Reti Police Station',
    policeStationHi: 'मुनि की रेती कोतवाली'
  },

  // === CHAMOLI DISTRICT ===
  '246401': {
    pinCode: '246401',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Chamoli',
    districtHi: 'चमोली',
    tehsil: 'Chamoli Sadar',
    tehsilHi: 'चमोली सदर',
    postOffice: 'Gopeshwar H.O',
    postOfficeHi: 'गोपेश्वर मुख्य डाकघर',
    policeStation: 'Kotwali Gopeshwar',
    policeStationHi: 'कोतवाली गोपेश्वर'
  },
  '246443': {
    pinCode: '246443',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Chamoli',
    districtHi: 'चमोली',
    tehsil: 'Joshimath',
    tehsilHi: 'जोशीमठ',
    postOffice: 'Joshimath S.O',
    postOfficeHi: 'जोशीमठ मुख्य डाकघर',
    policeStation: 'Joshimath Police Station',
    policeStationHi: 'जोशीमठ कोतवाली'
  },
  '246424': {
    pinCode: '246424',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Chamoli',
    districtHi: 'चमोली',
    tehsil: 'Karnaprayag',
    tehsilHi: 'कर्णप्रयाग',
    postOffice: 'Karnaprayag S.O',
    postOfficeHi: 'कर्णप्रयाग उप डाकघर',
    policeStation: 'Karnaprayag Police Station',
    policeStationHi: 'कर्णप्रयाग कोतवाली'
  },
  '246481': {
    pinCode: '246481',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Chamoli',
    districtHi: 'चमोली',
    tehsil: 'Tharali',
    tehsilHi: 'थराली',
    postOffice: 'Tharali S.O',
    postOfficeHi: 'थराली उप डाकघर',
    policeStation: 'Tharali Police Station',
    policeStationHi: 'थराली थाना'
  },
  '246442': {
    pinCode: '246442',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Chamoli',
    districtHi: 'चमोली',
    tehsil: 'Gairsain',
    tehsilHi: 'गैरसैंण',
    postOffice: 'Gairsain S.O',
    postOfficeHi: 'गैरसैंण उप डाकघर',
    policeStation: 'Gairsain Police Station',
    policeStationHi: 'गैरसैंण थाना'
  },

  // === RUDRAPRAYAG DISTRICT ===
  '246171': {
    pinCode: '246171',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Rudraprayag',
    districtHi: 'रुद्रप्रयाग',
    tehsil: 'Rudraprayag Sadar',
    tehsilHi: 'रुद्रप्रयाग सदर',
    postOffice: 'Rudraprayag H.O',
    postOfficeHi: 'रुद्रप्रयाग मुख्य डाकघर',
    policeStation: 'Kotwali Rudraprayag',
    policeStationHi: 'कोतवाली रुद्रप्रयाग'
  },
  '246475': {
    pinCode: '246475',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Rudraprayag',
    districtHi: 'रुद्रप्रयाग',
    tehsil: 'Ukhimath',
    tehsilHi: 'ऊखीमठ',
    postOffice: 'Ukhimath S.O',
    postOfficeHi: 'ऊखीमठ उप डाकघर',
    policeStation: 'Ukhimath Police Station',
    policeStationHi: 'ऊखीमठ थाना'
  },
  '246439': {
    pinCode: '246439',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Rudraprayag',
    districtHi: 'रुद्रप्रयाग',
    tehsil: 'Ukhimath',
    tehsilHi: 'ऊखीमठ',
    postOffice: 'Guptkashi S.O',
    postOfficeHi: 'गुप्तकाशी उप डाकघर',
    policeStation: 'Guptkashi Police Station',
    policeStationHi: 'गुप्तकाशी थाना'
  },
  '246449': {
    pinCode: '246449',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Rudraprayag',
    districtHi: 'रुद्रप्रयाग',
    tehsil: 'Rudraprayag Sadar',
    tehsilHi: 'रुद्रप्रयाग सदर',
    postOffice: 'Augustmuni S.O',
    postOfficeHi: 'अगस्त्यमुनि उप डाकघर',
    policeStation: 'Augustmuni Police Station',
    policeStationHi: 'अगस्त्यमुनि थाना'
  },

  // === UTTARKASHI DISTRICT ===
  '249193': {
    pinCode: '249193',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Uttarkashi',
    districtHi: 'उत्तरकाशी',
    tehsil: 'Bhatwari (Uttarkashi)',
    tehsilHi: 'भटवाड़ी (उत्तरकाशी)',
    postOffice: 'Uttarkashi H.O',
    postOfficeHi: 'उत्तरकाशी मुख्य डाकघर',
    policeStation: 'Kotwali Uttarkashi',
    policeStationHi: 'कोतवाली उत्तरकाशी'
  },
  '249141': {
    pinCode: '249141',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Uttarkashi',
    districtHi: 'उत्तरकाशी',
    tehsil: 'Barkot',
    tehsilHi: 'बड़कोट',
    postOffice: 'Barkot S.O',
    postOfficeHi: 'बड़कोट उप डाकघर',
    policeStation: 'Barkot Police Station',
    policeStationHi: 'बड़कोट थाना'
  },
  '249185': {
    pinCode: '249185',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Uttarkashi',
    districtHi: 'उत्तरकाशी',
    tehsil: 'Purola',
    tehsilHi: 'पुरोला',
    postOffice: 'Purola S.O',
    postOfficeHi: 'पुरोला उप डाकघर',
    policeStation: 'Purola Police Station',
    policeStationHi: 'पुरोला थाना'
  },
  '249152': {
    pinCode: '249152',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Uttarkashi',
    districtHi: 'उत्तरकाशी',
    tehsil: 'Chinyalisaur',
    tehsilHi: 'चिन्यालीसौड़',
    postOffice: 'Chinyalisaur S.O',
    postOfficeHi: 'चिन्यालीसौड़ उप डाकघर',
    policeStation: 'Dharasu Police Station',
    policeStationHi: 'धरासू थाना'
  },

  // === PITHORAGARH DISTRICT ===
  '262501': {
    pinCode: '262501',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pithoragarh',
    districtHi: 'पिथौरागढ़',
    tehsil: 'Pithoragarh Sadar',
    tehsilHi: 'पिथौरागढ़ सदर',
    postOffice: 'Pithoragarh H.O',
    postOfficeHi: 'पिथौरागढ़ मुख्य डाकघर',
    policeStation: 'Kotwali Pithoragarh',
    policeStationHi: 'कोतवाली पिथौरागढ़'
  },
  '262520': {
    pinCode: '262520',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pithoragarh',
    districtHi: 'पिथौरागढ़',
    tehsil: 'Dharchula',
    tehsilHi: 'धारचूला',
    postOffice: 'Dharchula S.O',
    postOfficeHi: 'धारचूला मुख्य डाकघर',
    policeStation: 'Dharchula Police Station',
    policeStationHi: 'धारचूला कोतवाली'
  },
  '262544': {
    pinCode: '262544',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pithoragarh',
    districtHi: 'पिथौरागढ़',
    tehsil: 'Didihat',
    tehsilHi: 'डीडीहाट',
    postOffice: 'Didihat S.O',
    postOfficeHi: 'डीडीहाट उप डाकघर',
    policeStation: 'Didihat Police Station',
    policeStationHi: 'डीडीहाट थाना'
  },
  '262551': {
    pinCode: '262551',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pithoragarh',
    districtHi: 'पिथौरागढ़',
    tehsil: 'Gangolihat',
    tehsilHi: 'गंगोलीहाट',
    postOffice: 'Gangolihat S.O',
    postOfficeHi: 'गंगोलीहाट उप डाकघर',
    policeStation: 'Gangolihat Police Station',
    policeStationHi: 'गंगोलीहाट थाना'
  },
  '262552': {
    pinCode: '262552',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pithoragarh',
    districtHi: 'पिथौरागढ़',
    tehsil: 'Berinag',
    tehsilHi: 'बेरीनाग',
    postOffice: 'Berinag S.O',
    postOfficeHi: 'बेरीनाग उप डाकघर',
    policeStation: 'Berinag Police Station',
    policeStationHi: 'बेरीनाग थाना'
  },
  '262553': {
    pinCode: '262553',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Pithoragarh',
    districtHi: 'पिथौरागढ़',
    tehsil: 'Munsiari',
    tehsilHi: 'मुनस्यारी',
    postOffice: 'Munsiari S.O',
    postOfficeHi: 'मुनस्यारी उप डाकघर',
    policeStation: 'Munsiari Police Station',
    policeStationHi: 'मुनस्यारी थाना'
  },

  // === CHAMPAWAT DISTRICT ===
  '262523': {
    pinCode: '262523',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Champawat',
    districtHi: 'चंपावत',
    tehsil: 'Champawat Sadar',
    tehsilHi: 'चंपावत सदर',
    postOffice: 'Champawat H.O',
    postOfficeHi: 'चंपावत मुख्य डाकघर',
    policeStation: 'Kotwali Champawat',
    policeStationHi: 'कोतवाली चंपावत'
  },
  '262524': {
    pinCode: '262524',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Champawat',
    districtHi: 'चंपावत',
    tehsil: 'Lohaghat',
    tehsilHi: 'लोहाघाट',
    postOffice: 'Lohaghat S.O',
    postOfficeHi: 'लोहाघाट उप डाकघर',
    policeStation: 'Lohaghat Police Station',
    policeStationHi: 'लोहाघाट थाना'
  },
  '262528': {
    pinCode: '262528',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Champawat',
    districtHi: 'चंपावत',
    tehsil: 'Poornagiri (Tanakpur)',
    tehsilHi: 'पूर्णागिरि (टनकपुर)',
    postOffice: 'Tanakpur S.O',
    postOfficeHi: 'टनकपुर उप डाकघर',
    policeStation: 'Kotwali Tanakpur',
    policeStationHi: 'कोतवाली टनकपुर'
  },
  '262580': {
    pinCode: '262580',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Champawat',
    districtHi: 'चंपावत',
    tehsil: 'Pati',
    tehsilHi: 'पाटी',
    postOffice: 'Pati S.O',
    postOfficeHi: 'पाटी उप डाकघर',
    policeStation: 'Pati Police Station',
    policeStationHi: 'पाटी थाना'
  },

  // === BAGESHWAR DISTRICT ===
  '263642': {
    pinCode: '263642',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Bageshwar',
    districtHi: 'बागेश्वर',
    tehsil: 'Bageshwar Sadar',
    tehsilHi: 'बागेश्वर सदर',
    postOffice: 'Bageshwar H.O',
    postOfficeHi: 'बागेश्वर मुख्य डाकघर',
    policeStation: 'Kotwali Bageshwar',
    policeStationHi: 'कोतवाली बागेश्वर'
  },
  '263630': {
    pinCode: '263630',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Bageshwar',
    districtHi: 'बागेश्वर',
    tehsil: 'Kapkot',
    tehsilHi: 'कपकोट',
    postOffice: 'Kapkot S.O',
    postOfficeHi: 'कपकोट उप डाकघर',
    policeStation: 'Kapkot Police Station',
    policeStationHi: 'कपकोट थाना'
  },
  '263641': {
    pinCode: '263641',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Bageshwar',
    districtHi: 'बागेश्वर',
    tehsil: 'Garur',
    tehsilHi: 'गरुड़',
    postOffice: 'Garur S.O',
    postOfficeHi: 'गरुड़ उप डाकघर',
    policeStation: 'Baijnath Police Station',
    policeStationHi: 'बैजनाथ थाना'
  },
  '263631': {
    pinCode: '263631',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Bageshwar',
    districtHi: 'बागेश्वर',
    tehsil: 'Kanda',
    tehsilHi: 'कांडा',
    postOffice: 'Kanda S.O',
    postOfficeHi: 'कांडा उप डाकघर',
    policeStation: 'Kanda Police Station',
    policeStationHi: 'कांडा थाना'
  },

  // === UDHAM SINGH NAGAR DISTRICT ===
  '263153': {
    pinCode: '263153',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Rudrapur',
    tehsilHi: 'रुद्रपुर',
    postOffice: 'Rudrapur H.O',
    postOfficeHi: 'रुद्रपुर मुख्य डाकघर',
    policeStation: 'Kotwali Rudrapur',
    policeStationHi: 'कोतवाली रुद्रपुर'
  },
  '244713': {
    pinCode: '244713',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Kashipur',
    tehsilHi: 'काशीपुर',
    postOffice: 'Kashipur H.O',
    postOfficeHi: 'काशीपुर मुख्य डाकघर',
    policeStation: 'Kotwali Kashipur',
    policeStationHi: 'कोतवाली काशीपुर'
  },
  '262308': {
    pinCode: '262308',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Khatima',
    tehsilHi: 'खटीमा',
    postOffice: 'Khatima S.O',
    postOfficeHi: 'खटीमा उप डाकघर',
    policeStation: 'Kotwali Khatima',
    policeStationHi: 'कोतवाली खटीमा'
  },
  '262405': {
    pinCode: '262405',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Sitarganj',
    tehsilHi: 'सितारगंज',
    postOffice: 'Sitarganj S.O',
    postOfficeHi: 'सितारगंज उप डाकघर',
    policeStation: 'Kotwali Sitarganj',
    policeStationHi: 'कोतवाली सितारगंज'
  },
  '262406': {
    pinCode: '262406',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Kichha',
    tehsilHi: 'किच्छा',
    postOffice: 'Kichha S.O',
    postOfficeHi: 'किच्छा उप डाकघर',
    policeStation: 'Kotwali Kichha',
    policeStationHi: 'कोतवाली किच्छा'
  },
  '262401': {
    pinCode: '262401',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Bajpur',
    tehsilHi: 'बाजपुर',
    postOffice: 'Bajpur S.O',
    postOfficeHi: 'बाजपुर उप डाकघर',
    policeStation: 'Kotwali Bajpur',
    policeStationHi: 'कोतवाली बाजपुर'
  },
  '263152': {
    pinCode: '263152',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Gadarpur',
    tehsilHi: 'गदरपुर',
    postOffice: 'Gadarpur S.O',
    postOfficeHi: 'गदरपुर उप डाकघर',
    policeStation: 'Gadarpur Police Station',
    policeStationHi: 'गदरपुर थाना'
  },
  '244712': {
    pinCode: '244712',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Jaspur',
    tehsilHi: 'जसपुर',
    postOffice: 'Jaspur S.O',
    postOfficeHi: 'जसपुर उप डाकघर',
    policeStation: 'Kotwali Jaspur',
    policeStationHi: 'कोतवाली जसपुर'
  },
  '263148': {
    pinCode: '263148',
    state: 'Uttarakhand',
    stateHi: 'उत्तराखंड',
    district: 'Udham Singh Nagar',
    districtHi: 'उधम सिंह नगर',
    tehsil: 'Kichha',
    tehsilHi: 'किच्छा',
    postOffice: 'Pantnagar S.O',
    postOfficeHi: 'पंतनगर उप डाकघर',
    policeStation: 'Pantnagar Police Station',
    policeStationHi: 'पंतनगर थाना'
  }
};

// Common Indian State Dictionary
export const INDIAN_STATES_DICTIONARY: Record<string, { en: string; hi: string }> = {
  'uttarakhand': { en: 'Uttarakhand', hi: 'उत्तराखंड' },
  'uttar pradesh': { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' },
  'delhi': { en: 'Delhi', hi: 'दिल्ली' },
  'himachal pradesh': { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश' },
  'punjab': { en: 'Punjab', hi: 'पंजाब' },
  'haryana': { en: 'Haryana', hi: 'हरियाणा' },
  'rajasthan': { en: 'Rajasthan', hi: 'राजस्थान' },
  'bihar': { en: 'Bihar', hi: 'बिहार' },
  'madhya pradesh': { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश' },
  'maharashtra': { en: 'Maharashtra', hi: 'महाराष्ट्र' },
  'gujarat': { en: 'Gujarat', hi: 'गुजरात' },
  'west bengal': { en: 'West Bengal', hi: 'पश्चिम बंगाल' },
  'karnataka': { en: 'Karnataka', hi: 'कर्नाटक' },
  'tamil nadu': { en: 'Tamil Nadu', hi: 'तमिलनाडु' },
  'kerala': { en: 'Kerala', hi: 'केरल' },
  'andhra pradesh': { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' },
  'telangana': { en: 'Telangana', hi: 'तेलंगाना' },
  'odisha': { en: 'Odisha', hi: 'ओडिशा' },
  'jharkhand': { en: 'Jharkhand', hi: 'झारखंड' },
  'chhattisgarh': { en: 'Chhattisgarh', hi: 'छत्तीसगढ़' },
  'assam': { en: 'Assam', hi: 'असम' },
  'jammu and kashmir': { en: 'Jammu and Kashmir', hi: 'जम्मू और कश्मीर' },
  'chandigarh': { en: 'Chandigarh', hi: 'चंडीगढ़' }
};

/**
 * Synchronous lookup from curated local PIN database
 */
export function lookupPincodeSync(pincode: string): PincodeLookupResult | null {
  const cleanPin = pincode.replace(/\D/g, '').trim();
  if (cleanPin.length !== 6) return null;

  if (UTTARAKHAND_PINCODE_DATABASE[cleanPin]) {
    return UTTARAKHAND_PINCODE_DATABASE[cleanPin];
  }

  return null;
}

/**
 * Asynchronous lookup: checks local database first, then falls back to India Postal API
 */
export async function lookupPincode(pincode: string): Promise<PincodeLookupResult | null> {
  const cleanPin = pincode.replace(/\D/g, '').trim();
  if (cleanPin.length !== 6) return null;

  // 1. Check local high-speed database
  const localMatch = lookupPincodeSync(cleanPin);
  if (localMatch) {
    return localMatch;
  }

  // 2. Query India Postal PIN Code API
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
      const poList = data[0].PostOffice;
      const primaryPo = poList[0];

      const stateRaw = primaryPo.State || 'Uttarakhand';
      const districtRaw = primaryPo.District || 'Dehradun';
      const tehsilRaw = primaryPo.Taluk || primaryPo.Block || districtRaw;
      const poName = `${primaryPo.Name} ${primaryPo.BranchType === 'Head Post Office' ? 'H.O' : 'S.O'}`;

      const stateObj = INDIAN_STATES_DICTIONARY[stateRaw.toLowerCase()] || {
        en: stateRaw,
        hi: stateRaw
      };

      const result: PincodeLookupResult = {
        pinCode: cleanPin,
        state: stateObj.en,
        stateHi: stateObj.hi,
        district: districtRaw,
        districtHi: districtRaw,
        tehsil: tehsilRaw,
        tehsilHi: tehsilRaw,
        postOffice: poName,
        postOfficeHi: poName,
        policeStation: `${districtRaw} Police Station`,
        policeStationHi: `${districtRaw} थाना`,
        availablePostOffices: poList.map((po: any) => ({
          en: `${po.Name} (${po.BranchType})`,
          hi: `${po.Name} डाकघर`
        }))
      };

      return result;
    }
  } catch (err) {
    console.warn('Postal API lookup fallback failed:', err);
  }

  return null;
}
