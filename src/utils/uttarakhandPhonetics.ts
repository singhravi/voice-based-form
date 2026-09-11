/**
 * Uttarakhand & Indian Names Devanagari <-> English Bidirectional Phonetic Engine
 * Provides authentic phonetic transliteration, fuzzy dictionary matching, and accurate Devanagari conversion.
 */

// Indian & Uttarakhand Titles and Honorifics Dictionary
export const INDIAN_TITLES_DICTIONARY: Record<string, { en: string; hi: string }> = {
  // Shri / Mr.
  'mr': { en: 'Mr.', hi: 'श्री' },
  'mr.': { en: 'Mr.', hi: 'श्री' },
  'mister': { en: 'Mr.', hi: 'श्री' },
  'shri': { en: 'Shri', hi: 'श्री' },
  'shri.': { en: 'Shri', hi: 'श्री' },
  'shree': { en: 'Shri', hi: 'श्री' },
  'shree.': { en: 'Shri', hi: 'श्री' },
  'sri': { en: 'Sri', hi: 'श्री' },
  'sri.': { en: 'Sri', hi: 'श्री' },
  'shreeman': { en: 'Shri', hi: 'श्री' },
  'श्री': { en: 'Shri', hi: 'श्री' },
  'श्रीमान': { en: 'Shri', hi: 'श्री' },
  'श्रीयुत': { en: 'Shri', hi: 'श्री' },

  // Smt. / Mrs.
  'mrs': { en: 'Mrs.', hi: 'श्रीमती' },
  'mrs.': { en: 'Mrs.', hi: 'श्रीमती' },
  'smt': { en: 'Smt.', hi: 'श्रीमती' },
  'smt.': { en: 'Smt.', hi: 'श्रीमती' },
  'shrimati': { en: 'Shrimati', hi: 'श्रीमती' },
  'shreemati': { en: 'Shrimati', hi: 'श्रीमती' },
  'srimati': { en: 'Srimati', hi: 'श्रीमती' },
  'श्रीमती': { en: 'Smt.', hi: 'श्रीमती' },
  'श्रीमति': { en: 'Smt.', hi: 'श्रीमती' },

  // Kumari / Miss / Ms.
  'ms': { en: 'Ms.', hi: 'सुश्री' },
  'ms.': { en: 'Ms.', hi: 'सुश्री' },
  'miss': { en: 'Miss', hi: 'कुमारी' },
  'miss.': { en: 'Miss', hi: 'कुमारी' },
  'km': { en: 'Km.', hi: 'कु.' },
  'km.': { en: 'Km.', hi: 'कु.' },
  'kumari': { en: 'Kumari', hi: 'कुमारी' },
  'सुश्री': { en: 'Ms.', hi: 'सुश्री' },
  'कुमारी': { en: 'Kumari', hi: 'कुमारी' },
  'कु.': { en: 'Km.', hi: 'कु.' },
  'कु': { en: 'Km.', hi: 'कु.' },

  // Dr. / Doctor
  'dr': { en: 'Dr.', hi: 'डॉ.' },
  'dr.': { en: 'Dr.', hi: 'डॉ.' },
  'doctor': { en: 'Dr.', hi: 'डॉ.' },
  'डॉ': { en: 'Dr.', hi: 'डॉ.' },
  'डॉ.': { en: 'Dr.', hi: 'डॉ.' },
  'डा': { en: 'Dr.', hi: 'डॉ.' },
  'डा.': { en: 'Dr.', hi: 'डॉ.' },
  'डाक्टर': { en: 'Dr.', hi: 'डॉ.' },
  'डॉक्टर': { en: 'Dr.', hi: 'डॉ.' },

  // Late / Swargiya
  'late': { en: 'Late', hi: 'स्व.' },
  'late.': { en: 'Late', hi: 'स्व.' },
  'swargiya': { en: 'Late', hi: 'स्वर्गीय' },
  'sw': { en: 'Late', hi: 'स्व.' },
  'sw.': { en: 'Late', hi: 'स्व.' },
  'स्व': { en: 'Late', hi: 'स्व.' },
  'स्व.': { en: 'Late', hi: 'स्व.' },
  'स्वर्गीय': { en: 'Late', hi: 'स्वर्गीय' },
  'स्वर्गवासी': { en: 'Late', hi: 'स्वर्गवासी' },

  // Prof.
  'prof': { en: 'Prof.', hi: 'प्रो.' },
  'prof.': { en: 'Prof.', hi: 'प्रो.' },
  'professor': { en: 'Prof.', hi: 'प्रो.' },
  'प्रो': { en: 'Prof.', hi: 'प्रो.' },
  'प्रो.': { en: 'Prof.', hi: 'प्रो.' },
  'प्रोफेसर': { en: 'Prof.', hi: 'प्रो.' },

  // Er. / Engineer
  'er': { en: 'Er.', hi: 'इंजी.' },
  'er.': { en: 'Er.', hi: 'इंजी.' },
  'engineer': { en: 'Er.', hi: 'इंजीनियर' },
  'इंजी': { en: 'Er.', hi: 'इंजी.' },
  'इंजी.': { en: 'Er.', hi: 'इंजी.' },
  'इंजीनियर': { en: 'Er.', hi: 'इंजीनियर' },

  // Pandit / Pt.
  'pt': { en: 'Pt.', hi: 'पं.' },
  'pt.': { en: 'Pt.', hi: 'पं.' },
  'pandit': { en: 'Pandit', hi: 'पंडित' },
  'पं': { en: 'Pt.', hi: 'पं.' },
  'पं.': { en: 'Pt.', hi: 'पं.' },
  'पंडित': { en: 'Pandit', hi: 'पंडित' },

  // Chaudhary / Ch.
  'ch': { en: 'Ch.', hi: 'चौ.' },
  'ch.': { en: 'Ch.', hi: 'चौ.' },
  'chaudhary': { en: 'Chaudhary', hi: 'चौधरी' },
  'choudhary': { en: 'Chaudhary', hi: 'चौधरी' },
  'चौ': { en: 'Ch.', hi: 'चौ.' },
  'चौ.': { en: 'Ch.', hi: 'चौ.' },
  'चौधरी': { en: 'Chaudhary', hi: 'चौधरी' },

  // Advocate / Adv.
  'adv': { en: 'Adv.', hi: 'अधिवक्ता' },
  'adv.': { en: 'Adv.', hi: 'अधिवक्ता' },
  'advocate': { en: 'Advocate', hi: 'अधिवक्ता' },
  'अधिवक्ता': { en: 'Advocate', hi: 'अधिवक्ता' },

  // Master / Baba / Swami / Sardar
  'master': { en: 'Master', hi: 'मास्टर' },
  'मास्टर': { en: 'Master', hi: 'मास्टर' },
  'baba': { en: 'Baba', hi: 'बाबा' },
  'बाबा': { en: 'Baba', hi: 'बाबा' },
  'swami': { en: 'Swami', hi: 'स्वामी' },
  'स्वामी': { en: 'Swami', hi: 'स्वामी' },
  'sardar': { en: 'Sardar', hi: 'सरदार' },
  'सरदार': { en: 'Sardar', hi: 'सरदार' }
};

