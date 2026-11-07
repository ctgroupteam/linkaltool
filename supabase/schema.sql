-- ========================================================
-- 🚀 LINKAL AI — MASTER POSTGRESQL SCHEMA MIGRATION
-- Project: linkal.in & *.linkal.in
-- Platform: Supabase PostgreSQL
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. RESERVED SUBDOMAINS TABLE (RFC 1035 Protected)
CREATE TABLE IF NOT EXISTS reserved_subdomains (
    slug VARCHAR(63) PRIMARY KEY,
    owner_note VARCHAR(255) NOT NULL,
    reserved_for VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed System and Founder Reserved Names
INSERT INTO reserved_subdomains (slug, owner_note, reserved_for) VALUES
('yahya', 'Founder Yahya', 'founder'),
('amir', 'Partner Amir', 'founder'),
('ai', 'Platform AI Root', 'founder'),
('studio', 'Linkal Studio Builder', 'system'),
('app', 'Admin App Gateway', 'system'),
('linkal', 'Brand Master', 'system'),
('admin', 'Admin Portal', 'system'),
('api', 'Backend API Route', 'system'),
('cdn', 'Image CDN Shield', 'system'),
('www', 'Web Subdomain', 'system'),
('auth', 'Authentication Gateway', 'system'),
('login', 'User Login Route', 'system'),
('pay', 'Payment Gateway Route', 'system'),
('checkout', 'Checkout Gateway', 'system'),
('billing', 'Billing Portal', 'system'),
('dashboard', 'Dashboard View', 'system'),
('status', 'System Status Page', 'system'),
('mail', 'System Mail Server', 'system'),
('dev', 'Development Route', 'system'),
('turkishzaika', 'Turkish Zaika Restaurant Flagship', 'vip'),
('turkish-zaika', 'Turkish Zaika Restaurant Alt', 'vip')
ON CONFLICT (slug) DO NOTHING;

-- 2. STORES / SITES TABLE
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    slug VARCHAR(63) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    plan_tier VARCHAR(20) DEFAULT 'free_trial', -- 'free_trial', 'basic', 'growth', 'free_lifetime'
    plan_status VARCHAR(20) DEFAULT 'trial',     -- 'trial', 'active', 'expired'
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    plan_expires_at TIMESTAMPTZ,
    is_free_lifetime BOOLEAN DEFAULT FALSE,
    promo_code_used VARCHAR(50),
    custom_theme JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);

-- 3. CV PROFILES TABLE (Dedicated for clean executive resume websites)
CREATE TABLE IF NOT EXISTS cv_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    professional_title VARCHAR(255) NOT NULL,
    bio_summary TEXT,
    location VARCHAR(100),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    resume_pdf_url VARCHAR(500),
    work_experience JSONB DEFAULT '[]', -- Array of {company, role, start, end, description}
    education JSONB DEFAULT '[]',       -- Array of {institution, degree, year}
    skills JSONB DEFAULT '[]',          -- Array of {category, items: []}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_profiles_store_id ON cv_profiles(store_id);

-- 4. PRODUCTS TABLE (For stores & digital restaurant menus)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2),
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    is_veg BOOLEAN DEFAULT TRUE,
    in_stock BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);

-- 5. PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) DEFAULT 'cv-resume',
    discount_type VARCHAR(20) NOT NULL, -- 'free_lifetime', 'percentage', 'flat'
    discount_value NUMERIC(10,2) DEFAULT 0,
    max_uses INT,
    current_uses INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Promo Code LINKALCV
INSERT INTO promo_codes (code, category, discount_type, discount_value, is_active) VALUES
('LINKALCV', 'cv-resume', 'free_lifetime', 100, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 6. ORDERS & CASHFREE PAYMENTS AUDIT LOG
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    cf_order_id VARCHAR(100) UNIQUE,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_session_id VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    plan_tier VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_cf_order_id ON orders(cf_order_id);

