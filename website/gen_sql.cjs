const crypto = require('crypto');

const accounts = [
  { email: 'admin_qa@jdenis.test', role: 'ADMIN', name: 'QA Admin' },
  { email: 'cliente_qa@jdenis.test', role: 'CLIENTE', name: 'QA Cliente' },
  { email: 'distrib_qa@jdenis.test', role: 'DISTRIBUIDOR', name: 'QA Distribuidor' },
  { email: 'ejecut_qa@jdenis.test', role: 'EJECUTIVO', name: 'QA Ejecutivo' },
  { email: 'fabrica_qa@jdenis.test', role: 'FABRICA', name: 'QA Fabrica' },
  { email: 'almacen_qa@jdenis.test', role: 'ALMACEN_PRODUCTO_FINAL', name: 'QA Almacen' }
];

const pwdHash = '$2b$10$mceAjdRc4A96YHBYxXGcsuOXPp5k82i4E5BgbQoTT5AIv8V8vVK0C';

let insertAuthUsers = `INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES \n`;
let insertPublicUsers = `INSERT INTO public.users (id, email, full_name, role) VALUES \n`;

let authParams = [];
let pubParams = [];

accounts.forEach((acc, idx) => {
  const id = crypto.randomUUID();
  const rawApp = JSON.stringify({ provider: "email", providers: ["email"] });
  const rawUser = JSON.stringify({ sub: id, email: acc.email, full_name: acc.name, role: acc.role, email_verified: true });
  const timestamp = new Date().toISOString();
  
  authParams.push(`('00000000-0000-0000-0000-000000000000', '${id}', 'authenticated', 'authenticated', '${acc.email}', '${pwdHash}', '${timestamp}', '${rawApp}', '${rawUser}', '${timestamp}', '${timestamp}')`);
  
  pubParams.push(`('${id}', '${acc.email}', '${acc.name}', '${acc.role}')`);
});

insertAuthUsers += authParams.join(',\n') + ';';
insertPublicUsers += pubParams.join(',\n') + ';';

console.log(insertAuthUsers);
console.log('\n\n');
console.log(insertPublicUsers);
