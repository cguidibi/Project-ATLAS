import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    const { data, error } = await supabase.from('subsidiaries').select('*');
    if (error) {
        console.error('❌ Verification Failed:', error.message);
    } else {
        console.log('✅ Verification Successful. Subsidiaries found:', data.length);
        console.log(data);
    }
}

verify();
