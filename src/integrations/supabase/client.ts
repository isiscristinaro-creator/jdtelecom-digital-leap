import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nzhgutvvzyfyjbqhicps.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56aGd1dHZ2enlmeWpicWhpY3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTExNzAsImV4cCI6MjA5MTM2NzE3MH0.YVpcfaSpLB8Jrf5vZ0hqWBI1Gk5spSsiwuDWy5sX3gA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