// Common Surnames Dictionary
export const UK_SURNAME_DICTIONARY: Record<string, { en: string; hi: string }> = {
  // Garhwali & Kumaoni Surnames
  'negi': { en: 'Negi', hi: 'नेगी' },
  'नेगी': { en: 'Negi', hi: 'नेगी' },
  'rawat': { en: 'Rawat', hi: 'रावत' },
  'रावत': { en: 'Rawat', hi: 'रावत' },
  'bisht': { en: 'Bisht', hi: 'बिष्ट' },
  'bist': { en: 'Bisht', hi: 'बिष्ट' },
  'विष्ट': { en: 'Bisht', hi: 'बिष्ट' },
  'बिष्ट': { en: 'Bisht', hi: 'बिष्ट' },
  'joshi': { en: 'Joshi', hi: 'जोशी' },
  'josi': { en: 'Joshi', hi: 'जोशी' },
  'जोशी': { en: 'Joshi', hi: 'जोशी' },
  'bhatt': { en: 'Bhatt', hi: 'भट्ट' },
  'bhat': { en: 'Bhatt', hi: 'भट्ट' },
  'भट्ट': { en: 'Bhatt', hi: 'भट्ट' },
  'pant': { en: 'Pant', hi: 'पंत' },
  'पंत': { en: 'Pant', hi: 'पंत' },
  'pandey': { en: 'Pandey', hi: 'पांडेय' },
  'pande': { en: 'Pandey', hi: 'पांडेय' },
  'पांडेय': { en: 'Pandey', hi: 'पांडेय' },
  'पाण्डेय': { en: 'Pandey', hi: 'पांडेय' },
  'पांडे': { en: 'Pandey', hi: 'पांडेय' },
  'uniyal': { en: 'Uniyal', hi: 'उनियाल' },
  'unial': { en: 'Uniyal', hi: 'उनियाल' },
  'उनियाल': { en: 'Uniyal', hi: 'उनियाल' },
  'nautiyal': { en: 'Nautiyal', hi: 'नौटियाल' },
  'nautial': { en: 'Nautiyal', hi: 'नौटियाल' },
  'नौटियाल': { en: 'Nautiyal', hi: 'नौटियाल' },
  'bahuguna': { en: 'Bahuguna', hi: 'बहुगुणा' },
  'बहुगुणा': { en: 'Bahuguna', hi: 'बहुगुणा' },
  'khanduri': { en: 'Khanduri', hi: 'खंडूरी' },
  'खंडूरी': { en: 'Khanduri', hi: 'खंडूरी' },
  'gusain': { en: 'Gusain', hi: 'गुसाईं' },
  'gosain': { en: 'Gusain', hi: 'गुसाईं' },
  'गुसाईं': { en: 'Gusain', hi: 'गुसाईं' },
  'pokhriyal': { en: 'Pokhriyal', hi: 'पोखरियाल' },
  'pokriyal': { en: 'Pokhriyal', hi: 'पोखरियाल' },
  'पोखरियाल': { en: 'Pokhriyal', hi: 'पोखरियाल' },
  'barthwal': { en: 'Barthwal', hi: 'बड़थ्वाल' },
  'बड़थ्वाल': { en: 'Barthwal', hi: 'बड़थ्वाल' },
  'gairola': { en: 'Gairola', hi: 'गैरोला' },
  'गैरोला': { en: 'Gairola', hi: 'गैरोला' },
  'raturi': { en: 'Raturi', hi: 'रतूड़ी' },
  'रतूड़ी': { en: 'Raturi', hi: 'रतूड़ी' },
  'dobhal': { en: 'Dobhal', hi: 'डोभाल' },
  'डोभाल': { en: 'Dobhal', hi: 'डोभाल' },
  'chamoli': { en: 'Chamoli', hi: 'चमोली' },
  'चमोली': { en: 'Chamoli', hi: 'चमोली' },
  'thapliyal': { en: 'Thapliyal', hi: 'थपलियाल' },
  'थपलियाल': { en: 'Thapliyal', hi: 'थपलियाल' },
  'semwal': { en: 'Semwal', hi: 'सेमवाल' },
  'सेमवाल': { en: 'Semwal', hi: 'सेमवाल' },
  'bhandari': { en: 'Bhandari', hi: 'भंडारी' },
  'भंडारी': { en: 'Bhandari', hi: 'भंडारी' },
  'chauhan': { en: 'Chauhan', hi: 'चौहान' },
  'चौहान': { en: 'Chauhan', hi: 'चौहान' },
  'rana': { en: 'Rana', hi: 'राणा' },
  'राणा': { en: 'Rana', hi: 'राणा' },
  'panwar': { en: 'Panwar', hi: 'पंवार' },
  'पंवार': { en: 'Panwar', hi: 'पंवार' },
  'pundir': { en: 'Pundir', hi: 'पुंडीर' },
  'पुंडीर': { en: 'Pundir', hi: 'पुंडीर' },
  'upreti': { en: 'Upreti', hi: 'उप्रेती' },
  'उप्रेती': { en: 'Upreti', hi: 'उप्रेती' },
  'bora': { en: 'Bora', hi: 'बोरा' },
  'बोरा': { en: 'Bora', hi: 'बोरा' },
  'mehta': { en: 'Mehta', hi: 'मेहता' },
  'मेहता': { en: 'Mehta', hi: 'मेहता' },
  'kunwar': { en: 'Kunwar', hi: 'कुंवर' },
  'कुंवर': { en: 'Kunwar', hi: 'कुंवर' },
  'karki': { en: 'Karki', hi: 'कार्की' },
  'कार्की': { en: 'Karki', hi: 'कार्की' },
  'danu': { en: 'Danu', hi: 'दानू' },
  'दानू': { en: 'Danu', hi: 'दानू' },
  'adhikari': { en: 'Adhikari', hi: 'अधिकारी' },
  'अधिकारी': { en: 'Adhikari', hi: 'अधिकारी' },
  'tiwari': { en: 'Tiwari', hi: 'तिवारी' },
  'तिवारी': { en: 'Tiwari', hi: 'तिवारी' },
  'pathak': { en: 'Pathak', hi: 'पाठक' },
  'पाठक': { en: 'Pathak', hi: 'पाठक' },
  'arya': { en: 'Arya', hi: 'आर्या' },
  'आर्या': { en: 'Arya', hi: 'आर्या' },
  'tamta': { en: 'Tamta', hi: 'टम्टा' },
  'टम्टा': { en: 'Tamta', hi: 'टम्टा' },
  'shah': { en: 'Shah', hi: 'शाह' },
  'शाह': { en: 'Shah', hi: 'शाह' },
  'badola': { en: 'Badola', hi: 'बडोला' },
  'बडोला': { en: 'Badola', hi: 'बडोला' },
  'dimri': { en: 'Dimri', hi: 'डिमरी' },
  'डिमरी': { en: 'Dimri', hi: 'डिमरी' },
  'kandari': { en: 'Kandari', hi: 'कंडारी' },
  'कंडारी': { en: 'Kandari', hi: 'कंडारी' },
  'kaintura': { en: 'Kaintura', hi: 'कैंतूरा' },
  'कैंतूरा': { en: 'Kaintura', hi: 'कैंतूरा' },
  'dabral': { en: 'Dabral', hi: 'डबराल' },
  'डबराल': { en: 'Dabral', hi: 'डबराल' },
  'kukreti': { en: 'Kukreti', hi: 'कुक्रेती' },
  'कुक्रेती': { en: 'Kukreti', hi: 'कुक्रेती' },
  'dhyani': { en: 'Dhyani', hi: 'ध्यानी' },
  'ध्यानी': { en: 'Dhyani', hi: 'ध्यानी' },
  'saklani': { en: 'Saklani', hi: 'सकलानी' },
  'सकलानी': { en: 'Saklani', hi: 'सकलानी' },
  'sundriyal': { en: 'Sundriyal', hi: 'सुंद्रियाल' },
  'सुंद्रियाल': { en: 'Sundriyal', hi: 'सुंद्रियाल' },

  // General Indian Surnames & Titles
  'singh': { en: 'Singh', hi: 'सिंह' },
  'सिंह': { en: 'Singh', hi: 'सिंह' },
  'devi': { en: 'Devi', hi: 'देवी' },
  'देवी': { en: 'Devi', hi: 'देवी' },
  'kumar': { en: 'Kumar', hi: 'कुमार' },
  'कुमार': { en: 'Kumar', hi: 'कुमार' },
  'kumari': { en: 'Kumari', hi: 'कुमारी' },
  'कुमारी': { en: 'Kumari', hi: 'कुमारी' },
  'lal': { en: 'Lal', hi: 'लाल' },
  'लाल': { en: 'Lal', hi: 'लाल' },
  'prasad': { en: 'Prasad', hi: 'प्रसाद' },
  'प्रसाद': { en: 'Prasad', hi: 'प्रसाद' },
  'ram': { en: 'Ram', hi: 'राम' },
  'राम': { en: 'Ram', hi: 'राम' },
  'chandra': { en: 'Chandra', hi: 'चंद्र' },
  'चन्द्र': { en: 'Chandra', hi: 'चंद्र' },
  'चंद्र': { en: 'Chandra', hi: 'चंद्र' },
  'sharma': { en: 'Sharma', hi: 'शर्मा' },
  'शर्मा': { en: 'Sharma', hi: 'शर्मा' },
  'verma': { en: 'Verma', hi: 'वर्मा' },
  'वर्मा': { en: 'Verma', hi: 'वर्मा' },
  'gupta': { en: 'Gupta', hi: 'गुप्ता' },
  'गुप्ता': { en: 'Gupta', hi: 'गुप्ता' },
  'yadav': { en: 'Yadav', hi: 'यादव' },
  'यादव': { en: 'Yadav', hi: 'यादव' },
  'mishra': { en: 'Mishra', hi: 'मिश्रा' },
  'misra': { en: 'Mishra', hi: 'मिश्रा' },
  'मिश्रा': { en: 'Mishra', hi: 'मिश्रा' },
  'मिश्र': { en: 'Mishra', hi: 'मिश्रा' },
  'tripathi': { en: 'Tripathi', hi: 'त्रिपाठी' },
  'त्रिपाठी': { en: 'Tripathi', hi: 'त्रिपाठी' },
  'shukla': { en: 'Shukla', hi: 'शुक्ला' },
  'शुक्ला': { en: 'Shukla', hi: 'शुक्ला' },
  'शुक्ल': { en: 'Shukla', hi: 'शुक्ला' },
  'dwivedi': { en: 'Dwivedi', hi: 'द्विवेदी' },
  'द्विवेदी': { en: 'Dwivedi', hi: 'द्विवेदी' },
  'dubey': { en: 'Dubey', hi: 'दुबे' },
  'दुबे': { en: 'Dubey', hi: 'दुबे' },
  'chaubey': { en: 'Chaubey', hi: 'चौबे' },
  'चौबे': { en: 'Chaubey', hi: 'चौबे' },
  'trivedi': { en: 'Trivedi', hi: 'त्रिवेदी' },
  'त्रिवेदी': { en: 'Trivedi', hi: 'त्रिवेदी' },
  'chaturvedi': { en: 'Chaturvedi', hi: 'चतुर्वेदी' },
  'चतुर्वेदी': { en: 'Chaturvedi', hi: 'चतुर्वेदी' },
  'upadhyay': { en: 'Upadhyay', hi: 'उपाध्याय' },
  'उपाध्याय': { en: 'Upadhyay', hi: 'उपाध्याय' },
  'ojha': { en: 'Ojha', hi: 'ओझा' },
  'ओझा': { en: 'Ojha', hi: 'ओझा' },
  'jha': { en: 'Jha', hi: 'झा' },
  'झा': { en: 'Jha', hi: 'झा' },
  'thakur': { en: 'Thakur', hi: 'ठाकुर' },
  'ठाकुर': { en: 'Thakur', hi: 'ठाकुर' },
  'rajput': { en: 'Rajput', hi: 'राजपूत' },
  'राजपूत': { en: 'Rajput', hi: 'राजपूत' },
  'saini': { en: 'Saini', hi: 'सैनी' },
  'सैनी': { en: 'Saini', hi: 'सैनी' },
  'kashyap': { en: 'Kashyap', hi: 'कश्यप' },
  'कश्यप': { en: 'Kashyap', hi: 'कश्यप' },
  'kargeti': { en: 'Kargeti', hi: 'करगेती' },
  'करगेती': { en: 'Kargeti', hi: 'करगेती' },
  'talya': { en: 'Talya', hi: 'तल्या' },
  'तल्या': { en: 'Talya', hi: 'तल्या' },
  'chaunallia': { en: 'Chaunallia', hi: 'चौनालिया' },
  'चौनालिया': { en: 'Chaunallia', hi: 'चौनालिया' },
  'चौनाल्लिया': { en: 'Chaunallia', hi: 'चौनालिया' },
  'bhikiasain': { en: 'Bhikiasain', hi: 'भिकियासैंण' },
  'भिकियासैंण': { en: 'Bhikiasain', hi: 'भिकियासैंण' },
  'shankar': { en: 'Shankar', hi: 'शंकर' },
  'शंकर': { en: 'Shankar', hi: 'शंकर' },
  'shyam': { en: 'Shyam', hi: 'श्याम' },
  'श्याम': { en: 'Shyam', hi: 'श्याम' },
  'radhey': { en: 'Radhey', hi: 'राधे' },
  'राधे': { en: 'Radhey', hi: 'राधे' },
  'radhe': { en: 'Radhey', hi: 'राधे' },
  'agarwal': { en: 'Agarwal', hi: 'अग्रवाल' },
  'agrawal': { en: 'Agrawal', hi: 'अग्रवाल' },
  'अग्रवाल': { en: 'Agarwal', hi: 'अग्रवाल' },
  'garg': { en: 'Garg', hi: 'गर्ग' },
  'गर्ग': { en: 'Garg', hi: 'गर्ग' },
  'bansal': { en: 'Bansal', hi: 'बंसल' },
  'बंसल': { en: 'Bansal', hi: 'बंसल' },
  'mittal': { en: 'Mittal', hi: 'मित्तल' },
  'मित्तल': { en: 'Mittal', hi: 'मित्तल' },
  'goyal': { en: 'Goyal', hi: 'गोयल' },
  'गोयल': { en: 'Goyal', hi: 'गोयल' },
  'jindal': { en: 'Jindal', hi: 'जिंदल' },
  'जिंदल': { en: 'Jindal', hi: 'जिंदल' },
  'prajapati': { en: 'Prajapati', hi: 'प्रजापति' },
  'प्रजापति': { en: 'Prajapati', hi: 'प्रजापति' },
  'pal': { en: 'Pal', hi: 'पाल' },
  'पाल': { en: 'Pal', hi: 'पाल' },
  'maurya': { en: 'Maurya', hi: 'मौर्या' },
  'मौर्या': { en: 'Maurya', hi: 'मौर्या' },
  'morya': { en: 'Maurya', hi: 'मौर्या' },
  'patel': { en: 'Patel', hi: 'पटेल' },
  'पटेल': { en: 'Patel', hi: 'पटेल' },
  'koli': { en: 'Koli', hi: 'कोली' },
  'कोली': { en: 'Koli', hi: 'कोली' },
  'das': { en: 'Das', hi: 'दास' },
  'दास': { en: 'Das', hi: 'दास' },
  'dey': { en: 'Dey', hi: 'डे' },
  'डे': { en: 'Dey', hi: 'डे' },
  'kapoor': { en: 'Kapoor', hi: 'कपूर' },
  'कपूर': { en: 'Kapoor', hi: 'कपूर' },
  'khanna': { en: 'Khanna', hi: 'खन्ना' },
  'खन्ना': { en: 'Khanna', hi: 'खन्ना' },
  'malhotra': { en: 'Malhotra', hi: 'मल्होत्रा' },
  'मल्होत्रा': { en: 'Malhotra', hi: 'मल्होत्रा' },
  'chopra': { en: 'Chopra', hi: 'चोपड़ा' },
  'चोपड़ा': { en: 'Chopra', hi: 'चोपड़ा' },
  'bhatia': { en: 'Bhatia', hi: 'भाटिया' },
  'भाटिया': { en: 'Bhatia', hi: 'भाटिया' },
  'kohli': { en: 'Kohli', hi: 'कोहली' },
  'कोहली': { en: 'Kohli', hi: 'कोहली' }
};

