const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const users = [
    { email: 'transportista@jdenis.com', pass: 'transportista123', name: 'Operador de Transporte', role: 'TRANSPORTISTA' },
    { email: 'almacenmp@jdenis.com', pass: 'almacenmp123', name: 'Responsable Almacen MP', role: 'ALMACEN_MATERIA_PRIMA' },
    { email: 'almacenpf@jdenis.com', pass: 'almacenpf123', name: 'Responsable Almacen PF', role: 'ALMACEN_PRODUCTO_FINAL' },
    { email: 'fabrica@jdenis.com', pass: 'fabrica123', name: 'Encargado de Fabrica', role: 'FABRICA' },
    { email: 'ejecutivo@jdenis.com', pass: 'ejecutivo123', name: 'Ejecutivo de Ventas', role: 'EJECUTIVO' },
    { email: 'cliente@jdenis.com', pass: 'cliente123', name: 'Cliente Demo', role: 'CLIENTE' }
];

const resources = [
    { category: 'MATERIA_PRIMA', title: 'Adhesivo Industrial', format: 'LITROS', quantity: 100, brand: 'Marca A' },
    { category: 'MATERIA_PRIMA', title: 'Fibra Sintetica', format: 'KILOGRAMOS', quantity: 50, brand: 'FibraTech' },
    { category: 'EMBALAJE', title: 'Caja de Carton 30x30', format: 'PIEZA', quantity: 500, brand: 'PackPro' },
    { category: 'EMBALAJE', title: 'Bolsa Plastico Zip', format: 'PIEZA', quantity: 1000, brand: 'ZipSeal' },
    { category: 'PRODUCTO_FINAL', title: 'Pestanas Mink 3D', format: 'PIEZA', quantity: 200, brand: 'J DENIS', satCode: '39101510' },
    { category: 'PRODUCTO_FINAL', title: 'Pestanas Classic', format: 'PIEZA', quantity: 150, brand: 'J DENIS', satCode: '39101511' },
    { category: 'VEHICULOS', title: 'Camion TR-001', format: 'PIEZA', quantity: 1, brand: 'Ford' },
    { category: 'VEHICULOS', title: 'Camioneta VAN-02', format: 'PIEZA', quantity: 1, brand: 'Mercedes' }
];

async function seed() {
    console.log('=== SEED STARTED ===');

    // Create users
    for (const u of users) {
        try {
            const hash = bcrypt.hashSync(u.pass, 10);
            await prisma.user.upsert({
                where: { email: u.email },
                update: { passwordHash: hash },
                create: { email: u.email, passwordHash: hash, fullName: u.name, role: u.role }
            });
            console.log('User OK:', u.email);
        } catch (e) {
            console.log('User SKIP:', u.email, e.code || e.message);
        }
    }

    // Create resources
    for (const r of resources) {
        try {
            await prisma.resource.create({ data: r });
            console.log('Resource OK:', r.title);
        } catch (e) {
            console.log('Resource SKIP:', r.title, e.code || e.message);
        }
    }

    // Create customer
    try {
        await prisma.customer.upsert({
            where: { id: 'customer-demo' },
            update: {},
            create: {
                id: 'customer-demo',
                name: 'Cliente Mayorista S.A.',
                contactName: 'Maria Gonzalez',
                email: 'compras@cliente.com',
                phone: '+52 987 654 3210',
                address: 'Av. Comercial 456, Ciudad'
            }
        });
        console.log('Customer OK');
    } catch (e) {
        console.log('Customer SKIP:', e.code || e.message);
    }

    console.log('=== SEED COMPLETE ===');
    await prisma.$disconnect();
}

seed().catch(e => {
    console.error('FATAL:', e);
    process.exit(1);
});
