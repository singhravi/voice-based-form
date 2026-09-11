# 🏛️ Uttarakhand e-District AI Smart Fill, Live Document Scanner & Auto-Compress
### उत्तराखंड ई-सेवा पंजीकरण, लाइव दस्तावेज़ स्कैनर एवं एआई स्मार्ट फॉर्म सहायक

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

An AI-driven, citizen-centric web application engineered to simplify and accelerate citizen service registrations for Uttarakhand e-District portals. It features **bilingual voice-guided form completion**, **live camera document scanning**, **in-browser optical character recognition (AI OCR)**, **structured JSON payload generation & inspection**, **automated portal-compliant file compression (<200KB documents / <50KB photos)**, **webcam passport studio**, and **instant official application PDF generation**.

---

## ✨ Key Features

### 📷 1. Live Document Camera Scanner & Dual Upload
- **Live Camera Scanning Viewfinder**: Scan physical identity cards (Aadhaar, Baal Aadhaar, Ration Card, Voter ID) directly using your computer webcam or mobile camera.
- **Corner Target Alignment Guide**: Interactive guide frame ensuring clear, level document capture with shutter flash animation.
- **Smart Filter & Enhancement Studio**:
  - **Magic Clean (स्मार्ट OCR)**: Sharpens text and optimizes contrast for peak character recognition accuracy.
  - **B&W Doc (श्वेत-श्याम)**: High-contrast document thresholding style.
  - **Vibrant (रंगीन)**: True-to-life color reproduction.
  - **90° Orientation Rotate**: Rotate documents seamlessly into upright orientation.
- **Dual Option**: Scan live via camera or upload existing files (`.PDF`, `.JPG`, `.PNG`, `.WebP`).

### 🔍 2. Client-Side AI OCR & Structured JSON Extraction Engine
- **Accurate Indian Identity Card Parsing**:
  - **Full Name (Bilingual)**: Extracts English & Devanagari Hindi names with automatic cross-transliteration.
  - **Father / Husband / Guardian Name**: Identifies `C/O`, `S/O`, `D/O`, `W/O`, `Care of`, `आत्मज`, `सुपुत्र`, `सुपुत्री`, `पिता का नाम`, `पति का नाम`, including C/O inside address blocks.
  - **Date of Birth (DOB)**: Recognizes `DD/MM/YYYY`, `DD-MM-YYYY`, `DD.MM.YYYY`, `YYYY-MM-DD`, `Year of Birth`, and auto-normalizes to ISO format.
  - **Gender & Aadhaar Number**: Detects `Male` / `Female` / `Transgender` and 12-digit Aadhaar number with UIDAI compliant masking.
  - **Address, District, Tehsil & PIN**: Multi-line address parsing with automatic postal PIN lookup and Tehsil mapping for all 13 Uttarakhand districts.
- **Interactive JSON Inspector Modal (`ExtractedJsonModal`)**:
  - **Syntax-Highlighted JSON Code View**: Inspect the exact structured JSON object produced by the OCR engine.
  - **Field Extraction Checklist**: Visual badges showing status (*Found* vs. *Not detected*) for each identity field.
  - **Raw OCR Recognition Dump**: Inspect the raw, unprocessed text stream alongside parsed data.
  - **1-Click Copy & Download**: Copy JSON payload to clipboard or download as `.json`.

### 🎙️ 3. Bilingual AI Voice Assistant (English, हिन्दी & Hinglish)
- **Conversational Interview Flow**: Full-screen guided flow that asks questions step-by-step and populates fields.
- **Inline Voice Dictation**: Click-to-speak on individual form fields with real-time speech feedback.
- **Noise-Resistant Voice Shield 3.0**: Filters background rumble at busy CSC centers and Tehsil offices.
- **Text-to-Speech Aloud**: Audio playback for non-readers and accessibility compliance.

