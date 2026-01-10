
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES (
    gen_random_uuid(),
    'admin@gmail.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated'
) ON CONFLICT (email) DO NOTHING;


CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    settings JSONB DEFAULT '{
        "status": true,
        "Actions": true,
        "AddShipment": true,
        "EstimatedTime": true,
        "News": true,
        "Report": true,
        "Archives": true
    }'::jsonb
);

INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO NOTHING;


CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    customer_name TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    estimated_delivery DATE,
    is_archived BOOLEAN DEFAULT false
);


ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.shipments TO anon, authenticated, service_role;
