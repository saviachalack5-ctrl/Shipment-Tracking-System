
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@gmail.com',
    crypt('admin123', gen_salt('bf')), 
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;


CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    customer_name TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    estimated_delivery DATE,
    is_archived BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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


ALTER TABLE public.shipments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.shipments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_settings TO anon, authenticated, service_role;