### ⚡ 4. Automated Smart Compression Engine (<200KB & <50KB)
- **Portal Compliance Guarantee**: Automatically compresses uploaded and scanned documents to strictly **< 200 KB** (UK Govt Portal standard) and passport photos to **< 50 KB**.
- **Live Size Metrics**: Real-time display of original size, compressed size, and savings percentage.

### 📸 5. Live Webcam Passport Studio
- In-browser live portrait capture with face alignment guides.
- Integrated cropping to standard 3.5cm × 4.5cm passport ratio and automatic compression to <50KB.

### 🏔️ 6. Localized Uttarakhand Geography Intelligence
- Pre-mapped cascading database covering all 13 districts (*Dehradun, Haridwar, Nainital, Almora, Chamoli, Pauri Garhwal, Tehri Garhwal, Pithoragarh, Rudraprayag, Uttarkashi, Bageshwar, Champawat, Udham Singh Nagar*) with corresponding Tehsils, Blocks, and Post Offices.

### 📋 7. Multi-Certificate Service Support
- **Income Certificate (आय प्रमाण पत्र)**
- **Domicile / Permanent Residence (मूल निवास प्रमाण पत्र)**
- **Caste Certificate (जाति प्रमाण पत्र)**
- **Character Certificate (चरित्र प्रमाण पत्र)**

