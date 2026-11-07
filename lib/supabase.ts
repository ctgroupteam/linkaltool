import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yuvkbugblplulrzrjamg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server-side privileged client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Client-side / public client
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

export interface StoreRecord {
  id: string;
  user_id: string;
  slug: string;
  business_name: string;
  category: string;
  template_id: string;
  whatsapp_number: string;
  contact_email?: string;
  plan_tier: 'free_trial' | 'basic' | 'growth' | 'free_lifetime';
  plan_status: 'trial' | 'active' | 'expired';
  trial_ends_at: string;
  plan_expires_at?: string;
  is_free_lifetime: boolean;
  promo_code_used?: string;
  custom_theme: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CvProfileRecord {
  id: string;
  store_id: string;
  full_name: string;
  professional_title: string;
  bio_summary: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  resume_pdf_url?: string;
  work_experience: Array<{
    company: string;
    role: string;
    start: string;
    end: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  created_at: string;
}

export interface PromoCodeRecord {
  id: string;
  code: string;
  category: string;
  discount_type: 'free_lifetime' | 'percentage' | 'flat';
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
}

export interface OrderRecord {
  id: string;
  store_id: string;
  cf_order_id: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_session_id?: string;
  customer_phone?: string;
  customer_email?: string;
  plan_tier: string;
  created_at: string;
}
