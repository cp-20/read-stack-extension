import { createClient } from '@supabase/supabase-js';

import { Storage } from '@plasmohq/storage';

const storage = new Storage({
  area: 'local',
});

const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PLASMO_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