### 📄 8. Official Application Preview & PDF Export
- Comprehensive review modal with printable summary layout, QR verification stamp, and digital application receipt.
- Single-click PDF export powered by `jsPDF`.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS 3](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) |
| **AI OCR & Vision** | [Tesseract.js](https://tesseract.projectnaptha.com/) (WebAssembly OCR) |
| **PDF Processing & Render** | [PDF.js (pdfjs-dist)](https://mozilla.github.io/pdf.js/) & [jsPDF](https://github.com/parallax/jsPDF) |
| **Image Compression** | [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) & HTML5 Canvas |
| **Speech Engine** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **Phonetics Engine** | Custom Devanagari <-> English Bidirectional Phonetic Transliteration |
| **Containerization** | [Docker](https://www.docker.com/) & [Nginx Alpine](https://nginx.org/) (Multi-stage build) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** / **yarn** / **pnpm**
- **Docker & Docker Compose** *(optional, for containerized deployment)*

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/singhravi/voice-based-form.git
   cd voice-based-form
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🐳 Docker Deployment

### 1. Production Mode with Docker Compose (Recommended)

Run the production container built with multi-stage Node.js + Nginx with Gzip compression and security headers:

```bash
# Build and start the container
docker compose up --build -d

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

Access the application at [http://localhost:8080](http://localhost:8080).

### 2. Development Mode with Hot Reloading

```bash
docker compose --profile dev up voice-form-dev
```

Access the development server at [http://localhost:5173](http://localhost:5173).

### 3. Standalone Docker Build

```bash
# Build image
docker build -t voice-form-fillup:latest .

# Run container
docker run -d -p 8080:80 --name voice-form-app voice-form-fillup:latest
```

---

## 📂 Project Structure

```plaintext
voice-form-fillup/
├── .github/                  # CI/CD Workflows
├── public/                   # Static public assets
├── src/
│   ├── assets/               # Local images, emblems, and icons
│   ├── components/           # Modular UI Components
│   │   ├── AccessibilityToolbar.tsx    # Text sizing, high-contrast & TTS
│   │   ├── ApplicationPreviewModal.tsx # Printable PDF preview & export
│   │   ├── DocumentScannerModal.tsx    # Live camera document scanner & enhancer
│   │   ├── DocumentUploader.tsx        # Document manager, compression & OCR
│   │   ├── ExtractedJsonModal.tsx      # Interactive OCR JSON inspector & viewer
│   │   ├── GuidedVoiceModal.tsx        # Conversational voice interview assistant
│   │   ├── Header.tsx                  # Top branding, language switcher & tools
│   │   ├── PhotoCaptureModal.tsx       # Live webcam passport studio
│   │   ├── RegistrationForm.tsx        # Adaptive multi-section citizen form
│   │   ├── ServiceSelector.tsx         # Certificate service selection cards
│   │   └── VoiceFloatingAssistant.tsx  # Floating interactive voice widget
│   ├── data/
│   │   └── uttarakhandData.ts          # 13 Districts, Tehsils & Blocks database
│   ├── types/               # TypeScript interfaces and type definitions
│   ├── utils/
│   │   ├── aadhaarUtils.ts             # Aadhaar format & masking utilities
│   │   ├── imageCompressor.ts          # Client-side smart image compression (<200KB)
│   │   ├── ocrParser.ts                # Advanced regex & heuristic Indian ID parser
│   │   ├── pdfProcessor.ts             # PDF.js digital text extraction & renderer
│   │   ├── pincodeLookup.ts            # Indian Postal PIN code database & API lookup
│   │   ├── uttarakhandPhonetics.ts     # Bilingual phonetic transliteration engine
│   │   └── voiceAssistant.ts           # Web Speech API wrapper & noise shield
│   ├── App.tsx               # Primary application orchestrator
│   ├── index.css             # Tailwind CSS tokens & theme styling
│   └── main.tsx              # React DOM entry point
├── docker-compose.yml        # Docker Compose definition
├── Dockerfile                # Multi-stage optimized Nginx Dockerfile
├── nginx.conf                # Nginx production configuration
├── package.json              # Project dependencies and scripts
└── vite.config.ts            # Vite build configuration
```

---

## 📋 OCR Extracted JSON Data Schema

When a document (e.g. Aadhaar Card) is scanned or uploaded, the engine produces structured JSON data conforming to the schema below:

```json
{
  "documentTypeDetected": "Aadhaar Card",
  "aadhaarNumber": "7829 4410 9821",
  "fullName": "Ramesh Singh Negi",
  "fullNameHi": "रमेश सिंह नेगी",
  "fatherHusbandName": "Birendra Singh Negi",
  "fatherHusbandNameHi": "बीरेंद्र सिंह नेगी",
  "dob": "1996-05-14",
  "gender": "Male",
  "mobileNumber": "9876543210",
  "addressLine": "H.No 42, Deodar Enclave, Near Clock Tower",
  "addressLineHi": "मकान नं. ४२, देवदार एन्क्लेव, क्लॉक टॉवर के पास",
  "villageWard": "Rajpur Road Ward No 12",
  "villageWardHi": "राजपुर रोड वार्ड नं. १२",
  "pinCode": "248001",
  "district": "Dehradun",
  "districtHi": "देहरादून",
  "tehsil": "Dehradun Sadar",
  "tehsilHi": "देहरादून सदर",
  "postOffice": "Dehradun G.P.O.",
  "postOfficeHi": "देहरादून मुख्य डाकघर (GPO)",
  "policeStation": "Kotwali Dehradun",
  "policeStationHi": "कोतवाली देहरादून नगर",
  "state": "Uttarakhand",
  "stateHi": "उत्तराखंड",
  "confidence": 98
}
```

---

## 🔒 Privacy & Security

- **Zero Server Upload for Scans:** All document OCR analysis via Tesseract.js is executed 100% client-side inside your browser's WebAssembly sandbox.
- **Client-Side Compression:** Images and PDFs are compressed in browser memory (<200KB documents / <50KB photos) before submission.
- **UIDAI Privacy Compliant Masking:** Aadhaar numbers are automatically masked (`XXXX XXXX 1234`) by default, with an interactive toggle for authorized user inspection.
- **Safe Local Drafts:** Form state is saved locally in browser storage and can be cleared at any time.

---

## 📄 License

This project is open source and available under the terms of the **[MIT License](LICENSE)**.

Copyright (c) 2026 **Ravi Shankar Singh**. All rights reserved.