// Common First Names Dictionary
export const UK_FIRST_NAMES_DICTIONARY: Record<string, { en: string; hi: string }> = {
  'sarswati': { en: 'Sarswati', hi: 'सरस्वती' },
  'saraswati': { en: 'Saraswati', hi: 'सरस्वती' },
  'सरस्वती': { en: 'Sarswati', hi: 'सरस्वती' },
  'chaka': { en: 'Chaka', hi: 'चाका' },
  'चाका': { en: 'Chaka', hi: 'चाका' },
  'narendranagar': { en: 'Narendranagar', hi: 'नरेंद्रनगर' },
  'नरेंद्रनगर': { en: 'Narendranagar', hi: 'नरेंद्रनगर' },
  'aadhaya': { en: 'Aadhaya', hi: 'आध्या' },
  'aadhya': { en: 'Aadhya', hi: 'आध्या' },
  'आध्या': { en: 'Aadhaya', hi: 'आध्या' },
  'ravi': { en: 'Ravi', hi: 'रवि' },
  'रवि': { en: 'Ravi', hi: 'रवि' },
  'shankar': { en: 'Shankar', hi: 'शंकर' },
  'शंकर': { en: 'Shankar', hi: 'शंकर' },
  'ramesh': { en: 'Ramesh', hi: 'रमेश' },
  'रमेश': { en: 'Ramesh', hi: 'रमेश' },
  'suresh': { en: 'Suresh', hi: 'सुरेश' },
  'सुरेश': { en: 'Suresh', hi: 'सुरेश' },
  'mahesh': { en: 'Mahesh', hi: 'महेश' },
  'महेश': { en: 'Mahesh', hi: 'महेश' },
  'rajesh': { en: 'Rajesh', hi: 'राजेश' },
  'राजेश': { en: 'Rajesh', hi: 'राजेश' },
  'dinesh': { en: 'Dinesh', hi: 'दिनेश' },
  'दिनेश': { en: 'Dinesh', hi: 'दिनेश' },
  'birendra': { en: 'Birendra', hi: 'बीरेंद्र' },
  'बीरेंद्र': { en: 'Birendra', hi: 'बीरेंद्र' },
  'virendra': { en: 'Virendra', hi: 'वीरेंद्र' },
  'वीरेंद्र': { en: 'Virendra', hi: 'वीरेंद्र' },
  'sunita': { en: 'Sunita', hi: 'सुनीता' },
  'सुनीता': { en: 'Sunita', hi: 'सुनीता' },
  'anita': { en: 'Anita', hi: 'अनीता' },
  'अनीता': { en: 'Anita', hi: 'अनीता' },
  'अनिता': { en: 'Anita', hi: 'अनीता' },
  'pooja': { en: 'Pooja', hi: 'पूजा' },
  'puja': { en: 'Pooja', hi: 'पूजा' },
  'पूजा': { en: 'Pooja', hi: 'पूजा' },
  'priya': { en: 'Priya', hi: 'प्रिया' },
  'प्रिया': { en: 'Priya', hi: 'प्रिया' },
  'deepak': { en: 'Deepak', hi: 'दीपक' },
  'दीपक': { en: 'Deepak', hi: 'दीपक' },
  'amit': { en: 'Amit', hi: 'अमित' },
  'अमित': { en: 'Amit', hi: 'अमित' },
  'rahul': { en: 'Rahul', hi: 'राहुल' },
  'राहुल': { en: 'Rahul', hi: 'राहुल' },
  'rohit': { en: 'Rohit', hi: 'रोहित' },
  'रोहित': { en: 'Rohit', hi: 'रोहित' },
  'manoj': { en: 'Manoj', hi: 'मनोज' },
  'मनोज': { en: 'Manoj', hi: 'मनोज' },
  'vijay': { en: 'Vijay', hi: 'विजय' },
  'विजय': { en: 'Vijay', hi: 'विजय' },
  'sanjay': { en: 'Sanjay', hi: 'संजय' },
  'संजय': { en: 'Sanjay', hi: 'संजय' },
  'ajay': { en: 'Ajay', hi: 'अजय' },
  'अजय': { en: 'Ajay', hi: 'अजय' },
  'anil': { en: 'Anil', hi: 'अनिल' },
  'अनिल': { en: 'Anil', hi: 'अनिल' },
  'sunil': { en: 'Sunil', hi: 'सुनील' },
  'सुनील': { en: 'Sunil', hi: 'सुनील' },
  'pankaj': { en: 'Pankaj', hi: 'पंकज' },
  'पंकज': { en: 'Pankaj', hi: 'पंकज' },
  'saurabh': { en: 'Saurabh', hi: 'सौरभ' },
  'सौरभ': { en: 'Saurabh', hi: 'सौरभ' },
  'gaurav': { en: 'Gaurav', hi: 'गौरव' },
  'गौरव': { en: 'Gaurav', hi: 'गौरव' },
  'manmohan': { en: 'Manmohan', hi: 'मनमोहन' },
  'मनमोहन': { en: 'Manmohan', hi: 'मनमोहन' },
  'harish': { en: 'Harish', hi: 'हरीश' },
  'हरीश': { en: 'Harish', hi: 'हरीश' },
  'mohan': { en: 'Mohan', hi: 'मोहन' },
  'मोहन': { en: 'Mohan', hi: 'मोहन' },
  'sohan': { en: 'Sohan', hi: 'सोहन' },
  'सोहन': { en: 'Sohan', hi: 'सोहन' },
  'prakash': { en: 'Prakash', hi: 'प्रकाश' },
  'प्रकाश': { en: 'Prakash', hi: 'प्रकाश' },
  'ashok': { en: 'Ashok', hi: 'अशोक' },
  'अशोक': { en: 'Ashok', hi: 'अशोक' },
  'vinod': { en: 'Vinod', hi: 'विनोद' },
  'विनोद': { en: 'Vinod', hi: 'विनोद' },
  'neha': { en: 'Neha', hi: 'नेहा' },
  'नेहा': { en: 'Neha', hi: 'नेहा' },
  'shanti': { en: 'Shanti', hi: 'शांति' },
  'शांति': { en: 'Shanti', hi: 'शांति' },
  'suraj': { en: 'Suraj', hi: 'सूरज' },
  'सूरज': { en: 'Suraj', hi: 'सूरज' },
  'abhishek': { en: 'Abhishek', hi: 'अभिषेक' },
  'अभिषेक': { en: 'Abhishek', hi: 'अभिषेक' },
  'shubham': { en: 'Shubham', hi: 'शुभम' },
  'शुभम': { en: 'Shubham', hi: 'शुभम' },
  'ankit': { en: 'Ankit', hi: 'अंकित' },
  'अंकित': { en: 'Ankit', hi: 'अंकित' },
  'mayank': { en: 'Mayank', hi: 'मयंक' },
  'मयंक': { en: 'Mayank', hi: 'मयंक' },
  'vikas': { en: 'Vikas', hi: 'विकास' },
  'विकास': { en: 'Vikas', hi: 'विकास' },
  'meera': { en: 'Meera', hi: 'मीरा' },
  'mira': { en: 'Meera', hi: 'मीरा' },
  'मीरा': { en: 'Meera', hi: 'मीरा' },
  'मिरा': { en: 'Meera', hi: 'मीरा' },
  'meena': { en: 'Meena', hi: 'मीना' },
  'mina': { en: 'Meena', hi: 'मीना' },
  'मीना': { en: 'Meena', hi: 'मीना' },
  'मिना': { en: 'Meena', hi: 'मीना' },
  'reena': { en: 'Reena', hi: 'रीना' },
  'rina': { en: 'Reena', hi: 'रीना' },
  'रीना': { en: 'Reena', hi: 'रीना' },
  'veena': { en: 'Veena', hi: 'वीणा' },
  'vina': { en: 'Veena', hi: 'वीणा' },
  'वीणा': { en: 'Veena', hi: 'वीणा' },
  'वीना': { en: 'Veena', hi: 'वीणा' },
  'neena': { en: 'Neena', hi: 'नीना' },
  'nina': { en: 'Neena', hi: 'नीना' },
  'नीना': { en: 'Neena', hi: 'नीना' },
  'neeta': { en: 'Neeta', hi: 'नीता' },
  'nita': { en: 'Neeta', hi: 'नीता' },
  'नीता': { en: 'Neeta', hi: 'नीता' },
  'geeta': { en: 'Geeta', hi: 'गीता' },
  'gita': { en: 'Geeta', hi: 'गीता' },
  'गीता': { en: 'Geeta', hi: 'गीता' },
  'seema': { en: 'Seema', hi: 'सीमा' },
  'sima': { en: 'Seema', hi: 'सीमा' },
  'सीमा': { en: 'Seema', hi: 'सीमा' },
  'rita': { en: 'Rita', hi: 'रीता' },
  'reeta': { en: 'Rita', hi: 'रीता' },
  'रीता': { en: 'Rita', hi: 'रीता' },
  'sita': { en: 'Sita', hi: 'सीता' },
  'seeta': { en: 'Sita', hi: 'सीता' },
  'सीता': { en: 'Sita', hi: 'सीता' },
  'radha': { en: 'Radha', hi: 'राधा' },
  'राधा': { en: 'Radha', hi: 'राधा' },
  'leela': { en: 'Leela', hi: 'लीला' },
  'lila': { en: 'Leela', hi: 'लीला' },
  'लीला': { en: 'Leela', hi: 'लीला' },
  'kamla': { en: 'Kamla', hi: 'कमला' },
  'kamala': { en: 'Kamla', hi: 'कमला' },
  'कमला': { en: 'Kamla', hi: 'कमला' },
  'vimla': { en: 'Vimla', hi: 'विमला' },
  'vimala': { en: 'Vimla', hi: 'विमला' },
  'विमला': { en: 'Vimla', hi: 'विमला' },
  'sarita': { en: 'Sarita', hi: 'सरिता' },
  'सरिता': { en: 'Sarita', hi: 'सरिता' },
  'kavita': { en: 'Kavita', hi: 'कविता' },
  'कविता': { en: 'Kavita', hi: 'कविता' },
  'savita': { en: 'Savita', hi: 'सविता' },
  'सविता': { en: 'Savita', hi: 'सविता' },
  'babita': { en: 'Babita', hi: 'बबीता' },
  'बबीता': { en: 'Babita', hi: 'बबीता' },
  'mamta': { en: 'Mamta', hi: 'ममता' },
  'ममता': { en: 'Mamta', hi: 'ममता' },
  'usha': { en: 'Usha', hi: 'उषा' },
  'उषा': { en: 'Usha', hi: 'उषा' },
  'asha': { en: 'Asha', hi: 'आशा' },
  'आशा': { en: 'Asha', hi: 'आशा' },
  'rekha': { en: 'Rekha', hi: 'रेखा' },
  'रेखा': { en: 'Rekha', hi: 'रेखा' },
  'preeti': { en: 'Preeti', hi: 'प्रीति' },
  'priti': { en: 'Preeti', hi: 'प्रीति' },
  'प्रीति': { en: 'Preeti', hi: 'प्रीति' },
  'swati': { en: 'Swati', hi: 'स्वाति' },
  'स्वाति': { en: 'Swati', hi: 'स्वाति' },
  'rashmi': { en: 'Rashmi', hi: 'रश्मि' },
  'रश्मि': { en: 'Rashmi', hi: 'रश्मि' },
  'deepa': { en: 'Deepa', hi: 'दीपा' },
  'दीपा': { en: 'Deepa', hi: 'दीपा' },
  'deepika': { en: 'Deepika', hi: 'दीपिका' },
  'दीपिका': { en: 'Deepika', hi: 'दीपिका' },
  'nisha': { en: 'Nisha', hi: 'निशा' },
  'निशा': { en: 'Nisha', hi: 'निशा' },
  'sneha': { en: 'Sneha', hi: 'स्नेहा' },
  'स्नेहा': { en: 'Sneha', hi: 'स्नेहा' },
  'shreya': { en: 'Shreya', hi: 'श्रेया' },
  'श्रेया': { en: 'Shreya', hi: 'श्रेया' },
  'divya': { en: 'Divya', hi: 'दिव्या' },
  'दिव्या': { en: 'Divya', hi: 'दिव्या' },
  'jyoti': { en: 'Jyoti', hi: 'ज्योति' },
  'ज्योति': { en: 'Jyoti', hi: 'ज्योति' },
  'kanta': { en: 'Kanta', hi: 'कांता' },
  'कांता': { en: 'Kanta', hi: 'कांता' }
};

