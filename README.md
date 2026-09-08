# 🏛️ Uttarakhand e-District AI Smart Fill & Auto-Compress
### उत्तराखंड ई-सेवा पंजीकरण एवं एआई स्मार्ट फॉर्म सहायक

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

An AI-driven, citizen-centric web application engineered to simplify and accelerate citizen service registrations for Uttarakhand e-District portals. It features bilingual voice-guided form completion, in-browser optical character recognition (OCR), automated portal-compliant file compression (<200KB documents / <50KB photos), webcam passport studio, and instant PDF generation.

---

## ✨ Key Features

- 🎙️ **Bilingual AI Voice Assistant (English & हिन्दी)**
  - Interactive step-by-step interview mode that talks to users and listens for responses.
  - Floating voice companion for quick field navigation, clearing, autofill, and submitting.
  - Native Web Speech API integration with intelligent transliteration and localized speech synthesis.

- 🔍 **Client-Side Smart OCR Scanner**
  - Extract names, DOB, Aadhaar numbers, and addresses directly from identity cards and documents using [Tesseract.js](https://tesseract.projectnaptha.com/).
  - Fully client-side processing ensuring privacy and zero data leakage.

- ⚡ **Automated Smart Compression Engine**
  - Automatically compresses uploaded photos and PDF/image documents to meet strict portal limits (<200KB for proofs, <50KB for passport photos) using `browser-image-compression`.
  - Live preview of original vs. compressed size with instant quality validation.

- 📸 **Live Webcam Passport Studio**
  - In-browser live camera capture with face alignment guides.
  - Integrated cropping, orientation controls, and instant compression.

- 🏔️ **Localized Uttarakhand Geography Intelligence**
  - Pre-mapped cascading dataset covering all 13 districts (Dehradun, Haridwar, Nainital, Almora, Chamoli, Pauri Garhwal, Tehri Garhwal, Pithoragarh, Rudraprayag, Uttarkashi, Bageshwar, Champawat, Udham Singh Nagar) with corresponding Tehsils and Blocks.

- 📋 **Multi-Certificate Service Support**
  - **Income Certificate (आय प्रमाण पत्र)**
  - **Domicile / Permanent Residence (मूल निवास प्रमाण पत्र)**
  - **Caste Certificate (जाति प्रमाण पत्र)**
  - **Character Certificate (चरित्र प्रमाण पत्र)**

- 📄 **Official Application Preview & PDF Export**
  - Comprehensive review modal with printable summary layout and QR verification stamp.
  - Single-click PDF export powered by `jsPDF` and `html2canvas`.

- 💾 **Offline Autosave & Draft Recovery**
  - Automatic state persistence via `localStorage` preventing loss of input on accidental reloads.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Styling & Icons** | [Tailwind CSS 3](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) |
| **AI & Document OCR** | [Tesseract.js](https://tesseract.projectnaptha.com/) |
| **Image Compression** | [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) |
| **Speech Processing** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) |
| **Containerization & Web Server** | [Docker](https://www.docker.com/) & [Nginx Alpine](https://nginx.org/) (Multi-stage build) |

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

Run live development inside a container with volume mounts:

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
├── public/                   # Public static assets
├── src/
│   ├── assets/               # Local images, emblems, and icons
│   ├── components/           # Modular UI Components
│   │   ├── ApplicationPreviewModal.tsx  # Printable PDF preview modal
│   │   ├── DocumentUploader.tsx         # OCR & auto-compress document manager
│   │   ├── GuidedVoiceModal.tsx         # Full-screen conversational assistant
│   │   ├── Header.tsx                   # Top branding & quick action toolbar
│   │   ├── PhotoCaptureModal.tsx        # Live webcam photo studio
│   │   ├── RegistrationForm.tsx         # Core adaptive dynamic form
│   │   ├── ServiceSelector.tsx          # Government service selection cards
│   │   └── VoiceFloatingAssistant.tsx   # Floating interactive voice widget
│   ├── data/
│   │   └── uttarakhandData.ts           # 13 Districts, Tehsils & Blocks database
│   ├── types/                # TypeScript interfaces and type definitions
│   ├── utils/
│   │   ├── imageCompressor.ts           # Client-side compression logic
│   │   ├── ocrExtractor.ts              # Tesseract OCR parser
│   │   ├── pdfGenerator.ts              # jsPDF export utilities
│   │   └── voiceAssistant.ts            # Web Speech API wrapper
│   ├── App.tsx               # Primary application orchestrator
│   ├── index.css             # Tailwind and custom UI styles
│   └── main.tsx              # React DOM entry point
├── .dockerignore             # Docker build exclusions
├── .gitignore                # Git repository exclusions
├── docker-compose.yml        # Docker Compose service definition
├── Dockerfile                # Multi-stage optimized Nginx Dockerfile
├── nginx.conf                # Nginx production configuration
├── package.json              # Project dependencies and scripts
├── tailwind.config.js        # Tailwind CSS theme configuration
├── tsconfig.json             # TypeScript root configuration
└── vite.config.ts            # Vite build configuration
```

---

## 🗣️ Voice Assistant Guide

The built-in voice assistant recognizes voice commands in both **Hindi** and **English**:

| Action | Hindi Prompt Example | English Prompt Example |
|---|---|---|
| **Fill Name** | "मेरा नाम राहुल सिंह है" | "My name is Rahul Singh" |
| **Fill Father's Name** | "पिता का नाम दिनेश सिंह" | "Father's name is Dinesh Singh" |
| **Select District** | "जिला देहरादून चुनो" | "Select district Dehradun" |
| **Fill Annual Income** | "वार्षिक आय अस्सी हजार रुपये" | "Annual income is 80000" |
| **Open Camera** | "फोटो खींचो" / "कैमरा खोलो" | "Open camera" / "Take photo" |
| **Upload Document** | "दस्तावेज़ अपलोड करो" | "Upload document" |
| **Clear Form** | "फॉर्म साफ़ करो" | "Clear form" |
| **Submit / Review** | "आवेदन जमा करो" | "Submit application" |

---

## 🔒 Privacy & Security

- **Zero Server Upload for Scans:** All document OCR analysis via Tesseract.js is executed client-side inside your browser's WebAssembly sandbox.
- **Client-Side Compression:** Images and PDFs are compressed in browser memory (<200KB documents / <50KB photos) before any potential submission.
- **UIDAI Privacy Compliant Masking:** Aadhaar numbers are automatically masked (`XXXX XXXX 1234`) by default, with an interactive toggle for authorized user inspection.
- **Safe Local Drafts:** Form data saved for crash recovery resides exclusively in your browser's local storage.

---

## 📄 License

This project is open source and available under the terms of the **[MIT License](LICENSE)**.

```text
MIT License

Copyright (c) 2026 Ravi Shankar Singh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Copyright (c) 2026 **Ravi Shankar Singh**. All rights reserved.
