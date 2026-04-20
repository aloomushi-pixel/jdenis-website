const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kxoitidsrfeqxwvxjwsd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4b2l0aWRzcmZlcXh3dnhqd3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDk1NzMsImV4cCI6MjA4OTY4NTU3M30._Wvl1H6c2lMIMANP4D3QARvPOnBRtTaDBgoaG856S2Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const accounts = [
  { email: 'admin_qa@jdenis.test', role: 'ADMIN', name: 'QA Admin' },
  { email: 'cliente_qa@jdenis.test', role: 'CLIENTE', name: 'QA Cliente' },
  { email: 'distrib_qa@jdenis.test', role: 'DISTRIBUIDOR', name: 'QA Distribuidor' },
  { email: 'ejecut_qa@jdenis.test', role: 'EJECUTIVO', name: 'QA Ejecutivo' },
  { email: 'fabrica_qa@jdenis.test', role: 'FABRICA', name: 'QA Fabrica' },
  { email: 'almacen_qa@jdenis.test', role: 'ALMACEN_PRODUCTO_FINAL', name: 'QA Almacen' }
];

async function run() {
  console.log('Starting account creation...');
  for (const acc of accounts) {
    const { data: result, error } = await supabase.auth.signUp({
      email: acc.email,
      password: 'JDenisQA2026!',
      options: {
        data: {
          full_name: acc.name,
          role: acc.role
        }
      }
    });
    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`User ${acc.email} already exists.`);
      } else {
        console.error(`Error with ${acc.email}:`, error);
      }
    } else {
      console.log(`Created ${acc.email} | ID: ${result.user.id}`);
      
      // Attempt to sync into public.users
      const { error: insertError } = await supabase
        .from('users')
        .upsert([
            {
                id: result.user.id,
                email: acc.email,
                full_name: acc.name,
                role: acc.role,
            }
        ]);
        if (insertError) {
          console.error(`Could not insert to public.users for ${acc.email}`, insertError);
        } else {
          console.log(`Saved ${acc.email} to public.users with role ${acc.role}`);
        }
    }
  }
}

run();