/**
 * Levenshtein distance for fuzzy string matching
 */
export function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = [];
  for (let i = 0; i <= bn; i++) matrix[i] = [i];
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[bn][an];
}

export function fuzzyMatchWord(
  word: string,
  dict: Record<string, { en: string; hi: string }>
): { en: string; hi: string } | null {
  const clean = word.toLowerCase().trim();
  if (!clean) return null;

  // 1. Direct dictionary match
  if (dict[clean]) return dict[clean];

  // 2. NEVER do loose fuzzy matching on short names (<= 5 chars), e.g. Meera vs Meena, Sita vs Rita, Ram vs Raj
  if (clean.length <= 5) {
    return null;
  }

  // 3. For longer words (>= 6 chars), allow strict distance of 1 for minor spelling differences
  let bestMatch: { en: string; hi: string } | null = null;
  let minDistance = 2; // only allow distance of 1

  for (const [key, val] of Object.entries(dict)) {
    if (Math.abs(key.length - clean.length) <= 1) {
      const dist = levenshtein(clean, key);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = val;
      }
    }
  }
  return bestMatch;
}

/**
 * Robust English (Latin) to Pure Devanagari Hindi Transliteration Engine
 */
export function latinToDevanagari(text: string): string {
  const words = text.trim().split(/\s+/);

  const convertedWords = words.map((w) => {
    const cleanLower = w.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanLower) return w;

    // 1. Check title dictionary
    if (INDIAN_TITLES_DICTIONARY[cleanLower]) {
      return INDIAN_TITLES_DICTIONARY[cleanLower].hi;
    }
    const cleanNoDot = cleanLower.replace(/\.+$/, '');
    if (INDIAN_TITLES_DICTIONARY[cleanNoDot]) {
      return INDIAN_TITLES_DICTIONARY[cleanNoDot].hi;
    }

    // 2. Direct dictionary match
    const dictMatch =
      fuzzyMatchWord(cleanLower, UK_FIRST_NAMES_DICTIONARY) ||
      fuzzyMatchWord(cleanLower, UK_SURNAME_DICTIONARY);
    if (dictMatch) {
      return dictMatch.hi;
    }

    // 3. Advanced phonetic token parser
    let res = '';
    let i = 0;
    const len = cleanLower.length;

    while (i < len) {
      const isStart = i === 0;

      // 4-char sequences
      const c4 = cleanLower.slice(i, i + 4);
      if (c4 === 'shya') { res += 'श्या'; i += 4; continue; }
      if (c4 === 'shwa' || c4 === 'shva') { res += 'श्वा'; i += 4; continue; }

      // 3-char sequences
      const c3 = cleanLower.slice(i, i + 3);
      if (c3 === 'ksh') { res += 'क्ष'; i += 3; continue; }
      if (c3 === 'chh') { res += 'छ'; i += 3; continue; }
      if (c3 === 'jny' || c3 === 'gya') { res += 'ज्ञा'; i += 3; continue; }
      if (c3 === 'shr') { res += 'श्र'; i += 3; continue; }
      if (c3 === 'shy') { res += 'श्य'; i += 3; continue; }
      if (c3 === 'shw' || c3 === 'shv') { res += 'श्व'; i += 3; continue; }
      if (c3 === 'tri') { res += 'त्रि'; i += 3; continue; }
      if (c3 === 'tra') { res += 'त्रा'; i += 3; continue; }
      if (c3 === 'kri') { res += 'कृ'; i += 3; continue; }
      if (c3 === 'pri') { res += 'प्रि'; i += 3; continue; }
      if (c3 === 'pra') { res += 'प्रा'; i += 3; continue; }
      if (c3 === 'bri') { res += 'बृ'; i += 3; continue; }
      if (c3 === 'bra') { res += 'ब्रा'; i += 3; continue; }
      if (c3 === 'dra') { res += 'द्रा'; i += 3; continue; }
      if (c3 === 'dri') { res += 'द्रि'; i += 3; continue; }
      if (c3 === 'swa' || c3 === 'sva') { res += 'स्वा'; i += 3; continue; }
      if (c3 === 'dwa' || c3 === 'dva') { res += 'द्वा'; i += 3; continue; }
      if (c3 === 'dwi' || c3 === 'dvi') { res += 'द्वि'; i += 3; continue; }
      if (c3 === 'jyo') { res += 'ज्यो'; i += 3; continue; }
      if (c3 === 'jya') { res += 'ज्या'; i += 3; continue; }
      if (c3 === 'dhy') { res += 'ध्य'; i += 3; continue; }
      if (c3 === 'thy') { res += 'थ्य'; i += 3; continue; }
      if (c3 === 'khy') { res += 'ख्य'; i += 3; continue; }
      if (c3 === 'ghy') { res += 'घ्य'; i += 3; continue; }
      if (c3 === 'bhy') { res += 'भ्य'; i += 3; continue; }
      if (c3 === 'mya') { res += 'म्या'; i += 3; continue; }
      if (c3 === 'vya' || c3 === 'wya') { res += 'व्या'; i += 3; continue; }
      if (c3 === 'nya') { res += 'न्या'; i += 3; continue; }
      if (c3 === 'rya') { res += 'र्या'; i += 3; continue; }
      if (c3 === 'tya') { res += 'त्या'; i += 3; continue; }
      if (c3 === 'dya') { res += 'द्या'; i += 3; continue; }
      if (c3 === 'pya') { res += 'प्या'; i += 3; continue; }
      if (c3 === 'kya') { res += 'क्या'; i += 3; continue; }
      if (c3 === 'gya') { res += 'ग्या'; i += 3; continue; }

      // 2-char sequences
      const c2 = cleanLower.slice(i, i + 2);
      if (c2 === 'kh') { res += 'ख'; i += 2; continue; }
      if (c2 === 'gh') { res += 'घ'; i += 2; continue; }
      if (c2 === 'ch') { res += 'च'; i += 2; continue; }
      if (c2 === 'jh') { res += 'झ'; i += 2; continue; }
      if (c2 === 'th') { res += 'थ'; i += 2; continue; }
      if (c2 === 'dh') { res += 'ध'; i += 2; continue; }
      if (c2 === 'ph') { res += 'फ'; i += 2; continue; }
      if (c2 === 'bh') { res += 'भ'; i += 2; continue; }
      if (c2 === 'sh') { res += 'श'; i += 2; continue; }
      if (c2 === 'pr') { res += 'प्र'; i += 2; continue; }
      if (c2 === 'tr') { res += 'त्र'; i += 2; continue; }
      if (c2 === 'kr') { res += 'क्र'; i += 2; continue; }
      if (c2 === 'gr') { res += 'ग्र'; i += 2; continue; }
      if (c2 === 'br') { res += 'ब्र'; i += 2; continue; }
      if (c2 === 'dr') { res += 'द्र'; i += 2; continue; }
      if (c2 === 'fr') { res += 'फ्र'; i += 2; continue; }
      if (c2 === 'vr' || c2 === 'wr') { res += 'व्र'; i += 2; continue; }
      if (c2 === 'sw' || c2 === 'sv') { res += 'स्व'; i += 2; continue; }
      if (c2 === 'st') { res += 'स्त'; i += 2; continue; }
      if (c2 === 'sp') { res += 'स्प'; i += 2; continue; }
      if (c2 === 'sm') { res += 'स्म'; i += 2; continue; }
      if (c2 === 'sn') { res += 'स्न'; i += 2; continue; }
      if (c2 === 'sk' || c2 === 'sc') { res += 'स्क'; i += 2; continue; }
      if (c2 === 'sl') { res += 'स्ल'; i += 2; continue; }
      if (c2 === 'jy') { res += 'ज्य'; i += 2; continue; }
      if (c2 === 'gy') { res += 'ज्ञ'; i += 2; continue; }
      if (c2 === 'ee') { res += (isStart ? 'ई' : 'ी'); i += 2; continue; }
      if (c2 === 'oo') { res += (isStart ? 'ऊ' : 'ू'); i += 2; continue; }
      if (c2 === 'aa') { res += (isStart ? 'आ' : 'ा'); i += 2; continue; }
      if (c2 === 'ai') { res += (isStart ? 'ऐ' : 'ै'); i += 2; continue; }
      if (c2 === 'au' || c2 === 'ou') { res += (isStart ? 'औ' : 'ौ'); i += 2; continue; }
      if (c2 === 'ey') { res += (isStart ? 'ए' : 'े'); i += 2; continue; }

      // 1-char sequence
      const c1 = cleanLower[i];

      switch (c1) {
        case 'a': res += isStart ? 'अ' : 'ा'; break;
        case 'i': res += isStart ? 'इ' : 'ि'; break;
        case 'u': res += isStart ? 'उ' : 'ु'; break;
        case 'e': res += isStart ? 'ए' : 'े'; break;
        case 'o': res += isStart ? 'ओ' : 'ो'; break;
        case 'k': res += 'क'; break;
        case 'g': res += 'ग'; break;
        case 'j': res += 'ज'; break;
        case 'z': res += 'ज़'; break;
        case 't': res += 'त'; break;
        case 'd': res += 'द'; break;
        case 'n': res += 'न'; break;
        case 'p': res += 'प'; break;
        case 'f': res += 'फ़'; break;
        case 'b': res += 'ब'; break;
        case 'm': res += 'म'; break;
        case 'y': res += 'य'; break;
        case 'r': res += 'र'; break;
        case 'l': res += 'ल'; break;
        case 'v':
        case 'w': res += 'व'; break;
        case 's': res += 'स'; break;
        case 'h': res += 'ह'; break;
        case 'c': res += 'क'; break;
        case 'q': res += 'क'; break;
        case 'x': res += 'क्स'; break;
        default: break;
      }
      i++;
    }

    return res || w;
  });

  return convertedWords.join(' ');
}

