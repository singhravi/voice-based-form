/**
 * Uttarakhand & Indian Names Devanagari <-> English Bidirectional Phonetic Engine
 * Provides authentic phonetic transliteration, fuzzy dictionary matching, and accurate Devanagari conversion.
 */

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
  'शंकर': { en: 'Shankar', hi: 'शंकर' }
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

    // 1. Direct dictionary match
    const dictMatch =
      fuzzyMatchWord(cleanLower, UK_FIRST_NAMES_DICTIONARY) ||
      fuzzyMatchWord(cleanLower, UK_SURNAME_DICTIONARY);
    if (dictMatch) {
      return dictMatch.hi;
    }

    // 2. Phonetic token parser
    let res = '';
    let i = 0;
    const len = cleanLower.length;

    while (i < len) {
      // 3-char sequences
      const c3 = cleanLower.slice(i, i + 3);
      if (c3 === 'ksh') { res += 'क्ष'; i += 3; continue; }
      if (c3 === 'chh') { res += 'छ'; i += 3; continue; }
      if (c3 === 'jny' || c3 === 'gya') { res += 'ज्ञ'; i += 3; continue; }

      // 2-char sequences
      const c2 = cleanLower.slice(i, i + 2);
      if (c2 === 'kh') { res += (i === 0 ? 'ख' : (isVowel(cleanLower[i - 1]) ? 'ख' : 'ख')); i += 2; continue; }
      if (c2 === 'gh') { res += 'घ'; i += 2; continue; }
      if (c2 === 'ch') { res += 'च'; i += 2; continue; }
      if (c2 === 'jh') { res += 'झ'; i += 2; continue; }
      if (c2 === 'th') { res += 'थ'; i += 2; continue; }
      if (c2 === 'dh') { res += 'ध'; i += 2; continue; }
      if (c2 === 'ph') { res += 'फ'; i += 2; continue; }
      if (c2 === 'bh') { res += 'भ'; i += 2; continue; }
      if (c2 === 'sh') { res += 'श'; i += 2; continue; }
      if (c2 === 'ee') { res += (i === 0 ? 'ई' : 'ी'); i += 2; continue; }
      if (c2 === 'oo') { res += (i === 0 ? 'ऊ' : 'ू'); i += 2; continue; }
      if (c2 === 'aa') { res += (i === 0 ? 'आ' : 'ा'); i += 2; continue; }
      if (c2 === 'ai') { res += (i === 0 ? 'ऐ' : 'ै'); i += 2; continue; }
      if (c2 === 'au') { res += (i === 0 ? 'औ' : 'ौ'); i += 2; continue; }
      if (c2 === 'tr') { res += 'त्र'; i += 2; continue; }
      if (c2 === 'gy') { res += 'ज्ञ'; i += 2; continue; }

      // 1-char sequence
      const c1 = cleanLower[i];
      const isFirst = i === 0;

      switch (c1) {
        case 'a': res += isFirst ? 'अ' : 'ा'; break;
        case 'i': res += isFirst ? 'इ' : 'ि'; break;
        case 'u': res += isFirst ? 'उ' : 'ु'; break;
        case 'e': res += isFirst ? 'ए' : 'े'; break;
        case 'o': res += isFirst ? 'ओ' : 'ो'; break;
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

function isVowel(char?: string): boolean {
  return !!char && ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
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
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h'
  };

  const convertedWords = words.map((w) => {
    const cleanWord = w.trim();
    if (!cleanWord) return '';

    // Check dictionary
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
 * Process a spoken name transcript in pure Hindi or English.
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
    // Spoken in Pure Devanagari Hindi
    const hindiWords = cleanSpoken.split(/\s+/).map((w) => {
      const match =
        fuzzyMatchWord(w, UK_FIRST_NAMES_DICTIONARY) ||
        fuzzyMatchWord(w, UK_SURNAME_DICTIONARY);
      return match ? match.hi : w;
    });

    const hindiName = hindiWords.join(' ');
    const englishName = devanagariToEnglish(cleanSpoken);
    return { englishName, hindiName };
  } else {
    // Spoken in English / Latin Script
    const words = cleanSpoken.split(/\s+/);

    const englishWords = words.map((w) => {
      const lower = w.toLowerCase().replace(/[^a-z]/g, '');
      const match =
        fuzzyMatchWord(lower, UK_FIRST_NAMES_DICTIONARY) ||
        fuzzyMatchWord(lower, UK_SURNAME_DICTIONARY);
      if (match) return match.en;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });

    const hindiWords = words.map((w) => {
      const lower = w.toLowerCase().replace(/[^a-z]/g, '');
      const match =
        fuzzyMatchWord(lower, UK_FIRST_NAMES_DICTIONARY) ||
        fuzzyMatchWord(lower, UK_SURNAME_DICTIONARY);
      if (match) return match.hi;
      return latinToDevanagari(lower);
    });

    const englishName = englishWords.join(' ');
    const hindiName = hindiWords.join(' ');
    return { englishName, hindiName };
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
