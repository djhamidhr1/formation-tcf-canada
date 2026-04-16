-- ============================================================
-- MIGRATION TCF CANADA — À exécuter sur Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/fvhxptpzskvwpdtycklj/sql/new
-- ============================================================

-- 1. TABLE PROFILES (utilisateurs)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'teacher')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger auto-création de profile à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. TABLE SUBSCRIPTION_TIERS (plans tarifaires)
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('revision', 'formation', 'ee_only')),
  price_usd DECIMAL(10,2),
  duration_days INTEGER,
  ai_writing_credits INTEGER DEFAULT 0,
  has_zoom_sessions BOOLEAN DEFAULT false,
  zoom_sessions_count INTEGER DEFAULT 0,
  stripe_price_id TEXT,
  description TEXT,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);
INSERT INTO public.subscription_tiers (name, slug, category, price_usd, duration_days, ai_writing_credits, has_zoom_sessions, zoom_sessions_count, is_popular, display_order) VALUES
  ('Bronze', 'bronze', 'revision', 14.99, 5, 3, false, 0, false, 1),
  ('Silver', 'silver', 'revision', 29.99, 30, 8, false, 0, true, 2),
  ('Gold', 'gold', 'revision', 49.99, 60, 15, false, 0, false, 3),
  ('Standard Zoom', 'standard_zoom', 'formation', 149.99, 15, 20, true, 6, false, 4),
  ('Premium Zoom', 'premium_zoom', 'formation', 199.99, 30, 20, true, 8, true, 5),
  ('Platinium Zoom', 'platinium_zoom', 'formation', 249.99, 60, 30, true, 10, false, 6),
  ('EE Standard', 'ee_standard', 'ee_only', 14.99, 30, 5, false, 0, false, 7),
  ('EE Performance', 'ee_performance', 'ee_only', 29.99, 60, 15, false, 0, true, 8),
  ('EE Pro', 'ee_pro', 'ee_only', 49.99, 90, 30, false, 0, false, 9)
ON CONFLICT (slug) DO NOTHING;

-- 3. TABLE EE_SUBMISSIONS (corrections IA Expression Écrite)
CREATE TABLE IF NOT EXISTS public.ee_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  combinaison_id UUID REFERENCES public.combinaisons_ee(id),
  task1_text TEXT,
  task2_text TEXT,
  task3_text TEXT,
  ai_score_task1 DECIMAL(4,2),
  ai_score_task2 DECIMAL(4,2),
  ai_score_task3 DECIMAL(4,2),
  ai_score_global DECIMAL(4,2),
  ai_nclc INTEGER,
  ai_feedback JSONB,
  ai_model TEXT DEFAULT 'claude-opus-4-6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ee_submissions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users manage own EE" ON public.ee_submissions FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. TABLE PAYMENTS (paiements Stripe)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT,
  amount_usd DECIMAL(10,2),
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  tier_slug TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. COMPTE ADMIN
-- Après inscription sur /inscription avec admin@tcfcanada.com / TCFAdmin2026!
-- Exécuter cette ligne :
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@tcfcanada.com';