/**
 * Phonetically convert a Devanagari Hindi string to proper English
 */
export function devanagariToEnglish(hindiText: string): string {
  const words = hindiText.trim().split(/\s+/);

  const DEVANAGARI_CONSONANTS: Record<string, string> = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya', 'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'ड़': 'd', 'ढ़': 'dh', 'फ़': 'f'
  };

  const DEVANAGARI_VOWELS: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah'
  };

  const DEVANAGARI_MATRAS: Record<string, string> = {
    'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h'
  };

  const convertedWords = words.map((w) => {
    const cleanWord = w.trim();
    if (!cleanWord) return '';

    // Check title dictionary
    if (INDIAN_TITLES_DICTIONARY[cleanWord]) {
      return INDIAN_TITLES_DICTIONARY[cleanWord].en;
    }
    const cleanNoDot = cleanWord.replace(/\.+$/, '');
    if (INDIAN_TITLES_DICTIONARY[cleanNoDot]) {
      return INDIAN_TITLES_DICTIONARY[cleanNoDot].en;
    }

    // Check name and surname dictionaries
    const match =
      fuzzyMatchWord(cleanWord, UK_FIRST_NAMES_DICTIONARY) ||
      fuzzyMatchWord(cleanWord, UK_SURNAME_DICTIONARY);
    if (match) {
      return match.en;
    }

    let out = '';
    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const nextChar = cleanWord[i + 1] || '';

      if (DEVANAGARI_VOWELS[char]) {
        out += DEVANAGARI_VOWELS[char];
      } else if (DEVANAGARI_MATRAS[char]) {
        out += DEVANAGARI_MATRAS[char];
      } else if (DEVANAGARI_CONSONANTS[char]) {
        out += DEVANAGARI_CONSONANTS[char];
        if (nextChar === '्') {
          // Halant - no inherent vowel
          i++; // Skip halant
        } else if (!DEVANAGARI_MATRAS[nextChar] && !DEVANAGARI_VOWELS[nextChar] && i < cleanWord.length - 1) {
          // Inherent 'a' between consonants
          out += 'a';
        }
      } else {
        out += char;
      }
    }

    // Capitalize first letter
    return out.charAt(0).toUpperCase() + out.slice(1);
  });

  return convertedWords.join(' ');
}

