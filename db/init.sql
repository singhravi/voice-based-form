-- ==============================================================================
-- Uttarakhand e-District AI Smart Fill & Centralized Citizen Profile Database Schema
-- Architecture: PostgreSQL 16+ with Relational + JSONB + GIN/Trigram Indexing
-- ==============================================================================

-- Enable UUID and Trigram Search Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 1. CITIZENS (Primary Citizen Profile Master Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    aadhaar_hash VARCHAR(64) UNIQUE, -- SHA-256 / Tokenized representation
    aadhaar_masked VARCHAR(14),      -- e.g. XXXX-XXXX-0123
    is_aadhaar_verified BOOLEAN DEFAULT FALSE,
    
    -- Personal details (Bilingual)
    full_name_en VARCHAR(255) NOT NULL,
    full_name_hi VARCHAR(255),
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Transgender')),
    dob DATE,
    marital_status VARCHAR(50),
    religion VARCHAR(50),
    caste_category VARCHAR(50), -- General, OBC, SC, ST, EWS
    sub_caste VARCHAR(100),
    
    -- Lineage details
    father_husband_name_en VARCHAR(255),
    father_husband_name_hi VARCHAR(255),
    mother_name_en VARCHAR(255),
    mother_name_hi VARCHAR(255),
    relation_type VARCHAR(20) CHECK (relation_type IN ('Father', 'Husband', 'Guardian')),
    
    -- Contact & Identifiers
    email VARCHAR(255),
    pan_number VARCHAR(20),
    voter_id VARCHAR(50),
    ration_card_no VARCHAR(50),
    
    -- Address (Uttarakhand Hierarchical Structure)
    state VARCHAR(100) DEFAULT 'Uttarakhand',
    state_hi VARCHAR(100) DEFAULT 'उत्तराखंड',
    district_id VARCHAR(50) NOT NULL,
    district_name_en VARCHAR(100) NOT NULL,
    district_name_hi VARCHAR(100),
    tehsil_id VARCHAR(50) NOT NULL,
    tehsil_name_en VARCHAR(100) NOT NULL,
    tehsil_name_hi VARCHAR(100),
    post_office_en VARCHAR(150),
    post_office_hi VARCHAR(150),
    police_station_en VARCHAR(150),
    police_station_hi VARCHAR(150),
    village_ward_en VARCHAR(150),
    village_ward_hi VARCHAR(150),
    address_line_en TEXT,
    address_line_hi TEXT,
    pin_code VARCHAR(10) NOT NULL,
    is_permanent_resident BOOLEAN DEFAULT FALSE,
    living_since_years VARCHAR(10),
    
    -- Socio-economic
    occupation VARCHAR(150),
    annual_income NUMERIC(12, 2) DEFAULT 0.00,
    income_source VARCHAR(150),
    
    -- Photos and Signatures
    profile_photo_url TEXT,
    signature_url TEXT,
    
    -- Source Metadata tracking (JSONB: which fields were filled by OCR, Voice, UIDAI, or manual)
    field_sources JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for citizens
CREATE INDEX IF NOT EXISTS idx_citizens_mobile ON citizens (mobile_number);
CREATE INDEX IF NOT EXISTS idx_citizens_aadhaar_hash ON citizens (aadhaar_hash);
CREATE INDEX IF NOT EXISTS idx_citizens_district ON citizens (district_id);
CREATE INDEX IF NOT EXISTS idx_citizens_pincode ON citizens (pin_code);
CREATE INDEX IF NOT EXISTS idx_citizens_name_trgm_en ON citizens USING gin (full_name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_citizens_name_trgm_hi ON citizens USING gin (full_name_hi gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_citizens_field_sources ON citizens USING gin (field_sources);

-- ------------------------------------------------------------------------------
-- 2. FAMILY MEMBERS (Relational Child Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    relation VARCHAR(50) NOT NULL, -- Spouse, Son, Daughter, Father, Mother, etc.
    relation_hi VARCHAR(50),
    full_name_en VARCHAR(255) NOT NULL,
    full_name_hi VARCHAR(255),
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Transgender')),
    dob DATE,
    aadhaar_hash VARCHAR(64),
    aadhaar_masked VARCHAR(14),
    is_aadhaar_verified BOOLEAN DEFAULT FALSE,
    mobile_number VARCHAR(15),
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    caste_category VARCHAR(50),
    occupation VARCHAR(150),
    annual_income NUMERIC(12, 2) DEFAULT 0.00,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_family_citizen_id ON family_members (citizen_id);
CREATE INDEX IF NOT EXISTS idx_family_aadhaar_hash ON family_members (aadhaar_hash);

-- ------------------------------------------------------------------------------
-- 3. SERVICE APPLICATIONS (Certificate Application Submissions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(64) UNIQUE NOT NULL,
    citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE RESTRICT,
    applied_for_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL, -- NULL = Self
    service_type VARCHAR(50) NOT NULL, -- domicile, income, caste, character, etc.
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' 
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_VERIFICATION', 'PATWARI_VERIFIED', 'TEHSILDAR_APPROVED', 'REJECTED', 'ISSUED')),
    delivery_due_date DATE,
    fee_amount NUMERIC(8, 2) DEFAULT 30.00,
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'EXEMPTED', 'FAILED')),
    payment_reference VARCHAR(100),
    
    -- Preserved Snapshot of form data & extraction details at time of submission
    form_data_snapshot JSONB NOT NULL,
    ocr_extracted_metadata JSONB DEFAULT '{}'::jsonb,
    field_sources_snapshot JSONB DEFAULT '{}'::jsonb,
    
    submission_ip VARCHAR(45),
    user_agent TEXT,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_app_number ON service_applications (application_number);
CREATE INDEX IF NOT EXISTS idx_applications_citizen_id ON service_applications (citizen_id);
CREATE INDEX IF NOT EXISTS idx_applications_service_type ON service_applications (service_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON service_applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_snapshot_gin ON service_applications USING gin (form_data_snapshot);

-- ------------------------------------------------------------------------------
-- 4. APPLICATION DOCUMENTS (Stored in MinIO/S3, Metadated in PostgreSQL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES service_applications(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL, -- aadhaar_card, ration_card, photo, applicant_signature, income_affidavit
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,         -- S3 / MinIO Object Key / URL
    mime_type VARCHAR(50) NOT NULL,
    original_size_kb INT NOT NULL,
    compressed_size_kb INT NOT NULL,
    is_compressed BOOLEAN DEFAULT TRUE,
    ocr_extracted BOOLEAN DEFAULT FALSE,
    ocr_confidence NUMERIC(5, 2),
    extracted_data_json JSONB DEFAULT '{}'::jsonb,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_app_docs_application_id ON application_documents (application_id);
CREATE INDEX IF NOT EXISTS idx_app_docs_doc_type ON application_documents (doc_type);

-- ------------------------------------------------------------------------------
-- 5. AUDIT TRAIL & DATA EXCHANGE LOGS (Compliance & Security)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL, -- EKYC_VERIFICATION, OCR_EXTRACTION, FORM_SUBMIT, DATA_EXCHANGE_EXPORT
    performed_by VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_citizen ON audit_logs (citizen_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action_type);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs (created_at);

-- ------------------------------------------------------------------------------
-- 6. SEED DEMO DATA
-- ------------------------------------------------------------------------------
INSERT INTO citizens (
    id,
    mobile_number,
    is_mobile_verified,
    aadhaar_hash,
    aadhaar_masked,
    is_aadhaar_verified,
    full_name_en,
    full_name_hi,
    gender,
    dob,
    marital_status,
    religion,
    caste_category,
    father_husband_name_en,
    father_husband_name_hi,
    mother_name_en,
    mother_name_hi,
    relation_type,
    email,
    pan_number,
    voter_id,
    state,
    state_hi,
    district_id,
    district_name_en,
    district_name_hi,
    tehsil_id,
    tehsil_name_en,
    tehsil_name_hi,
    post_office_en,
    post_office_hi,
    police_station_en,
    police_station_hi,
    village_ward_en,
    village_ward_hi,
    address_line_en,
    address_line_hi,
    pin_code,
    is_permanent_resident,
    living_since_years,
    occupation,
    annual_income,
    field_sources
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '9876543210',
    TRUE,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'XXXX-XXXX-0123',
    TRUE,
    'Ravi Shankar Singh',
    'रवि शंकर सिंह',
    'Male',
    '1988-06-15',
    'Married',
    'Hindu',
    'General',
    'Late Birendra Singh Negi',
    'स्व. बीरेंद्र सिंह नेगी',
    'Kamla Devi',
    'कमला देवी',
    'Father',
    'ravi.singh@example.com',
    'ABCPS1234F',
    'UK/01/023/456789',
    'Uttarakhand',
    'उत्तराखंड',
    'dehradun',
    'Dehradun',
    'देहरादून',
    'dehradun_sadar',
    'Dehradun Sadar',
    'देहरादून सदर',
    'Dehradun G.P.O.',
    'देहरादून मुख्य डाकघर (GPO)',
    'Kotwali Dehradun',
    'कोतवाली देहरादून नगर',
    'Ward 12, Rajpur Road',
    'वार्ड 12, राजपुर रोड',
    'House No. 42-B, Near Clock Tower, Rajpur Road',
    'मकान संख्या 42-बी, घंटाघर के पास, राजपुर रोड',
    '248001',
    FALSE,
    '25',
    'Self Employed / Business / स्वरोजगार',
    180000.00,
    '{"fullName": "uidai", "fullNameHi": "uidai", "dob": "uidai", "gender": "uidai", "district": "pincode", "tehsil": "pincode", "mobileNumber": "manual"}'::jsonb
) ON CONFLICT (mobile_number) DO NOTHING;

-- Seed Family Members
INSERT INTO family_members (
    id,
    citizen_id,
    relation,
    relation_hi,
    full_name_en,
    full_name_hi,
    gender,
    dob,
    aadhaar_hash,
    aadhaar_masked,
    is_aadhaar_verified,
    mobile_number,
    is_mobile_verified,
    caste_category,
    occupation,
    annual_income
) VALUES 
(
    'f1a2b3c4-d5e6-7a8b-9c0d-1e2f3a4b5c6e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Spouse',
    'पत्नी / जीवनसाथी',
    'Sunita Devi',
    'सुनीता देवी',
    'Female',
    '1992-04-10',
    'f2b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b866',
    'XXXX-XXXX-1234',
    TRUE,
    '9876543211',
    FALSE,
    'General',
    'Homemaker / गृहिणी',
    0.00
),
(
    'f2a2b3c4-d5e6-7a8b-9c0d-1e2f3a4b5c6f',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Son',
    'पुत्र (बेटा)',
    'Aarav Singh',
    'आरव सिंह',
    'Male',
    '2015-09-22',
    'f3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b877',
    'XXXX-XXXX-2345',
    TRUE,
    NULL,
    FALSE,
    'General',
    'Student / विद्यार्थी',
    0.00
) ON CONFLICT DO NOTHING;

-- Seed Sample Submitted Application
INSERT INTO service_applications (
    application_number,
    citizen_id,
    service_type,
    status,
    fee_amount,
    payment_status,
    form_data_snapshot,
    field_sources_snapshot
) VALUES (
    'UK-EDIST-2026-849201',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'domicile',
    'UNDER_VERIFICATION',
    30.00,
    'PAID',
    '{"serviceType": "domicile", "fullName": "Ravi Shankar Singh", "fullNameHi": "रवि शंकर सिंह", "district": "Dehradun", "tehsil": "Dehradun Sadar"}'::jsonb,
    '{"fullName": "uidai", "dob": "uidai"}'::jsonb
) ON CONFLICT (application_number) DO NOTHING;
