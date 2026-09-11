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
| **Primary Database** | **PostgreSQL 16+** (Relational tables + `JSONB` + `pg_trgm` bilingual indexing) |
| **In-Memory Cache & OTP** | **Redis 7** (High-speed session state, OTP tokens & rate limiting) |
| **Document/Blob Store** | **MinIO / S3** (High-throughput portal-compliant document & photo storage) |
| **AI OCR & Vision** | [Tesseract.js](https://tesseract.projectnaptha.com/) (WebAssembly OCR) |
| **PDF Processing & Render** | [PDF.js (pdfjs-dist)](https://mozilla.github.io/pdf.js/) & [jsPDF](https://github.com/parallax/jsPDF) |
| **Image Compression** | [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) & HTML5 Canvas |
| **Speech Engine** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) |
| **Phonetics Engine** | Custom Devanagari <-> English Bidirectional Phonetic Transliteration |
| **Containerization** | [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) |

---

## 🗄️ Database & Storage Architecture

The application adopts a **high-performance hybrid persistence model**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         Web Client (React / Vite)                      │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                 ┌───────────────────┼────────────────────┐
                 ▼                   ▼                    ▼
       ┌───────────────────┐ ┌───────────────┐ ┌────────────────────┐
       │   PostgreSQL 16   │ │    Redis 7    │ │    MinIO / S3      │
       │  (Relational Core │ │ (OTP, Session │ │  (Portal Uploads   │
       │   + JSONB + GIN)  │ │   & Rate-Lim) │ │   <200KB / <50KB)  │
       └───────────────────┘ └───────────────┘ └────────────────────┘
```

1. **PostgreSQL 16 (`db/init.sql`)**:
   - `citizens`: Master table for verified primary citizen identities, hashed Aadhaar, contacts, and socio-economic attributes.
   - `family_members`: Relational table managing family trees (`Spouse`, `Son`, `Daughter`, `Father`, `Mother`) with cascading integrity.
   - `service_applications`: Tracks certificate issuance workflows (`SUBMITTED` -> `UNDER_VERIFICATION` -> `TEHSILDAR_APPROVED` -> `ISSUED`) with preserved JSONB form snapshots.
   - `application_documents`: Metadata pointers to compressed files in object storage, plus OCR confidence scores.
   - `audit_logs`: Immutable audit logging for e-KYC consent, data exchange exports, and administrative actions.
2. **Redis 7**:
   - Handles rapid 6-digit OTP verification, temporary speech recognition buffer sessions, and caching of district/tehsil hierarchical lookups.
3. **MinIO / S3 Storage**:
   - Offloads heavy binary uploads (passport photos <50KB, identity proofs <200KB) to keep database I/O minimal and performant.

---

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** / **yarn** / **pnpm**
- **Docker & Docker Compose** (for running the full PostgreSQL + Redis + MinIO stack)

### Local Frontend Development

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

## 🐳 Full Stack Docker Deployment

The application includes an orchestrator setup ([`docker-compose.yml`](file:///Users/rssingh/myprojects/voice-form-fillup/docker-compose.yml)) running the complete production-grade ecosystem:

### Service Topology & Ports

| Service | Image | Internal Port | Host Port | Purpose | Default Credentials |
|---|---|---|---|---|---|
| **`voice-form-fillup`** | Custom Multi-Stage Nginx | 80 | **8080** | Production React App | — |
| **`postgres`** | `postgres:16-alpine` | 5432 | **5432** | Primary Database + JSONB | User: `edistrict_admin` / Pass: `edistrict_secure_pass_2026` |
| **`redis`** | `redis:7-alpine` | 6379 | **6379** | OTP & Session Cache | Pass: `redis_secure_pass_2026` |
| **`minio`** (API) | `minio/minio:latest` | 9000 | **9000** | S3-Compatible Uploads | User: `minio_admin` / Pass: `minio_secure_pass_2026` |
| **`minio`** (Console) | `minio/minio:latest` | 9001 | **9001** | MinIO Web Dashboard | User: `minio_admin` / Pass: `minio_secure_pass_2026` |

### 1. Launch the Complete Ecosystem

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Build and start all services in detached mode
docker compose up --build -d

# 3. View running container status & health checks
docker compose ps

# 4. Stream real-time logs
docker compose logs -f
```

* **Web Portal**: [http://localhost:8080](http://localhost:8080)
* **MinIO Object Store Dashboard**: [http://localhost:9001](http://localhost:9001)
* **PostgreSQL Database Connection**: `postgresql://edistrict_admin:edistrict_secure_pass_2026@localhost:5432/uk_edistrict_db`

### 2. Development Mode with Hot Reloading (HMR)

```bash
docker compose --profile dev up voice-form-dev
```
Access the HMR dev server at [http://localhost:5173](http://localhost:5173).

### 3. Stopping Services & Cleanup

```bash
# Stop containers without losing database data
docker compose down

# Stop containers and wipe volumes (Fresh reset)
docker compose down -v
```

---

## ⚙️ Environment Configuration (`.env.example`)

| Variable | Description | Default |
|---|---|---|
| `DB_NAME` | PostgreSQL database name | `uk_edistrict_db` |
| `DB_USER` | Database superuser | `edistrict_admin` |
| `DB_PASSWORD` | Database password | `edistrict_secure_pass_2026` |
| `DATABASE_URL` | Full PostgreSQL connection URI | `postgresql://edistrict_admin:edistrict_secure_pass_2026@postgres:5432/uk_edistrict_db` |
| `REDIS_PASSWORD` | Redis authentication password | `redis_secure_pass_2026` |
| `REDIS_URL` | Redis connection URI | `redis://:redis_secure_pass_2026@redis:6379/0` |
| `MINIO_ROOT_USER` | MinIO root access key | `minio_admin` |
| `MINIO_ROOT_PASSWORD` | MinIO root secret key | `minio_secure_pass_2026` |
| `PORT` | Production web application port | `8080` |
| `DEV_PORT` | Vite hot-reload dev port | `5173` |

---

## 📂 Project Structure

```plaintext
voice-form-fillup/
├── .github/                  # CI/CD Workflows
├── db/                       # Database Initialization & Schemas
│   └── init.sql              # PostgreSQL DDL, Trigram & GIN indexes, and Seed Data
├── public/                   # Static public assets (trained OCR data, emblems)
├── src/
│   ├── assets/               # Local images, seals, and UI assets
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
│   ├── types/                # TypeScript interfaces and type definitions
│   ├── utils/
│   │   ├── aadhaarUtils.ts             # Aadhaar format & masking utilities
│   │   ├── authService.ts              # Citizen Auth & OTP validation service
│   │   ├── citizenStorage.ts           # Centralized profile & state exchange store
│   │   ├── imageCompressor.ts          # Client-side smart image compression (<200KB)
│   │   ├── noiseShieldProcessor.ts     # Audio noise cancellation DSP filter
│   │   ├── ocrParser.ts                # Advanced regex & heuristic Indian ID parser
│   │   ├── pdfProcessor.ts             # PDF.js digital text extraction & renderer
│   │   ├── pincodeLookup.ts            # Indian Postal PIN code database & API lookup
│   │   ├── uttarakhandPhonetics.ts     # Bilingual phonetic transliteration engine
│   │   └── voiceAssistant.ts           # Web Speech API wrapper & voice engine
│   ├── App.tsx               # Primary application orchestrator
│   ├── index.css             # Tailwind CSS tokens & theme styling
│   └── main.tsx              # React DOM entry point
├── .env.example              # Environment variables template
├── docker-compose.yml        # Docker Compose (Postgres, Redis, MinIO, App)
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