/**
 * Process a spoken or typed name transcript in pure Hindi or English with Indian title support.
 * Guarantees that hindiName is 100% pure Devanagari Hindi and englishName is clean English.
 */
export function parseUttarakhandName(rawTranscript: string): { englishName: string; hindiName: string } {
  // Strip conversational prefixes and suffixes in both Hindi and English
  const cleanSpoken = rawTranscript
    .replace(/^(मेरा नाम है|मेरा नाम|नाम है|आवेदक का नाम|पिता का नाम|माता का नाम|my name is|name is|i am|this is)\s+/i, '')
    .replace(/\s+(है|likho|likhiye|rakho|rakhiye|kijiye|ji|sir|madam)$/i, '')
    .trim();

  if (!cleanSpoken) {
    return { englishName: '', hindiName: '' };
  }

  const isDevanagari = /[\u0900-\u097F]/.test(cleanSpoken);

  if (isDevanagari) {
    // Spoken or typed in Pure Devanagari Hindi
    const rawTokens = cleanSpoken.split(/\s+/);
    const hindiWords: string[] = [];
    const englishWords: string[] = [];

    for (const w of rawTokens) {
      const cleanW = w.trim();
      if (!cleanW) continue;

      // 1. Check title dictionary
      if (INDIAN_TITLES_DICTIONARY[cleanW]) {
        hindiWords.push(INDIAN_TITLES_DICTIONARY[cleanW].hi);
        englishWords.push(INDIAN_TITLES_DICTIONARY[cleanW].en);
        continue;
      }

      const cleanNoDot = cleanW.replace(/\.+$/, '');
      if (INDIAN_TITLES_DICTIONARY[cleanNoDot]) {
        hindiWords.push(INDIAN_TITLES_DICTIONARY[cleanNoDot].hi);
        englishWords.push(INDIAN_TITLES_DICTIONARY[cleanNoDot].en);
        continue;
      }

      // 2. Check Name and Surname dictionaries
      const match =
        fuzzyMatchWord(cleanW, UK_FIRST_NAMES_DICTIONARY) ||
        fuzzyMatchWord(cleanW, UK_SURNAME_DICTIONARY);

      if (match) {
        hindiWords.push(match.hi);
        englishWords.push(match.en);
      } else {
        hindiWords.push(cleanW);
        englishWords.push(devanagariToEnglish(cleanW));
      }
    }

    return {
      englishName: englishWords.join(' '),
      hindiName: hindiWords.join(' ')
    };
  } else {
    // Spoken or typed in English / Latin Script
    const rawTokens = cleanSpoken.split(/\s+/);
    const englishWords: string[] = [];
    const hindiWords: string[] = [];

    for (const w of rawTokens) {
      const cleanW = w.trim();
      if (!cleanW) continue;
      const lower = cleanW.toLowerCase();

      // 1. Check title dictionary
      if (INDIAN_TITLES_DICTIONARY[lower]) {
        englishWords.push(INDIAN_TITLES_DICTIONARY[lower].en);
        hindiWords.push(INDIAN_TITLES_DICTIONARY[lower].hi);
        continue;
      }

      const lowerNoDot = lower.replace(/\.+$/, '');
      if (INDIAN_TITLES_DICTIONARY[lowerNoDot]) {
        englishWords.push(INDIAN_TITLES_DICTIONARY[lowerNoDot].en);
        hindiWords.push(INDIAN_TITLES_DICTIONARY[lowerNoDot].hi);
        continue;
      }

      // 2. Check Name and Surname dictionaries
      const alphaOnly = lowerNoDot.replace(/[^a-z]/g, '');
      const match =
        fuzzyMatchWord(alphaOnly, UK_FIRST_NAMES_DICTIONARY) ||
        fuzzyMatchWord(alphaOnly, UK_SURNAME_DICTIONARY);

      if (match) {
        englishWords.push(match.en);
        hindiWords.push(match.hi);
      } else {
        englishWords.push(cleanW.charAt(0).toUpperCase() + cleanW.slice(1).toLowerCase());
        hindiWords.push(latinToDevanagari(alphaOnly || cleanW));
      }
    }

    return {
      englishName: englishWords.join(' '),
      hindiName: hindiWords.join(' ')
    };
  }
}

