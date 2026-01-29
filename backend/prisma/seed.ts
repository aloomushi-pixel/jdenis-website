import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed with updated roles...');

    // Create users with 7 roles
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@jdenis.com' },
        update: {},
        create: {
            email: 'admin@jdenis.com',
            passwordHash: adminPassword,
            fullName: 'Administrador J DENIS',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created');

    // Usuario administrador personal
    const personalAdminPassword = await bcrypt.hash('Darepamaxidi7', 10);
    const personalAdmin = await prisma.user.upsert({
        where: { email: 'caballeroangela49@gmail.com' },
        update: {},
        create: {
            email: 'caballeroangela49@gmail.com',
            passwordHash: personalAdminPassword,
            fullName: 'Angela Caballero',
            role: 'ADMIN',
        },
    });
    console.log('✅ Personal Admin user created');

    const transportistaPassword = await bcrypt.hash('transportista123', 10);
    const transportista = await prisma.user.upsert({
        where: { email: 'transportista@jdenis.com' },
        update: {},
        create: {
            email: 'transportista@jdenis.com',
            passwordHash: transportistaPassword,
            fullName: 'Operador de Transporte',
            role: 'TRANSPORTISTA',
        },
    });
    console.log('✅ Transportista created');

    const almacenMPPassword = await bcrypt.hash('almacenmp123', 10);
    const almacenMP = await prisma.user.upsert({
        where: { email: 'almacenmp@jdenis.com' },
        update: {},
        create: {
            email: 'almacenmp@jdenis.com',
            passwordHash: almacenMPPassword,
            fullName: 'Responsable Almacén Materia Prima',
            role: 'ALMACEN_MATERIA_PRIMA',
        },
    });
    console.log('✅ Almacén Materia Prima user created');

    const almacenPFPassword = await bcrypt.hash('almacenpf123', 10);
    const almacenPF = await prisma.user.upsert({
        where: { email: 'almacenpf@jdenis.com' },
        update: {},
        create: {
            email: 'almacenpf@jdenis.com',
            passwordHash: almacenPFPassword,
            fullName: 'Responsable Almacén Producto Final',
            role: 'ALMACEN_PRODUCTO_FINAL',
        },
    });
    console.log('✅ Almacén Producto Final user created');

    const fabricaPassword = await bcrypt.hash('fabrica123', 10);
    const fabrica = await prisma.user.upsert({
        where: { email: 'fabrica@jdenis.com' },
        update: {},
        create: {
            email: 'fabrica@jdenis.com',
            passwordHash: fabricaPassword,
            fullName: 'Encargado de Fábrica',
            role: 'FABRICA',
        },
    });
    console.log('✅ Fábrica user created');

    const ejecutivoPassword = await bcrypt.hash('ejecutivo123', 10);
    const ejecutivo = await prisma.user.upsert({
        where: { email: 'ejecutivo@jdenis.com' },
        update: {},
        create: {
            email: 'ejecutivo@jdenis.com',
            passwordHash: ejecutivoPassword,
            fullName: 'Ejecutivo de Ventas',
            role: 'EJECUTIVO',
        },
    });
    console.log('✅ Ejecutivo user created');

    const clientePassword = await bcrypt.hash('cliente123', 10);
    const cliente = await prisma.user.upsert({
        where: { email: 'cliente@jdenis.com' },
        update: {},
        create: {
            email: 'cliente@jdenis.com',
            passwordHash: clientePassword,
            fullName: 'Cliente Demo',
            role: 'CLIENTE',
        },
    });
    console.log('✅ Cliente user created');

    // Create inventory locations
    const officeLocation = await prisma.inventoryLocation.upsert({
        where: { id: 'office-location' },
        update: {},
        create: {
            id: 'office-location',
            name: 'Oficina Central',
            locationType: 'OFFICE',
        },
    });

    const factoryLocation = await prisma.inventoryLocation.upsert({
        where: { id: 'factory-location' },
        update: {},
        create: {
            id: 'factory-location',
            name: 'Fábrica Principal',
            locationType: 'FACTORY',
            capacity: 10000,
        },
    });

    const warehouseLocation = await prisma.inventoryLocation.upsert({
        where: { id: 'warehouse-location' },
        update: {},
        create: {
            id: 'warehouse-location',
            name: 'Almacén Central',
            locationType: 'WAREHOUSE',
            capacity: 50000,
        },
    });
    console.log('✅ Inventory locations created');

    // Create sample products
    const rawMaterial1 = await prisma.product.create({
        data: {
            sku: 'RM-001',
            name: 'Materia Prima A',
            description: 'Material base para producción',
            type: 'RAW_MATERIAL',
            unit: 'kg',
        },
    });

    const finishedProduct1 = await prisma.product.create({
        data: {
            sku: 'FP-001',
            name: 'Producto Final A',
            description: 'Producto terminado tipo A',
            type: 'FINISHED_PRODUCT',
            unit: 'unidades',
        },
    });
    console.log('✅ Sample products created');

    // Create initial stock
    await prisma.stock.createMany({
        data: [
            {
                productId: rawMaterial1.id,
                locationId: factoryLocation.id,
                quantity: 500,
                updatedBy: admin.id,
            },
            {
                productId: finishedProduct1.id,
                locationId: warehouseLocation.id,
                quantity: 150,
                updatedBy: admin.id,
            },
        ],
    });
    console.log('✅ Initial stock created');

    // Create sample resources
    await prisma.resource.createMany({
        data: [
            {
                id: 'res-mp-001',
                category: 'MATERIA_PRIMA',
                title: 'Adhesivo Industrial',
                format: 'LITROS',
                quantity: 100,
                brand: 'Marca A',
            },
            {
                id: 'res-emb-001',
                category: 'EMBALAJE',
                title: 'Caja de Cartón 30x30',
                format: 'PIEZA',
                quantity: 500,
                brand: 'PackPro',
            },
            {
                id: 'res-pf-001',
                category: 'PRODUCTO_FINAL',
                title: 'Pestañas Mink 3D',
                format: 'PIEZA',
                quantity: 200,
                brand: 'J DENIS',
                satCode: '39101510',
                rawMaterialComposition: JSON.stringify({
                    'Adhesivo': 0.5,
                    'Fibra': 1.0,
                }),
            },
            {
                id: 'res-veh-001',
                category: 'VEHICULOS',
                title: 'Camión TR-001',
                format: 'PIEZA',
                quantity: 1,
                brand: 'Ford',
            },
        ],
    });
    console.log('✅ Resources created');

    // Create supplier and customer
    const supplier = await prisma.supplier.create({
        data: {
            name: 'Proveedor Principal S.A.',
            contactName: 'Juan Pérez',
            email: 'contacto@proveedor.com',
            phone: '+52 123 456 7890',
            address: 'Calle Principal 123, Ciudad',
        },
    });

    const customer = await prisma.customer.create({
        data: {
            name: 'Cliente Mayorista S.A.',
            contactName: 'María González',
            email: 'compras@cliente.com',
            phone: '+52 987 654 3210',
            address: 'Av. Comercial 456, Ciudad',
        },
    });
    console.log('✅ Sample supplier and customer created');

    // Create storage racks
    await prisma.storageRack.createMany({
        data: [
            {
                rackCode: 'R-A-01',
                locationId: warehouseLocation.id,
                capacity: 1000,
                currentUtilization: 150,
            },
            {
                rackCode: 'R-A-02',
                locationId: warehouseLocation.id,
                capacity: 1000,
                currentUtilization: 200,
            },
            {
                rackCode: 'R-B-01',
                locationId: warehouseLocation.id,
                capacity: 1500,
                currentUtilization: 0,
            },
        ],
    });
    console.log('✅ Storage racks created');

    // Create vehicles
    await prisma.vehicle.createMany({
        data: [
            {
                vehicleNumber: 'VH-001',
                vehicleType: 'Camión 3.5 ton',
                capacity: 3500,
                status: 'AVAILABLE',
            },
            {
                vehicleNumber: 'VH-002',
                vehicleType: 'Camioneta',
                capacity: 1000,
                status: 'AVAILABLE',
            },
        ],
    });
    console.log('✅ Vehicles created');

    // Create protocol templates
    await prisma.protocolTemplate.createMany({
        data: [
            {
                name: 'Protocolo de Entrada de Materiales',
                type: 'FACTORY_MATERIAL_ENTRY',
                description: 'Verificación y registro de materiales entrantes a fábrica',
                steps: JSON.stringify([
                    { order: 1, description: 'Verificar orden de compra', required: true },
                    { order: 2, description: 'Inspeccionar calidad del material', required: true },
                    { order: 3, description: 'Pesar/Contar cantidad recibida', required: true },
                    { order: 4, description: 'Registrar en sistema', required: true },
                    { order: 5, description: 'Almacenar en área designada', required: true },
                ]),
            },
            {
                name: 'Protocolo de Salida de Producción',
                type: 'FACTORY_PRODUCTION_OUTPUT',
                description: 'Verificación de productos terminados salientes de fábrica',
                steps: JSON.stringify([
                    { order: 1, description: 'Verificar lote de producción', required: true },
                    { order: 2, description: 'Control de calidad del producto', required: true },
                    { order: 3, description: 'Contar unidades producidas', required: true },
                    { order: 4, description: 'Etiquetar productos', required: true },
                    { order: 5, description: 'Generar documentación de salida', required: true },
                ]),
            },
            {
                name: 'Protocolo de Recepción en Almacén',
                type: 'WAREHOUSE_RECEIVING',
                description: 'Recepción y almacenaje de productos desde fábrica',
                steps: JSON.stringify([
                    { order: 1, description: 'Verificar documentación de origen', required: true },
                    { order: 2, description: 'Inspeccionar estado del producto', required: true },
                    { order: 3, description: 'Confirmar cantidad recibida', required: true },
                    { order: 4, description: 'Asignar ubicación en rack', required: true },
                    { order: 5, description: 'Actualizar inventario', required: true },
                ]),
            },
            {
                name: 'Protocolo de Despacho',
                type: 'WAREHOUSE_DISPATCH',
                description: 'Preparación y entrega de productos a transportista',
                steps: JSON.stringify([
                    { order: 1, description: 'Verificar orden de venta', required: true },
                    { order: 2, description: 'Localizar productos en almacén', required: true },
                    { order: 3, description: 'Preparar embalaje', required: true },
                    { order: 4, description: 'Verificar cantidad y calidad', required: true },
                    { order: 5, description: 'Generar documentación de envío', required: true },
                    { order: 6, description: 'Realizar entrega a transportista', required: true },
                ]),
            },
        ],
    });
    console.log('✅ Protocol templates created');

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n📝 Test users created (7 roles + 1 personal admin):');
    console.log('   👤 Personal Admin: caballeroangela49@gmail.com / Darepamaxidi7');
    console.log('   Admin: admin@jdenis.com / admin123');
    console.log('   Transportista: transportista@jdenis.com / transportista123');
    console.log('   Almacén MP: almacenmp@jdenis.com / almacenmp123');
    console.log('   Almacén PF: almacenpf@jdenis.com / almacenpf123');
    console.log('   Fábrica: fabrica@jdenis.com / fabrica123');
    console.log('   Ejecutivo: ejecutivo@jdenis.com / ejecutivo123');
    console.log('   Cliente: cliente@jdenis.com / cliente123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
