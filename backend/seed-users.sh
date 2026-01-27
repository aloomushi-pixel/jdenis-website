#!/bin/sh
cd /app

# Generate hashes and create SQL
echo "Generating password hashes..."
TRANS_HASH=$(node -e "console.log(require('bcrypt').hashSync('transportista123',10))")
AMP_HASH=$(node -e "console.log(require('bcrypt').hashSync('almacenmp123',10))")
APF_HASH=$(node -e "console.log(require('bcrypt').hashSync('almacenpf123',10))")
FAB_HASH=$(node -e "console.log(require('bcrypt').hashSync('fabrica123',10))")
EJE_HASH=$(node -e "console.log(require('bcrypt').hashSync('ejecutivo123',10))")
CLI_HASH=$(node -e "console.log(require('bcrypt').hashSync('cliente123',10))")

echo "Inserting users..."
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const data = [
  { email: 'transportista@jdenis.com', passwordHash: '$TRANS_HASH', fullName: 'Operador Transporte', role: 'TRANSPORTISTA' },
  { email: 'almacenmp@jdenis.com', passwordHash: '$AMP_HASH', fullName: 'Almacen MP', role: 'ALMACEN_MATERIA_PRIMA' },
  { email: 'almacenpf@jdenis.com', passwordHash: '$APF_HASH', fullName: 'Almacen PF', role: 'ALMACEN_PRODUCTO_FINAL' },
  { email: 'fabrica@jdenis.com', passwordHash: '$FAB_HASH', fullName: 'Fabrica', role: 'FABRICA' },
  { email: 'ejecutivo@jdenis.com', passwordHash: '$EJE_HASH', fullName: 'Ejecutivo', role: 'EJECUTIVO' },
  { email: 'cliente@jdenis.com', passwordHash: '$CLI_HASH', fullName: 'Cliente', role: 'CLIENTE' }
];

(async () => {
  for (const d of data) {
    try {
      await p.user.create({ data: d });
      console.log('Created:', d.email);
    } catch(e) {
      console.log('Skip:', d.email, e.message);
    }
  }
  await p.\$disconnect();
  console.log('Done!');
})();
"

echo "Seed complete"
