import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkQuotations() {
  // Query to get table information if possible? We can't access information_schema via standard api.
  // Instead, let's try an empty insert to see what column fails first.
  const { data, error } = await supabase.from('quotations').insert({}).select();
  console.log('Insert empty object:', error);
  
  // Let's also fetch a single row to see all columns
  const { data: rows, error: getErr } = await supabase.from('quotations').select('*').limit(1);
  console.log('Get 1 row error:', getErr);
  console.log('Row columns:', rows?.[0] ? Object.keys(rows[0]) : 'no rows');
}

checkQuotations();
