const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function seed() {
    console.log('Clearing existing users...');
    await p.user.deleteMany({});

    const users = [
        { email: 'admin@jdenis.com', pass: 'admin123', name: 'Administrador J DENIS', role: 'ADMIN' },
        { email: 'transportista@jdenis.com', pass: 'transportista123', name: 'Operador de Transporte', role: 'TRANSPORTISTA' },
        { email: 'almacenmp@jdenis.com', pass: 'almacenmp123', name: 'Responsable Almacen MP', role: 'ALMACEN_MATERIA_PRIMA' },
        { email: 'almacenpf@jdenis.com', pass: 'almacenpf123', name: 'Responsable Almacen PF', role: 'ALMACEN_PRODUCTO_FINAL' },
        { email: 'fabrica@jdenis.com', pass: 'fabrica123', name: 'Encargado de Fabrica', role: 'FABRICA' },
        { email: 'ejecutivo@jdenis.com', pass: 'ejecutivo123', name: 'Ejecutivo de Ventas', role: 'EJECUTIVO' },
        { email: 'cliente@jdenis.com', pass: 'cliente123', name: 'Cliente Demo', role: 'CLIENTE' }
    ];

    console.log('Creating users...');
    for (const u of users) {
        const hash = bcrypt.hashSync(u.pass, 10);
        await p.user.create({
            data: { email: u.email, passwordHash: hash, fullName: u.name, role: u.role }
        });
        console.log('Created:', u.email);
    }

    console.log('Creating resources...');
    await p.resource.deleteMany({});
    const resources = [
        { category: 'MATERIA_PRIMA', title: 'Adhesivo Industrial', format: 'LITROS', quantity: 100, brand: 'Marca A' },
        { category: 'EMBALAJE', title: 'Caja de Carton 30x30', format: 'PIEZA', quantity: 500, brand: 'PackPro' },
        { category: 'PRODUCTO_FINAL', title: 'Pestanas Mink 3D', format: 'PIEZA', quantity: 200, brand: 'J DENIS', satCode: '39101510' },
        { category: 'VEHICULOS', title: 'Camion TR-001', format: 'PIEZA', quantity: 1, brand: 'Ford' }
    ];
    for (const r of resources) {
        await p.resource.create({ data: r });
        console.log('Created resource:', r.title);
    }

    console.log('Creating customer...');
    await p.customer.deleteMany({});
    await p.customer.create({
        data: {
            name: 'Cliente Mayorista S.A.',
            contactName: 'Maria Gonzalez',
            email: 'compras@cliente.com',
            phone: '+52 987 654 3210',
            address: 'Av. Comercial 456, Ciudad'
        }
    });

    console.log('Seed complete!');
    await p.$disconnect();
}

seed().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
