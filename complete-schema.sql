-- COMPLETE SUPABASE SCHEMA WITH RLS POLICIES
-- Run this entire script in Supabase SQL Editor after deleting all tables

-- Create users table with all required fields
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone BIGINT,
    profession TEXT CHECK (profession IN ('student', 'professional')),
    college TEXT,
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_programs table
CREATE TABLE training_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    price NUMERIC,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    training_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending_payment', 'enrolled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    training_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_reference TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending_verification', 'verified', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    training_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    certificate_id TEXT UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificate_templates table
CREATE TABLE certificate_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('html', 'image', 'pdf')),
    template_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_activity_logs table
CREATE TABLE admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_training_id ON enrollments(training_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_training_id ON payments(training_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_training_id ON certificates(training_id);
CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);

-- Insert default certificate template
INSERT INTO certificate_templates (name, template_type, template_url, is_active)
VALUES ('Default Certificate', 'html', '/templates/default-certificate.html', true);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- RLS Policies for USERS table
CREATE POLICY "Users can view own profile" ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users FOR UPDATE 
USING (auth.uid() = id);

-- RLS Policies for TRAINING_PROGRAMS table
CREATE POLICY "Training programs are publicly viewable" ON training_programs FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage training programs" ON training_programs FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for ENROLLMENTS table
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments" ON enrollments FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage enrollments" ON enrollments FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for PAYMENTS table
CREATE POLICY "Users can view own payments" ON payments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON payments FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage payments" ON payments FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for CERTIFICATES table
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all certificates" ON certificates FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage certificates" ON certificates FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for CERTIFICATE_TEMPLATES table
CREATE POLICY "Active templates are publicly viewable" ON certificate_templates FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage certificate templates" ON certificate_templates FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for ADMIN_ACTIVITY_LOGS table
CREATE POLICY "Only admins can view activity logs" ON admin_activity_logs FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can manage activity logs" ON admin_activity_logs FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, profession, college, company)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN NEW.raw_user_meta_data->>'phone' IS NOT NULL AND NEW.raw_user_meta_data->>'phone' != '' 
      THEN (NEW.raw_user_meta_data->>'phone')::BIGINT 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'profession',
    NEW.raw_user_meta_data->>'college',
    NEW.raw_user_meta_data->>'company'
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run function after user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;