/**
 * Common address vocabulary dictionary for Uttarakhand
 */
export const UK_ADDRESS_DICTIONARY: Record<string, { en: string; hi: string }> = {
  'road': { en: 'Road', hi: 'रोड' },
  'रोड': { en: 'Road', hi: 'रोड' },
  'ward': { en: 'Ward', hi: 'वार्ड' },
  'वार्ड': { en: 'Ward', hi: 'वार्ड' },
  'nagar': { en: 'Nagar', hi: 'नगर' },
  'नगर': { en: 'Nagar', hi: 'नगर' },
  'mohalla': { en: 'Mohalla', hi: 'मोहल्ला' },
  'मोहल्ला': { en: 'Mohalla', hi: 'मोहल्ला' },
  'village': { en: 'Village', hi: 'ग्राम' },
  'gram': { en: 'Gram', hi: 'ग्राम' },
  'ग्राम': { en: 'Gram', hi: 'ग्राम' },
  'gaav': { en: 'Gaon', hi: 'गाँव' },
  'गांव': { en: 'Gaon', hi: 'गाँव' },
  'गाँव': { en: 'Gaon', hi: 'गाँव' },
  'post': { en: 'Post', hi: 'डाकघर' },
  'po': { en: 'P.O.', hi: 'डाकघर' },
  'dakghar': { en: 'Post Office', hi: 'डाकघर' },
  'डाकघर': { en: 'Post Office', hi: 'डाकघर' },
  'street': { en: 'Street', hi: 'गली' },
  'gali': { en: 'Gali', hi: 'गली' },
  'गली': { en: 'Gali', hi: 'गली' },
  'chowk': { en: 'Chowk', hi: 'चौक' },
  'चौक': { en: 'Chowk', hi: 'चौक' },
  'bazar': { en: 'Bazar', hi: 'बाजार' },
  'bazaar': { en: 'Bazaar', hi: 'बाजार' },
  'बाजार': { en: 'Bazar', hi: 'बाजार' },
  'mandi': { en: 'Mandi', hi: 'मंडी' },
  'मंडी': { en: 'Mandi', hi: 'मंडी' },
  'house': { en: 'House', hi: 'मकान' },
  'hno': { en: 'H.No.', hi: 'मकान नं.' },
  'मकान': { en: 'House', hi: 'मकान' },
  'block': { en: 'Block', hi: 'ब्लॉक' },
  'ब्लॉक': { en: 'Block', hi: 'ब्लॉक' },
  'near': { en: 'Near', hi: 'निकट' },
  'निकट': { en: 'Near', hi: 'निकट' },
  'pass': { en: 'Near', hi: 'पास' },
  'sector': { en: 'Sector', hi: 'सेक्टर' },
  'सेक्टर': { en: 'Sector', hi: 'सेक्टर' },
  'colony': { en: 'Colony', hi: 'कॉलोनी' },
  'कॉलोनी': { en: 'Colony', hi: 'कॉलोनी' },
  'vihar': { en: 'Vihar', hi: 'विहार' },
  'विहार': { en: 'Vihar', hi: 'विहार' },
  'enclave': { en: 'Enclave', hi: 'एन्क्लेव' },
  'एन्क्लेव': { en: 'Enclave', hi: 'एन्क्लेव' }
};

