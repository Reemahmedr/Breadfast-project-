import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khfbozdcrkgxblswaqlg.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZmJvemRjcmtneGJsc3dhcWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODg3MjIsImV4cCI6MjA4NDc2NDcyMn0.oG0RTD1lmiw3sJT1ppNGRMDz77Dgp6aUpdp3Jrb1EZY' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)