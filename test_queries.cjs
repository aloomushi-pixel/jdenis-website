const { createClient } = require('@supabase/supabase-js');

// Using the PRO environment credentials
const supabaseUrl = 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log("Testing get_monthly_sales...");
    const { data: sales, error: errSales } = await supabase.rpc('get_monthly_sales');
    console.log("get_monthly_sales error:", errSales ? errSales.message : "Success");

    console.log("Testing get_production_summary...");
    const { data: prod, error: errProd } = await supabase.rpc('get_production_summary');
    console.log("get_production_summary error:", errProd ? errProd.message : "Success");

    console.log("Testing get_resource_summary...");
    const { data: res, error: errRes } = await supabase.rpc('get_resource_summary');
    console.log("get_resource_summary error:", errRes ? errRes.message : "Success");
}

test();