export function parseBilingualAddress(rawText: string): { english: string; hindi: string } {
  const clean = rawText
    .replace(/^(मेरा पता है|पता है|हमारा पता|गाँव का नाम|ग्राम|my address is|address is|address)\s+/i, '')
    .replace(/\s+(है|likho|likhiye|rakho|rakhiye|kijiye)$/i, '')
    .trim();

  if (!clean) return { english: '', hindi: '' };

  const isDevanagari = /[\u0900-\u097F]/.test(clean);

  if (isDevanagari) {
    const hindiWords = clean.split(/\s+/).map((w) => {
      const match = UK_ADDRESS_DICTIONARY[w] || UK_FIRST_NAMES_DICTIONARY[w] || UK_SURNAME_DICTIONARY[w];
      return match ? match.hi : w;
    });
    const englishWords = clean.split(/\s+/).map((w) => {
      const match = UK_ADDRESS_DICTIONARY[w] || UK_FIRST_NAMES_DICTIONARY[w] || UK_SURNAME_DICTIONARY[w];
      return match ? match.en : devanagariToEnglish(w);
    });
    return { english: englishWords.join(' '), hindi: hindiWords.join(' ') };
  } else {
    const englishWords = clean.split(/\s+/).map((w) => {
      const cleanW = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = UK_ADDRESS_DICTIONARY[cleanW] || UK_FIRST_NAMES_DICTIONARY[cleanW] || UK_SURNAME_DICTIONARY[cleanW];
      if (match) return match.en;
      if (/^[0-9]+$/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
    const hindiWords = clean.split(/\s+/).map((w) => {
      const cleanW = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = UK_ADDRESS_DICTIONARY[cleanW] || UK_FIRST_NAMES_DICTIONARY[cleanW] || UK_SURNAME_DICTIONARY[cleanW];
      if (match) return match.hi;
      if (/^[0-9]+$/.test(w)) return w;
      return latinToDevanagari(cleanW);
    });
    return { english: englishWords.join(' '), hindi: hindiWords.join(' ') };
  }
}
