
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wzufhachonpslyopmtcm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dWZoYWNob25wc2x5b3BtdGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM1NTYsImV4cCI6MjA1NzAwOTU1Nn0.5Rx16g927x-1ApZQRrO-BPdRoSnYqGrVkfYK9zUBqD0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
